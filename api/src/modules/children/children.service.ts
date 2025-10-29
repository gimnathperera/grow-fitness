import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Child, ChildDocument } from '../../schemas/child.schema';
import { CreateChildDto, UpdateChildDto } from './dto/child.dto';

@Injectable()
export class ChildrenService {
  private readonly logger = new Logger(ChildrenService.name);

  constructor(
    @InjectModel(Child.name) private readonly childModel: Model<ChildDocument>,
  ) {}

  /**
   * Fetch all children (optionally filtered by parentId)
   */
  async findAll(parentId?: string): Promise<Child[]> {
    this.logger.debug(`[ChildrenService] Fetching all children${parentId ? ` for parentId=${parentId}` : ''}`);

    if (parentId && !Types.ObjectId.isValid(parentId)) {
      this.logger.warn(`[ChildrenService] Invalid parent ID: ${parentId}`);
      throw new NotFoundException('Invalid parent ID');
    }

    const filter = parentId
      ? {
          $or: [
            { parentId: new Types.ObjectId(parentId) },
            { parentId },
          ],
        }
      : {};

    const result = await this.childModel.find(filter).lean().exec();
    this.logger.debug(`[ChildrenService] Found ${result.length} children`);
    return result;
  }

  /**
   * Find all children belonging to a specific parent
   */
async findByParentId(parentId: string): Promise<Child[]> {
  this.logger.debug(`[ChildrenService] Fetching children for parentId=${parentId}`);

  if (!parentId) throw new NotFoundException('Parent ID is required');

  // Only query using string
  const filter = { parentId };

  this.logger.debug(`[ChildrenService] Mongo filter used: ${JSON.stringify(filter)}`);

  const result = await this.childModel.find(filter).lean().exec();

  this.logger.debug(`[ChildrenService] Found ${result.length} children for parentId=${parentId}`);
  if (result.length === 0) {
    this.logger.warn('[ChildrenService] No children returned — check DB storage type for parentId');
  }

  return result;
}



  /**
   * Find a single child by ID
   */
  async findOne(id: string): Promise<Child | null> {
    this.logger.debug(`[ChildrenService] Fetching child with id=${id}`);

    if (!Types.ObjectId.isValid(id)) {
      this.logger.warn(`[ChildrenService] Invalid child ID: ${id}`);
      throw new NotFoundException('Invalid child ID');
    }

    const child = await this.childModel.findById(id).lean().exec();
    if (!child) {
      this.logger.warn(`[ChildrenService] Child not found with id=${id}`);
    } else {
      this.logger.debug(`[ChildrenService] Child found: ${child._id}`);
    }

    return child;
  }

  /**
   * Create one or multiple children
   */
  async create(childData: CreateChildDto | CreateChildDto[]): Promise<Child | Child[]> {
    this.logger.debug(`[ChildrenService] Creating ${Array.isArray(childData) ? childData.length : 1} child(ren)`);

    try {
      if (Array.isArray(childData)) {
        const children = await Promise.all(
          childData.map(async (data) => {
            const child = new this.childModel(data);
            this.logger.debug(`[ChildrenService] Saving child for parentId=${data.parentId}`);
            return child.save();
          }),
        );
        this.logger.log(`[ChildrenService] Successfully created ${children.length} children`);
        return children;
      } else {
        const child = new this.childModel(childData);
        const savedChild = await child.save();
        this.logger.log(`[ChildrenService] Successfully created child with id=${savedChild._id}`);
        return savedChild;
      }
    } catch (error) {
      this.logger.error(`[ChildrenService] Failed to create child: ${error.message}`, error.stack);
      throw new Error(`Failed to create child: ${error.message}`);
    }
  }

  /**
   * Update child details
   */
  async update(id: string, updateData: UpdateChildDto): Promise<Child | null> {
    this.logger.debug(`[ChildrenService] Updating child with id=${id}`);

    if (!Types.ObjectId.isValid(id)) {
      this.logger.warn(`[ChildrenService] Invalid child ID: ${id}`);
      throw new NotFoundException('Invalid child ID');
    }

    if (updateData.parentId && !Types.ObjectId.isValid(updateData.parentId)) {
      this.logger.warn(`[ChildrenService] Invalid parent ID in update data: ${updateData.parentId}`);
      throw new NotFoundException('Invalid parent ID in update data');
    }

    const updated = await this.childModel.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();

    if (!updated) {
      this.logger.warn(`[ChildrenService] Child with ID ${id} not found for update`);
      throw new NotFoundException(`Child with ID ${id} not found`);
    }

    this.logger.log(`[ChildrenService] Child with id=${id} updated successfully`);
    return updated;
  }

  /**
   * Delete a child
   */
  async remove(id: string): Promise<Child | null> {
    this.logger.debug(`[ChildrenService] Deleting child with id=${id}`);

    if (!Types.ObjectId.isValid(id)) {
      this.logger.warn(`[ChildrenService] Invalid child ID: ${id}`);
      throw new NotFoundException('Invalid child ID');
    }

    const deleted = await this.childModel.findByIdAndDelete(id).lean().exec();

    if (!deleted) {
      this.logger.warn(`[ChildrenService] Child with ID ${id} not found for deletion`);
      throw new NotFoundException(`Child with ID ${id} not found`);
    }

    this.logger.log(`[ChildrenService] Child with id=${id} deleted successfully`);
    return deleted;
  }
}
