"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const locations_controller_1 = require("./locations.controller");
const locations_service_1 = require("./locations.service");
const location_schema_1 = require("../../schemas/location.schema");
const auth_module_1 = require("../auth/auth.module");
let LocationsModule = class LocationsModule {
};
exports.LocationsModule = LocationsModule;
exports.LocationsModule = LocationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: location_schema_1.Location.name, schema: location_schema_1.LocationSchema },
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [locations_controller_1.LocationsController],
        providers: [locations_service_1.LocationsService],
        exports: [locations_service_1.LocationsService],
    })
], LocationsModule);
//# sourceMappingURL=locations.module.js.map