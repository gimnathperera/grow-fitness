import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../../schemas/location.schema';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async findAll(): Promise<Location[]> {
    return this.locationModel.find().sort({ label: 1 }).exec();
  }

  async findOne(id: string): Promise<Location | null> {
    return this.locationModel.findById(id).exec();
  }

  async create(createLocationDto: { label: string }): Promise<Location> {
    const location = new this.locationModel(createLocationDto);
    return location.save();
  }

  async update(
    id: string,
    updateLocationDto: { label?: string },
  ): Promise<Location | null> {
    return this.locationModel
      .findByIdAndUpdate(id, updateLocationDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Location | null> {
    return this.locationModel.findByIdAndDelete(id).exec();
  }
}
