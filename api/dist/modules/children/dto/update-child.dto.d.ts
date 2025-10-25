import { CreateChildDto } from './create-child.dto';
declare const UpdateChildDto_base: import("@nestjs/common").Type<Partial<CreateChildDto>>;
export declare class UpdateChildDto extends UpdateChildDto_base {
    name?: string;
    birthDate?: Date;
    goals?: string[];
    medicalCondition?: string;
    gender?: 'male' | 'female' | 'other';
}
export {};
