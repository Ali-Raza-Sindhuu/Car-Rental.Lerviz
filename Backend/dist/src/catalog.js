"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogController = exports.CatalogService = exports.FleetQuery = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const database_service_1 = require("./database.service");
class FleetQuery {
    page = 1;
    limit = 20;
    branch;
    category;
    transmission;
    fuelType;
    seats;
}
exports.FleetQuery = FleetQuery;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Object)
], FleetQuery.prototype, "page", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Object)
], FleetQuery.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    __metadata("design:type", String)
], FleetQuery.prototype, "branch", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    __metadata("design:type", String)
], FleetQuery.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Transmission),
    __metadata("design:type", String)
], FleetQuery.prototype, "transmission", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.FuelType),
    __metadata("design:type", String)
], FleetQuery.prototype, "fuelType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], FleetQuery.prototype, "seats", void 0);
// Explicit public projection keeps VIN and registration out of customer responses.
const publicVehicle = {
    id: true, slug: true, make: true, model: true, modelYear: true, seats: true,
    transmission: true, fuelType: true, baseDailyMinor: true, currency: true,
    branch: { select: { slug: true, name: true, timezone: true, address: true } },
    category: { select: { slug: true, name: true } },
    images: { select: { url: true, altText: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
};
function serialize(vehicle) {
    return { ...vehicle, baseDailyMinor: vehicle.baseDailyMinor.toString() };
}
let CatalogService = class CatalogService {
    db;
    constructor(db) {
        this.db = db;
    }
    branches() {
        return this.db.branch.findMany({ where: { active: true }, select: {
                slug: true, name: true, timezone: true, address: true,
            }, orderBy: [{ name: 'asc' }, { id: 'asc' }] });
    }
    categories() {
        return this.db.category.findMany({ select: { slug: true, name: true }, orderBy: [{ name: 'asc' }, { id: 'asc' }] });
    }
    async vehicles(query) {
        const where = {
            status: 'ACTIVE', branch: { active: true, slug: query.branch },
            category: query.category ? { slug: query.category } : undefined,
            transmission: query.transmission, fuelType: query.fuelType,
            seats: query.seats ? { gte: query.seats } : undefined,
        };
        const [vehicles, total] = await this.db.$transaction([
            this.db.vehicle.findMany({ where, select: publicVehicle, skip: (query.page - 1) * query.limit,
                take: query.limit, orderBy: [{ make: 'asc' }, { model: 'asc' }, { id: 'asc' }] }),
            this.db.vehicle.count({ where }),
        ], { isolationLevel: client_1.Prisma.TransactionIsolationLevel.RepeatableRead });
        return { data: vehicles.map(serialize), pagination: { page: query.page, limit: query.limit, total } };
    }
    async vehicle(slug) {
        const vehicle = await this.db.vehicle.findFirst({
            where: { slug, status: 'ACTIVE', branch: { active: true } }, select: publicVehicle,
        });
        if (!vehicle)
            throw new common_1.NotFoundException('Vehicle not found');
        return serialize(vehicle);
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CatalogService);
let CatalogController = class CatalogController {
    catalog;
    constructor(catalog) {
        this.catalog = catalog;
    }
    branches() { return this.catalog.branches(); }
    categories() { return this.catalog.categories(); }
    vehicles(query) { return this.catalog.vehicles(query); }
    vehicle(slug) { return this.catalog.vehicle(slug); }
};
exports.CatalogController = CatalogController;
__decorate([
    (0, common_1.Get)('branches'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "branches", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "categories", null);
__decorate([
    (0, common_1.Get)('vehicles'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FleetQuery]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "vehicles", null);
__decorate([
    (0, common_1.Get)('vehicles/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "vehicle", null);
exports.CatalogController = CatalogController = __decorate([
    (0, common_1.Controller)('api/v1'),
    __metadata("design:paramtypes", [CatalogService])
], CatalogController);
//# sourceMappingURL=catalog.js.map