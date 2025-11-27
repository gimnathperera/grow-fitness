import { Model } from 'mongoose';
import { Child, ChildDocument } from '../../schemas/child.schema';
import { CreateChildDto, UpdateChildDto } from './dto/child.dto';
export declare class ChildrenService {
    private readonly childModel;
    private readonly logger;
    constructor(childModel: Model<ChildDocument>);
    findAll(parentId?: string): Promise<Child[]>;
    findByParentId(parentId: string): Promise<Child[]>;
    findOne(id: string): Promise<Child | null>;
    create(childData: CreateChildDto | CreateChildDto[]): Promise<Child | Child[]>;
    update(id: string, updateData: UpdateChildDto): Promise<Child | null>;
    remove(id: string): Promise<Child | null>;
}
