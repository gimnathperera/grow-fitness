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
var ChildrenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildrenService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const child_schema_1 = require("../../schemas/child.schema");
let ChildrenService = ChildrenService_1 = class ChildrenService {
    childModel;
    logger = new common_1.Logger(ChildrenService_1.name);
    constructor(childModel) {
        this.childModel = childModel;
    }
    async findAll(parentId) {
        this.logger.debug(`[ChildrenService] Fetching all children${parentId ? ` for parentId=${parentId}` : ''}`);
        if (parentId && !mongoose_2.Types.ObjectId.isValid(parentId)) {
            this.logger.warn(`[ChildrenService] Invalid parent ID: ${parentId}`);
            throw new common_1.NotFoundException('Invalid parent ID');
        }
        const filter = parentId
            ? {
                $or: [
                    { parentId: new mongoose_2.Types.ObjectId(parentId) },
                    { parentId },
                ],
            }
            : {};
        const result = await this.childModel.find(filter).lean().exec();
        this.logger.debug(`[ChildrenService] Found ${result.length} children`);
        return result;
    }
    async findByParentId(parentId) {
        this.logger.debug(`[ChildrenService] Fetching children for parentId=${parentId}`);
        if (!parentId)
            throw new common_1.NotFoundException('Parent ID is required');
        const filter = { parentId };
        this.logger.debug(`[ChildrenService] Mongo filter used: ${JSON.stringify(filter)}`);
        const result = await this.childModel.find(filter).lean().exec();
        this.logger.debug(`[ChildrenService] Found ${result.length} children for parentId=${parentId}`);
        if (result.length === 0) {
            this.logger.warn('[ChildrenService] No children returned — check DB storage type for parentId');
        }
        return result;
    }
    async findOne(id) {
        this.logger.debug(`[ChildrenService] Fetching child with id=${id}`);
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            this.logger.warn(`[ChildrenService] Invalid child ID: ${id}`);
            throw new common_1.NotFoundException('Invalid child ID');
        }
        const child = await this.childModel.findById(id).lean().exec();
        if (!child) {
            this.logger.warn(`[ChildrenService] Child not found with id=${id}`);
        }
        else {
            this.logger.debug(`[ChildrenService] Child found: ${child._id}`);
        }
        return child;
    }
    async create(childData) {
        this.logger.debug(`[ChildrenService] Creating ${Array.isArray(childData) ? childData.length : 1} child(ren)`);
        try {
            if (Array.isArray(childData)) {
                const children = await Promise.all(childData.map(async (data) => {
                    const child = new this.childModel(data);
                    this.logger.debug(`[ChildrenService] Saving child for parentId=${data.parentId}`);
                    return child.save();
                }));
                this.logger.log(`[ChildrenService] Successfully created ${children.length} children`);
                return children;
            }
            else {
                const child = new this.childModel(childData);
                const savedChild = await child.save();
                this.logger.log(`[ChildrenService] Successfully created child with id=${savedChild._id}`);
                return savedChild;
            }
        }
        catch (error) {
            this.logger.error(`[ChildrenService] Failed to create child: ${error.message}`, error.stack);
            throw new Error(`Failed to create child: ${error.message}`);
        }
    }
    async update(id, updateData) {
        this.logger.debug(`[ChildrenService] Updating child with id=${id}`);
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            this.logger.warn(`[ChildrenService] Invalid child ID: ${id}`);
            throw new common_1.NotFoundException('Invalid child ID');
        }
        if (updateData.parentId && !mongoose_2.Types.ObjectId.isValid(updateData.parentId)) {
            this.logger.warn(`[ChildrenService] Invalid parent ID in update data: ${updateData.parentId}`);
            throw new common_1.NotFoundException('Invalid parent ID in update data');
        }
        const updated = await this.childModel.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
        if (!updated) {
            this.logger.warn(`[ChildrenService] Child with ID ${id} not found for update`);
            throw new common_1.NotFoundException(`Child with ID ${id} not found`);
        }
        this.logger.log(`[ChildrenService] Child with id=${id} updated successfully`);
        return updated;
    }
    async remove(id) {
        this.logger.debug(`[ChildrenService] Deleting child with id=${id}`);
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            this.logger.warn(`[ChildrenService] Invalid child ID: ${id}`);
            throw new common_1.NotFoundException('Invalid child ID');
        }
        const deleted = await this.childModel.findByIdAndDelete(id).lean().exec();
        if (!deleted) {
            this.logger.warn(`[ChildrenService] Child with ID ${id} not found for deletion`);
            throw new common_1.NotFoundException(`Child with ID ${id} not found`);
        }
        this.logger.log(`[ChildrenService] Child with id=${id} deleted successfully`);
        return deleted;
    }
};
exports.ChildrenService = ChildrenService;
exports.ChildrenService = ChildrenService = ChildrenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(child_schema_1.Child.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChildrenService);
//# sourceMappingURL=children.service.js.map