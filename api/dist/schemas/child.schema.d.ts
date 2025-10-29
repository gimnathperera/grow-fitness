import { Document, Types } from 'mongoose';
export type ChildDocument = Child & Document;
type Gender = 'boy' | 'girl';
type TrainingPreference = 'personal' | 'group';
export declare class Child {
    parentId: Types.ObjectId;
    name: string;
    birthDate: Date;
    gender: Gender;
    location: string;
    goals: string[];
    medicalCondition?: string;
    isInSports: boolean;
    trainingPreference: TrainingPreference;
}
export declare const ChildSchema: import("mongoose").Schema<Child, import("mongoose").Model<Child, any, any, any, Document<unknown, any, Child, any, {}> & Child & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Child, Document<unknown, {}, import("mongoose").FlatRecord<Child>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Child> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
