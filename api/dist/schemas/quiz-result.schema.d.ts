import { Document, Types } from 'mongoose';
export type QuizResultDocument = QuizResult & Document;
export declare enum OwnerType {
    PARENT = "parent",
    COACH = "coach"
}
export declare class QuizResult {
    ownerType: OwnerType;
    ownerId: Types.ObjectId;
    type: string;
    score: number;
}
export declare const QuizResultSchema: import("mongoose").Schema<QuizResult, import("mongoose").Model<QuizResult, any, any, any, Document<unknown, any, QuizResult, any, {}> & QuizResult & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, QuizResult, Document<unknown, {}, import("mongoose").FlatRecord<QuizResult>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<QuizResult> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
