import { Model } from 'mongoose';
import { Location, LocationDocument } from '../../schemas/location.schema';
export declare class LocationsService {
    private locationModel;
    constructor(locationModel: Model<LocationDocument>);
    findAll(): Promise<Location[]>;
    findOne(id: string): Promise<Location | null>;
    create(createLocationDto: {
        label: string;
    }): Promise<Location>;
    update(id: string, updateLocationDto: {
        label?: string;
    }): Promise<Location | null>;
    remove(id: string): Promise<Location | null>;
}
