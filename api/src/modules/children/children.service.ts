import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Child, ChildDocument } from '../../schemas/child.schema';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectModel(Child.name) private childModel: Model<ChildDocument>,
  ) {}

  async findAll(parentId?: string): Promise<Child[]> {
    const filter = parentId ? { parentId } : {};
    return this.childModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Child | null> {
    return this.childModel.findById(id).exec();
  }

  async create(childData: {
    name: string;
    parentId: string;
    birthDate: Date;
    goals: string[];
  }): Promise<Child> {
    const child = new this.childModel(childData);
    return child.save();
  }

  async update(id: string, updateData: Partial<Child>): Promise<Child | null> {
    return this.childModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Child | null> {
    return this.childModel.findByIdAndDelete(id).exec();
  }
}
