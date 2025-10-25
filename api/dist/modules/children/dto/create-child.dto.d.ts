export declare class CreateChildDto {
    name: string;
    parentId?: string;
    birthDate: Date;
    goals: string[];
    medicalCondition?: string;
    gender: 'male' | 'female' | 'other';
}
