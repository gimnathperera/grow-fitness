// src/seed.ts
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './modules/auth/auth.service';
import { UserRole } from './schemas/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

// Schemas (types only; tokens use .name)
import { User } from './schemas/user.schema';
import { ParentProfile } from './schemas/parent-profile.schema';
import { Child } from './schemas/child.schema';
import { CoachProfile } from './schemas/coach-profile.schema';
import { Location } from './schemas/location.schema';
import { Session, SessionType, SessionStatus } from './schemas/session.schema';
import { Request, RequestType, RequestStatus } from './schemas/request.schema';
import {
  Invoice,
  InvoiceStatus,
  PaymentMethod,
} from './schemas/invoice.schema';
import { MilestoneRule } from './schemas/milestone-rule.schema';
import { Resource } from './schemas/resource.schema';
import { Notification } from './schemas/notification.schema';

// helper: compute age from birthdate (years)
const calcAge = (d: Date) =>
  Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get models via tokens that match how you registered them in your modules
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const parentProfileModel = app.get<Model<ParentProfile>>(
    getModelToken(ParentProfile.name),
  );
  const childModel = app.get<Model<Child>>(getModelToken(Child.name));
  const coachProfileModel = app.get<Model<CoachProfile>>(
    getModelToken(CoachProfile.name),
  );
  const locationModel = app.get<Model<Location>>(getModelToken(Location.name));
  const sessionModel = app.get<Model<Session>>(getModelToken(Session.name));
  const requestModel = app.get<Model<Request>>(getModelToken(Request.name));
  const invoiceModel = app.get<Model<Invoice>>(getModelToken(Invoice.name));
  const milestoneRuleModel = app.get<Model<MilestoneRule>>(
    getModelToken(MilestoneRule.name),
  );
  const resourceModel = app.get<Model<Resource>>(getModelToken(Resource.name));
  const notificationModel = app.get<Model<Notification>>(
    getModelToken(Notification.name),
  );

  const authService = app.get(AuthService);

  try {
    console.log('🌱 Starting seed process...');

    // DEV-ONLY: clear existing data for a clean slate
    await userModel.deleteMany({});
    await parentProfileModel.deleteMany({});
    await childModel.deleteMany({});
    await coachProfileModel.deleteMany({});
    await locationModel.deleteMany({});
    await sessionModel.deleteMany({});
    await requestModel.deleteMany({});
    await invoiceModel.deleteMany({});
    await milestoneRuleModel.deleteMany({});
    await resourceModel.deleteMany({});
    await notificationModel.deleteMany({});

    // 1) Admin
    const admin = await authService.createUser({
      email: 'admin@growfitness.lk',
      name: 'Admin User',
      password: 'admin123', // AuthService should hash this
      role: UserRole.ADMIN,
      phone: '+94771234567',
    });
    console.log('✅ Created admin user');

    // 2) Coaches + profiles
    const coach1 = await authService.createUser({
      email: 'coach1@growfitness.lk',
      name: 'John Coach',
      password: 'coach123',
      role: UserRole.COACH,
      phone: '+94771234568',
    });

    const coach2 = await authService.createUser({
      email: 'coach2@growfitness.lk',
      name: 'Sarah Coach',
      password: 'coach123',
      role: UserRole.COACH,
      phone: '+94771234569',
    });

    await new coachProfileModel({
      userId: coach1._id,
      skills: ['Fitness Training', 'Child Development', 'Nutrition'],
      availability: [
        { day: 'Monday', start: '09:00', end: '17:00' },
        { day: 'Tuesday', start: '09:00', end: '17:00' },
        { day: 'Wednesday', start: '09:00', end: '17:00' },
      ],
      earningsDerived: 0,
    }).save();

    await new coachProfileModel({
      userId: coach2._id,
      skills: ['Swimming', 'Gymnastics', 'Team Sports'],
      availability: [
        { day: 'Thursday', start: '10:00', end: '18:00' },
        { day: 'Friday', start: '10:00', end: '18:00' },
        { day: 'Saturday', start: '08:00', end: '16:00' },
      ],
      earningsDerived: 0,
    }).save();

    console.log('✅ Created coach users and profiles');

    // 3) Parents + profiles
    const parent1 = await authService.createUser({
      email: 'parent1@growfitness.lk',
      name: 'Alice Parent',
      password: 'parent123',
      role: UserRole.PARENT,
      phone: '+94771234570',
    });

    const parent2 = await authService.createUser({
      email: 'parent2@growfitness.lk',
      name: 'Bob Parent',
      password: 'parent123',
      role: UserRole.PARENT,
      phone: '+94771234571',
    });

    await new parentProfileModel({
      userId: parent1._id,
      children: [],
    }).save();

    await new parentProfileModel({
      userId: parent2._id,
      children: [],
    }).save();

    console.log('✅ Created parent users and profiles');

    // 4) Children (add required `gender` and `age`)
    const child1Birth = new Date('2018-05-15');
    const child1 = await new childModel({
      parentId: parent1._id,
      name: 'Emma Child',
      birthDate: child1Birth,
      age: calcAge(child1Birth),
      gender: 'female', // if you have a Gender enum, use it here
      goals: ['Improve coordination', 'Build confidence', 'Learn swimming'],
    }).save();

    const child2Birth = new Date('2020-03-22');
    const child2 = await new childModel({
      parentId: parent1._id,
      name: 'Liam Child',
      birthDate: child2Birth,
      age: calcAge(child2Birth),
      gender: 'male',
      goals: ['Basic motor skills', 'Social interaction'],
    }).save();

    const child3Birth = new Date('2019-08-10');
    const child3 = await new childModel({
      parentId: parent2._id,
      name: 'Sophia Child',
      birthDate: child3Birth,
      age: calcAge(child3Birth),
      gender: 'female',
      goals: ['Fitness foundation', 'Team sports'],
    }).save();

    const child4Birth = new Date('2021-12-05');
    const child4 = await new childModel({
      parentId: parent2._id,
      name: 'Noah Child',
      birthDate: child4Birth,
      age: calcAge(child4Birth),
      gender: 'male',
      goals: ['Early development', 'Play skills'],
    }).save();

    // link children to parent profiles
    await parentProfileModel.updateOne(
      { userId: parent1._id },
      {
        children: [child1._id, child2._id],
      },
    );
    await parentProfileModel.updateOne(
      { userId: parent2._id },
      {
        children: [child3._id, child4._id],
      },
    );

    console.log('✅ Created children and linked to parents');

    // 5) Locations
    const location1 = await new locationModel({
      label: 'Main Gym - Colombo',
    }).save();
    const location2 = await new locationModel({
      label: 'Swimming Pool - Kandy',
    }).save();
    const location3 = await new locationModel({
      label: 'Outdoor Playground - Galle',
    }).save();

    console.log('✅ Created locations');

    // 6) Sessions
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await new sessionModel({
      type: SessionType.INDIVIDUAL,
      coachId: coach1._id,
      childIds: [child1._id],
      locationId: location1._id,
      startAt: new Date(tomorrow.getTime() + 10 * 60 * 60 * 1000),
      endAt: new Date(tomorrow.getTime() + 11 * 60 * 60 * 1000),
      status: SessionStatus.BOOKED,
    }).save();

    await new sessionModel({
      type: SessionType.GROUP,
      coachId: coach1._id,
      childIds: [child2._id, child3._id],
      locationId: location1._id,
      startAt: new Date(tomorrow.getTime() + 14 * 60 * 60 * 1000),
      endAt: new Date(tomorrow.getTime() + 15 * 60 * 60 * 1000),
      status: SessionStatus.BOOKED,
    }).save();

    await new sessionModel({
      type: SessionType.INDIVIDUAL,
      coachId: coach2._id,
      childIds: [child1._id],
      locationId: location2._id,
      startAt: new Date(nextWeek.getTime() + 9 * 60 * 60 * 1000),
      endAt: new Date(nextWeek.getTime() + 10 * 60 * 60 * 1000),
      status: SessionStatus.BOOKED,
    }).save();

    await new sessionModel({
      type: SessionType.GROUP,
      coachId: coach2._id,
      childIds: [child3._id, child4._id],
      locationId: location3._id,
      startAt: new Date(nextWeek.getTime() + 15 * 60 * 60 * 1000),
      endAt: new Date(nextWeek.getTime() + 16 * 60 * 60 * 1000),
      status: SessionStatus.BOOKED,
    }).save();

    await new sessionModel({
      type: SessionType.INDIVIDUAL,
      coachId: coach1._id,
      childIds: [child2._id],
      locationId: location1._id,
      startAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      status: SessionStatus.COMPLETED,
    }).save();

    await new sessionModel({
      type: SessionType.GROUP,
      coachId: coach2._id,
      childIds: [child1._id, child3._id],
      locationId: location2._id,
      startAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      status: SessionStatus.COMPLETED,
    }).save();

    console.log('✅ Created sessions');

    // 7) Requests
    const sessionForReq1 = await sessionModel.findOne({
      status: SessionStatus.BOOKED,
    });
    const sessionForReq2 = await sessionModel.findOne({
      status: SessionStatus.BOOKED,
      _id: { $ne: sessionForReq1?._id },
    });
    const sessionForReq3 = await sessionModel.findOne({
      status: SessionStatus.BOOKED,
      _id: { $nin: [sessionForReq1?._id, sessionForReq2?._id] },
    });

    const request1 = await new requestModel({
      type: RequestType.RESCHEDULE,
      sessionId: sessionForReq1?._id,
      requesterId: parent1._id,
      reason: 'Family emergency, need to reschedule',
      isLate: false,
      status: RequestStatus.PENDING,
    }).save();

    await new requestModel({
      type: RequestType.CANCEL,
      sessionId: sessionForReq2?._id,
      requesterId: parent1._id,
      reason: 'Child is sick',
      isLate: false,
      status: RequestStatus.APPROVED,
      adminNote: 'Approved due to illness',
      decidedAt: new Date(),
    }).save();

    await new requestModel({
      type: RequestType.RESCHEDULE,
      sessionId: sessionForReq3?._id,
      requesterId: parent2._id,
      reason: 'Work conflict',
      isLate: true,
      status: RequestStatus.REJECTED,
      adminNote: 'Rejected - too late to reschedule',
      decidedAt: new Date(),
    }).save();

    console.log('✅ Created requests');

    // 8) Invoices
    await new invoiceModel({
      parentId: parent1._id,
      amountLKR: 5000,
      status: InvoiceStatus.PAID,
      paidDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      paidMethod: PaymentMethod.BANK,
    }).save();

    await new invoiceModel({
      parentId: parent2._id,
      amountLKR: 7500,
      status: InvoiceStatus.UNPAID,
    }).save();

    console.log('✅ Created invoices');

    // 9) Milestone rule
    await new milestoneRuleModel({
      name: '10 Sessions Completed',
      conditionJSON: {
        type: 'session_count',
        threshold: 10,
        timeFrame: 'all_time',
      },
      rewardType: 'certificate',
      isActive: true,
    }).save();

    console.log('✅ Created milestone rule');

    // 10) Resource
    await new resourceModel({
      title: 'Healthy Snacks for Active Kids',
      category: 'Nutrition',
      tags: ['nutrition', 'snacks', 'kids', 'health'],
      contentRef: 'https://example.com/healthy-snacks-guide',
    }).save();

    console.log('✅ Created resource');

    // 11) Notifications
    await new notificationModel({
      userId: admin._id,
      type: 'new_request',
      payload: {
        requestId: request1._id,
        message: 'New reschedule request from Alice Parent',
      },
    }).save();

    await new notificationModel({
      userId: admin._id,
      type: 'session_reminder',
      payload: {
        message: 'Session reminder: Emma Child has a session tomorrow at 10 AM',
      },
    }).save();

    console.log('🎉 Seed completed successfully!');
    console.log('\n📋 Test Data Summary:');
    console.log('- 1 Admin user (admin@growfitness.lk / admin123)');
    console.log('- 2 Coach users with profiles');
    console.log('- 2 Parent users with profiles');
    console.log('- 4 Children (with gender + age) linked to parents');
    console.log('- 3 Locations');
    console.log('- 6 Sessions (mix of individual and group)');
    console.log('- 3 Requests (1 pending, 1 approved, 1 rejected)');
    console.log('- 2 Invoices (1 paid, 1 unpaid)');
    console.log('- 1 Milestone rule');
    console.log('- 1 Resource');
    console.log('- 2 Notifications');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run seed if executed directly
if (require.main === module) {
  seed().catch(console.error);
}

export { seed };
