import { Document } from 'mongoose';
export type MilestoneRuleDocument = MilestoneRule & Document;
export declare class MilestoneRule {
    name: string;
    conditionJSON: any;
    rewardType: string;
    isActive: boolean;
}
export declare const MilestoneRuleSchema: import("mongoose").Schema<MilestoneRule, import("mongoose").Model<MilestoneRule, any, any, any, Document<unknown, any, MilestoneRule, any, {}> & MilestoneRule & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MilestoneRule, Document<unknown, {}, import("mongoose").FlatRecord<MilestoneRule>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<MilestoneRule> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
