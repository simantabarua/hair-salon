import { Service, IService } from "@/models/Service";

export class ServiceRepository {
  async findById(id: string, includeDeleted = false): Promise<IService | null> {
    const query: any = { _id: id };
    if (!includeDeleted) {
      query.isDeleted = { $ne: true };
    }
    return Service.findOne(query);
  }

  async findAll(includeDeleted = false): Promise<IService[]> {
    const query: any = {};
    if (!includeDeleted) {
      query.isDeleted = { $ne: true };
    }
    return Service.find(query).sort({ price: 1 });
  }

  async create(serviceData: Partial<IService>): Promise<IService> {
    const service = new Service(serviceData);
    return service.save();
  }

  async update(id: string, updateData: Partial<IService>): Promise<IService | null> {
    return Service.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: updateData },
      { new: true }
    );
  }

  async deleteSoft(id: string): Promise<IService | null> {
    return Service.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
  }
}
