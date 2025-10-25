import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Child, ChildDocument } from '../../schemas/child.schema';
import { CreateChildDto } from './dto/child.dto';
import { UpdateChildDto } from './dto/update-child.dto';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectModel(Child.name) private childModel: Model<ChildDocument>,
  ) {}

  async findAll(parentId?: string): Promise<Child[]> {
    if (parentId && !Types.ObjectId.isValid(parentId)) {
      throw new NotFoundException('Invalid parent ID');
    }
    const filter = parentId ? { parentId: new Types.ObjectId(parentId) } : {};
    return this.childModel.find(filter).exec();
  }

  async findByParentId(parentId: string): Promise<Child[]> {
    if (!Types.ObjectId.isValid(parentId)) {
      throw new NotFoundException('Invalid parent ID');
    }
    return this.childModel.find({ parentId: new Types.ObjectId(parentId) }).exec();
  }

  async findOne(id: string): Promise<Child | null> {
    return this.childModel.findById(id).exec();
  }

  async create(childData: CreateChildDto): Promise<Child> {
    const child = new this.childModel(childData);
    return child.save();
  }

  async update(id: string, updateData: UpdateChildDto): Promise<Child | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid child ID');
    }
    return this.childModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Child | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid child ID');
    }
    return this.childModel.findByIdAndDelete(id).exec();
  }
}
