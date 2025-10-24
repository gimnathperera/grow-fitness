import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Session, SessionSchema } from '../../schemas/session.schema';
import { Invoice, InvoiceSchema } from '../../schemas/invoice.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { Child, ChildSchema } from '../../schemas/child.schema';
import {
  MilestoneAward,
  MilestoneAwardSchema,
} from '../../schemas/milestone-award.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: User.name, schema: UserSchema },
      { name: Child.name, schema: ChildSchema },
      { name: MilestoneAward.name, schema: MilestoneAwardSchema },
    ]),
    AuthModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}

