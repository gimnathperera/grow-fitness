import { Model } from 'mongoose';
import { Child, ChildDocument } from '../../schemas/child.schema';
import { CreateChildDto } from './dto/child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
export declare class ChildrenService {
    private childModel;
    constructor(childModel: Model<ChildDocument>);
    findAll(parentId?: string): Promise<Child[]>;
    findByParentId(parentId: string): Promise<Child[]>;
    findOne(id: string): Promise<Child | null>;
    create(childData: CreateChildDto): Promise<Child>;
    update(id: string, updateData: UpdateChildDto): Promise<Child | null>;
    remove(id: string): Promise<Child | null>;
}
