"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildrenService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const child_schema_1 = require("../../schemas/child.schema");
let ChildrenService = class ChildrenService {
    childModel;
    constructor(childModel) {
        this.childModel = childModel;
    }
    async findAll(parentId) {
        if (parentId && !mongoose_2.Types.ObjectId.isValid(parentId)) {
            throw new common_1.NotFoundException('Invalid parent ID');
        }
        const filter = parentId ? { parentId: new mongoose_2.Types.ObjectId(parentId) } : {};
        return this.childModel.find(filter).exec();
    }
    async findByParentId(parentId) {
        if (!mongoose_2.Types.ObjectId.isValid(parentId)) {
            throw new common_1.NotFoundException('Invalid parent ID');
        }
        return this.childModel.find({ parentId: new mongoose_2.Types.ObjectId(parentId) }).exec();
    }
    async findOne(id) {
        return this.childModel.findById(id).exec();
    }
    async create(childData) {
        const child = new this.childModel(childData);
        return child.save();
    }
    async update(id, updateData) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid child ID');
        }
        return this.childModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
    }
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid child ID');
        }
        return this.childModel.findByIdAndDelete(id).exec();
    }
};
exports.ChildrenService = ChildrenService;
exports.ChildrenService = ChildrenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(child_schema_1.Child.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChildrenService);
//# sourceMappingURL=children.service.js.map