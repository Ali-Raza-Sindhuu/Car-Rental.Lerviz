import bcrypt from 'bcrypt';
import { PrismaClient, BookingStatus } from '@prisma/client';
import { priceRental } from '../src/modules/bookings/pricing.service';

const db = new PrismaClient();
const day = 86400000;
const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const at = (offset: number) => new Date(today.getTime() + offset * day);

async function seed() {
  const adminHash = await bcrypt.hash('Admin@12345', 12);
  await db.user.upsert({ where: { email: 'admin@carrental.com' }, update: {}, create: { email: 'admin@carrental.com', fullName: 'Demo Administrator', passwordHash: adminHash, role: 'ADMIN' } });
  const customerHash = await bcrypt.hash('Customer@12345', 12);
  const customers = [];
  for (let i = 1; i <= 3; i++) {
    const user = await db.user.upsert({ where: { email: `customer${i}@example.com` }, update: {}, create: { email: `customer${i}@example.com`, fullName: `Demo Customer ${i}`, phone: `+1555000000${i}`, passwordHash: customerHash } });
    await db.customerProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, dateOfBirth: new Date(`199${i}-05-15`), drivingLicenseNo: `DEMO-LICENSE-${i}`, licenseExpiry: new Date('2035-12-31'), address: `${i} Main Street`, city: 'Karachi', country: 'Pakistan' } });
    customers.push(user);
  }

  const locations = [];
  for (const [name, city, address] of [
    ['City Center', 'Karachi', 'Shahrah-e-Faisal'],
    ['Airport', 'Karachi', 'Jinnah International Airport'],
    ['Capital Branch', 'Islamabad', 'Blue Area'],
  ]) {
    let location = await db.location.findFirst({ where: { name, city } });
    location ??= await db.location.create({ data: { name, city, address, phone: '+922100000000' } });
    locations.push(location);
  }

  const categories = [];
  for (const [name, rate, deposit] of [
    ['Economy', 45, 150], ['Compact', 60, 200], ['SUV', 95, 350], ['Luxury', 180, 700], ['Van', 120, 450],
  ] as const) {
    categories.push(await db.vehicleCategory.upsert({ where: { name }, update: {}, create: { name, description: `${name} rental vehicles`, baseDailyRate: rate, depositAmount: deposit } }));
  }

  const models = [
    ['Toyota', 'Yaris'], ['Honda', 'City'], ['Suzuki', 'Swift'], ['Hyundai', 'Elantra'],
    ['Toyota', 'Corolla'], ['Honda', 'Civic'], ['Kia', 'Sportage'], ['Hyundai', 'Tucson'],
    ['Toyota', 'Fortuner'], ['Honda', 'BR-V'], ['BMW', '320i'], ['Mercedes', 'C200'],
    ['Audi', 'A4'], ['Lexus', 'ES'], ['BMW', 'X5'], ['Toyota', 'Hiace'],
    ['Kia', 'Carnival'], ['Hyundai', 'Staria'], ['Toyota', 'Hilux'], ['Suzuki', 'Alto'],
  ];
  const vehicles = [];
  for (let i = 0; i < models.length; i++) {
    const category = categories[Math.floor(i / 4)];
    const location = locations[i % locations.length];
    const [make, model] = models[i];
    const plateNo = `DEMO-${String(i + 1).padStart(3, '0')}`;
    const vehicle = await db.vehicle.upsert({ where: { plateNo }, update: {}, create: {
      plateNo, vin: `DEMO0000000${String(i + 1).padStart(6, '0')}`, make, model,
      categoryId: category.id, locationId: location.id, year: 2021 + (i % 5),
      transmission: i % 3 === 0 ? 'MANUAL' : 'AUTOMATIC', fuelType: i % 5 === 0 ? 'HYBRID' : 'PETROL',
      seats: i >= 15 && i <= 17 ? 8 : 5, doors: 4, color: ['White', 'Black', 'Silver', 'Blue'][i % 4],
      mileageKm: 10000 + i * 2300, dailyRate: category.baseDailyRate,
    } });
    vehicles.push(vehicle);
    if (!(await db.vehicleImage.findFirst({ where: { vehicleId: vehicle.id } }))) {
      await db.vehicleImage.create({ data: { vehicleId: vehicle.id, url: `https://placehold.co/1200x800?text=${encodeURIComponent(`${make} ${model}`)}`, isPrimary: true } });
    }
  }

  for (const [code, value] of [['WELCOME10', 10], ['WEEKEND15', 15]] as const) {
    await db.coupon.upsert({ where: { code }, update: {}, create: { code, discountType: 'PERCENT', value, minDays: 1, validFrom: at(-365), validTo: at(365), maxUses: 100 } });
  }

  const demoBookings: { status: BookingStatus; start: number; length: number }[] = [
    { status: 'PENDING', start: 12, length: 3 }, { status: 'PENDING', start: 15, length: 2 },
    { status: 'CONFIRMED', start: 5, length: 4 }, { status: 'CONFIRMED', start: 8, length: 2 },
    { status: 'ACTIVE', start: -1, length: 4 }, { status: 'ACTIVE', start: -2, length: 5 },
    { status: 'COMPLETED', start: -30, length: 3 }, { status: 'COMPLETED', start: -24, length: 4 },
    { status: 'CANCELLED', start: 18, length: 2 }, { status: 'REJECTED', start: 20, length: 2 },
  ];
  for (let i = 0; i < demoBookings.length; i++) {
    const { status, start, length } = demoBookings[i];
    const vehicle = vehicles[i];
    const category = categories[Math.floor(i / 4)];
    const location = locations[i % locations.length];
    const bookingNo = `DEMO-${String(i + 1).padStart(5, '0')}`;
    const price = priceRental(at(start), at(start + length), vehicle.dailyRate, category.depositAmount);
    const booking = await db.booking.upsert({ where: { bookingNo }, update: {}, create: {
      bookingNo, customerId: customers[i % customers.length].id, vehicleId: vehicle.id,
      pickupLocationId: location.id, dropoffLocationId: location.id,
      startAt: at(start), endAt: at(start + length), status, ...price,
      ...(status === 'COMPLETED' ? { actualReturnAt: at(start + length) } : {}),
      ...(status === 'CANCELLED' || status === 'REJECTED' ? { cancelReason: 'Demo reservation' } : {}),
    } });
    if (['CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(status) && !(await db.payment.findFirst({ where: { bookingId: booking.id } }))) {
      await db.payment.createMany({ data: [
        { bookingId: booking.id, type: 'RENTAL', amount: price.totalAmount, method: 'CARD', status: 'PAID', paidAt: at(Math.min(start - 2, 0)) },
        { bookingId: booking.id, type: 'DEPOSIT', amount: price.depositAmount, method: 'CARD', status: 'PAID', paidAt: at(Math.min(start - 2, 0)) },
      ] });
    }
    if (status === 'COMPLETED') {
      await db.review.upsert({ where: { bookingId: booking.id }, update: {}, create: { bookingId: booking.id, customerId: booking.customerId, vehicleId: booking.vehicleId, rating: 5 - (i % 2), comment: 'Clean car and a smooth rental experience.' } });
    }
  }
}

seed().then(() => db.$disconnect()).catch(async error => { console.error(error); await db.$disconnect(); process.exitCode = 1; });
