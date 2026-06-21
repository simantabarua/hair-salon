import { NextRequest } from "next/server";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { NotFoundError } from "@/lib/exceptions";

const serviceRepository = new ServiceRepository();

export class ServiceController {
  async getServices(req: NextRequest) {
    return serviceRepository.findAll();
  }

  async getServiceById(req: NextRequest, { params }: { params: { id: string } }) {
    const service = await serviceRepository.findById(params.id);
    if (!service) {
      throw new NotFoundError("Service not found.");
    }
    return service;
  }

  async createService(req: NextRequest) {
    const body = await req.json();
    return serviceRepository.create(body);
  }

  async updateService(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();
    const updated = await serviceRepository.update(params.id, body);
    if (!updated) {
      throw new NotFoundError("Service not found.");
    }
    return updated;
  }

  async deleteService(req: NextRequest, { params }: { params: { id: string } }) {
    const deleted = await serviceRepository.deleteSoft(params.id);
    if (!deleted) {
      throw new NotFoundError("Service not found.");
    }
    return { success: true, message: "Service deleted successfully." };
  }
}

export const serviceController = new ServiceController();
