import { Document, Types } from 'mongoose';
export type ChildDocument = Child & Document;
export declare class Child {
    parentId: Types.ObjectId;
    name: string;
    age: number;
    medicalCondition?: string;
    gender: string;
    goals: string[];
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
