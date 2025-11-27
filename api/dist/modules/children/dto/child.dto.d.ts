export declare class ChildDto {
    id: string;
    parentId?: string;
    name: string;
    birthDate?: Date;
    age?: number;
    gender: 'boy' | 'girl';
    location: string;
    goals?: string[];
    medicalCondition?: string;
    isInSports?: boolean;
    trainingPreference?: 'personal' | 'group';
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreateChildDto {
    parentId?: string;
    name: string;
    birthDate?: Date;
    age?: number;
    gender: 'boy' | 'girl';
    location: string;
    goals?: string[];
    medicalCondition?: string;
    isInSports?: boolean;
    preferredTrainingStyle?: 'personal' | 'group';
    trainingPreference?: 'personal' | 'group';
}
export declare class UpdateChildDto {
    parentId?: string;
    name?: string;
    birthDate?: Date;
    gender?: 'boy' | 'girl';
    location?: string;
    goals?: string[];
    medicalCondition?: string;
    isInSports?: boolean;
    trainingPreference?: 'personal' | 'group';
}
