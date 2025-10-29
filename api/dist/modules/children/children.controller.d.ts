import { ChildrenService } from './children.service';
import { CreateChildDto, UpdateChildDto } from './dto/child.dto';
export declare class ChildrenController {
    private readonly childrenService;
    private readonly logger;
    constructor(childrenService: ChildrenService);
    findAll(parentId: string, user: any): Promise<import("../../schemas/child.schema").Child[]>;
    findOne(id: string, user: any): Promise<import("../../schemas/child.schema").Child>;
    create(createChildDtos: CreateChildDto | CreateChildDto[], user: any): Promise<any>;
    update(id: string, updateChildDto: UpdateChildDto, user: any): Promise<import("../../schemas/child.schema").Child | null>;
    remove(id: string, user: any): Promise<import("../../schemas/child.schema").Child | null>;
}
