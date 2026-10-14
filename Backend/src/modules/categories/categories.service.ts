import { PrismaClient } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { pagination } from '../../common/utils/pagination';
import { AppError } from '../../common/errors/app-error';
import { z } from 'zod';
import { categoryListSchema, categorySchema, categoryUpdateSchema } from './categories.schema';

export class CategoriesService {
  constructor(private readonly db: PrismaClient = prisma) {}
  /** Lists vehicle categories with stable pagination. */
  async list(query: z.infer<typeof categoryListSchema>) {
    const [data, total] = await this.db.$transaction([
      this.db.vehicleCategory.findMany({ ...pagination(query), orderBy: { [query.sort]: 'asc' } }),
      this.db.vehicleCategory.count(),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }
  async create(input: z.infer<typeof categorySchema>) { return this.db.vehicleCategory.create({ data: input }); }
  async update(id: string, input: z.infer<typeof categoryUpdateSchema>) {
    await this.get(id);
    return this.db.vehicleCategory.update({ where: { id }, data: input });
  }
  async get(id: string) {
    const category = await this.db.vehicleCategory.findUnique({ where: { id } });
    if (!category) throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
    return category;
  }
  async remove(id: string) {
    await this.get(id);
    if (await this.db.vehicle.count({ where: { categoryId: id } })) throw new AppError(409, 'CATEGORY_IN_USE', 'Category has vehicles');
    await this.db.vehicleCategory.delete({ where: { id } });
  }
}
