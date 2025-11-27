import { LocationsService } from './locations.service';
export declare class CreateLocationDto {
    label: string;
}
export declare class UpdateLocationDto {
    label?: string;
}
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    findAll(): Promise<import("../../schemas/location.schema").Location[]>;
    findOne(id: string): Promise<import("../../schemas/location.schema").Location | null>;
    create(createLocationDto: CreateLocationDto): Promise<import("../../schemas/location.schema").Location>;
    update(id: string, updateLocationDto: UpdateLocationDto): Promise<import("../../schemas/location.schema").Location | null>;
    remove(id: string): Promise<import("../../schemas/location.schema").Location | null>;
}
