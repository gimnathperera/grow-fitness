import { Document } from 'mongoose';
export type ResourceDocument = Resource & Document;
export declare class Resource {
    title: string;
    category: string;
    tags: string[];
    contentRef?: string;
}
export declare const ResourceSchema: import("mongoose").Schema<Resource, import("mongoose").Model<Resource, any, any, any, Document<unknown, any, Resource, any, {}> & Resource & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Resource, Document<unknown, {}, import("mongoose").FlatRecord<Resource>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Resource> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
