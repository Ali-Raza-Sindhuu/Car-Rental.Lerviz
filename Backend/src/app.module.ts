import { Controller, Get, Module, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CatalogController, CatalogService } from './catalog';

@Controller('health')
export class HealthController {
  constructor(private readonly db: DatabaseService) {}
  @Get('live') live() { return { status: 'ok' }; }
  @Get('ready') async ready() {
    try {
      await this.db.$queryRaw`SELECT 1`;
      // Verify the catalog migration as well as the database connection.
      await this.db.vehicle.count();
      return { status: 'ok', database: 'connected' };
    } catch {
      throw new ServiceUnavailableException('Database not ready');
    }
  }
}

@Module({ controllers: [HealthController, CatalogController], providers: [DatabaseService, CatalogService] })
export class AppModule {}
