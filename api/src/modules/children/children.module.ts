import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChildrenController } from './children.controller';
import { ChildrenService } from './children.service';
import { Child, ChildSchema } from '../../schemas/child.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
  ],
  controllers: [ChildrenController],
  providers: [ChildrenService],
  exports: [ChildrenService],
})
export class ChildrenModule {}
