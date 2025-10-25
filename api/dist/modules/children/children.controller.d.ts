import { ChildrenService } from './children.service';
export declare class CreateChildDto {
    name: string;
    parentId?: string;
    birthDate: Date;
    goals: string[];
    medicalCondition?: string;
    gender: 'male' | 'female' | 'other';
}
export declare class UpdateChildDto {
    name?: string;
    birthDate?: Date;
    goals?: string[];
    medicalCondition?: string;
    gender?: 'male' | 'female' | 'other';
}
export declare class ChildrenController {
    private readonly childrenService;
    constructor(childrenService: ChildrenService);
    findAll(parentId: string, user: any): Promise<import("../../schemas/child.schema").Child[]>;
    update(id: string, updateChildDto: UpdateChildDto, user: any): Promise<import("../../schemas/child.schema").Child | null>;
    remove(id: string): Promise<import("../../schemas/child.schema").Child | null>;
}
