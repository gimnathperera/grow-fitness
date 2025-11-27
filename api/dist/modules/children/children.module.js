"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ChildrenModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildrenModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const children_controller_1 = require("./children.controller");
const children_service_1 = require("./children.service");
const child_schema_1 = require("../../schemas/child.schema");
let ChildrenModule = ChildrenModule_1 = class ChildrenModule {
    logger = new common_1.Logger(ChildrenModule_1.name);
    onModuleInit() {
        this.logger.log('[ChildrenModule] Module initialized and ready');
    }
};
exports.ChildrenModule = ChildrenModule;
exports.ChildrenModule = ChildrenModule = ChildrenModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: child_schema_1.Child.name, schema: child_schema_1.ChildSchema }]),
        ],
        controllers: [children_controller_1.ChildrenController],
        providers: [children_service_1.ChildrenService],
        exports: [children_service_1.ChildrenService],
    })
], ChildrenModule);
//# sourceMappingURL=children.module.js.map