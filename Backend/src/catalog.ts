import { Controller, Get, Injectable, NotFoundException, Param, Query } from '@nestjs/common';
import { FuelType, Prisma, Transmission } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { DatabaseService } from './database.service';

export class FleetQuery {
  @Type(() => Number) @IsInt() @Min(1) @Max(10000) page = 1;
  @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
  @IsOptional() @IsString() @MaxLength(160) @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) branch?: string;
  @IsOptional() @IsString() @MaxLength(80) @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) category?: string;
  @IsOptional() @IsEnum(Transmission) transmission?: Transmission;
  @IsOptional() @IsEnum(FuelType) fuelType?: FuelType;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(99) seats?: number;
}

// Explicit public projection keeps VIN and registration out of customer responses.
const publicVehicle = {
  id: true, slug: true, make: true, model: true, modelYear: true, seats: true,
  transmission: true, fuelType: true, baseDailyMinor: true, currency: true,
  branch: { select: { slug: true, name: true, timezone: true, address: true } },
  category: { select: { slug: true, name: true } },
  images: { select: { url: true, altText: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
} satisfies Prisma.VehicleSelect;

type PublicVehicle = Prisma.VehicleGetPayload<{ select: typeof publicVehicle }>;
function serialize(vehicle: PublicVehicle) {
  return { ...vehicle, baseDailyMinor: vehicle.baseDailyMinor.toString() };
}

@Injectable()
export class CatalogService {
  constructor(private readonly db: DatabaseService) {}

  branches() {
    return this.db.branch.findMany({ where: { active: true }, select: {
      slug: true, name: true, timezone: true, address: true,
    }, orderBy: [{ name: 'asc' }, { id: 'asc' }] });
  }

  categories() {
    return this.db.category.findMany({ select: { slug: true, name: true }, orderBy: [{ name: 'asc' }, { id: 'asc' }] });
  }

  async vehicles(query: FleetQuery) {
    const where: Prisma.VehicleWhereInput = {
      status: 'ACTIVE', branch: { active: true, slug: query.branch },
      category: query.category ? { slug: query.category } : undefined,
      transmission: query.transmission, fuelType: query.fuelType,
      seats: query.seats ? { gte: query.seats } : undefined,
    };
    const [vehicles, total] = await this.db.$transaction([
      this.db.vehicle.findMany({ where, select: publicVehicle, skip: (query.page - 1) * query.limit,
        take: query.limit, orderBy: [{ make: 'asc' }, { model: 'asc' }, { id: 'asc' }] }),
      this.db.vehicle.count({ where }),
    ], { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
    return { data: vehicles.map(serialize), pagination: { page: query.page, limit: query.limit, total } };
  }

  async vehicle(slug: string) {
    const vehicle = await this.db.vehicle.findFirst({
      where: { slug, status: 'ACTIVE', branch: { active: true } }, select: publicVehicle,
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return serialize(vehicle);
  }
}

@Controller('api/v1')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}
  @Get('branches') branches() { return this.catalog.branches(); }
  @Get('categories') categories() { return this.catalog.categories(); }
  @Get('vehicles') vehicles(@Query() query: FleetQuery) { return this.catalog.vehicles(query); }
  @Get('vehicles/:slug') vehicle(@Param('slug') slug: string) { return this.catalog.vehicle(slug); }
}
