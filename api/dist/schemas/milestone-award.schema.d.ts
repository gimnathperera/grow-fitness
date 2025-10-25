import { Document, Types } from 'mongoose';
export type MilestoneAwardDocument = MilestoneAward & Document;
export declare class MilestoneAward {
    childId: Types.ObjectId;
    ruleId: Types.ObjectId;
    awardedAt: Date;
    artifactUrl?: string;
}
export declare const MilestoneAwardSchema: import("mongoose").Schema<MilestoneAward, import("mongoose").Model<MilestoneAward, any, any, any, Document<unknown, any, MilestoneAward, any, {}> & MilestoneAward & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MilestoneAward, Document<unknown, {}, import("mongoose").FlatRecord<MilestoneAward>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<MilestoneAward> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
