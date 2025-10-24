import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { Request, RequestSchema } from '../../schemas/request.schema';
import { Session, SessionSchema } from '../../schemas/session.schema';
import { CRMEvent, CRMEventSchema } from '../../schemas/crm-event.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Request.name, schema: RequestSchema },
      { name: Session.name, schema: SessionSchema },
      { name: CRMEvent.name, schema: CRMEventSchema },
    ]),
    AuthModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}

