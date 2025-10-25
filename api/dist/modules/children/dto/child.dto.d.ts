export declare class CreateChildDto {
    parentId: string;
    name: string;
    age: number;
    medicalCondition?: string;
    gender: string;
    goals?: string[];
}
export declare class UpdateChildDto {
    name?: string;
    age?: number;
    medicalCondition?: string;
    gender?: string;
    goals?: string[];
}
