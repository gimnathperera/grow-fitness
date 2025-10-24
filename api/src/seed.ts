import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './modules/auth/auth.service';
import { UserRole } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

// Import all schemas
import { User, UserSchema } from './schemas/user.schema';
import {
  ParentProfile,
  ParentProfileSchema,
} from './schemas/parent-profile.schema';
import { Child, ChildSchema } from './schemas/child.schema';
import {
  CoachProfile,
  CoachProfileSchema,
} from './schemas/coach-profile.schema';
import { Location, LocationSchema } from './schemas/location.schema';
import {
  Session,
  SessionSchema,
  SessionType,
  SessionStatus,
} from './schemas/session.schema';
import {
  Request,
  RequestSchema,
  RequestType,
  RequestStatus,
} from './schemas/request.schema';
import {
  Invoice,
  InvoiceSchema,
  InvoiceStatus,
  PaymentMethod,
} from './schemas/invoice.schema';
import {
  MilestoneRule,
  MilestoneRuleSchema,
} from './schemas/milestone-rule.schema';
import { Resource, ResourceSchema } from './schemas/resource.schema';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get models
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

    // Clear existing data
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

    // 1. Create Admin user
    const admin = await authService.createUser({
      email: 'admin@growfitness.lk',
      name: 'Admin User',
      password: 'admin123',
      role: UserRole.ADMIN,
      phone: '+94771234567',
    });
    console.log('✅ Created admin user');

    // 2. Create Coach users
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

    // Create coach profiles
    const coach1Profile = new coachProfileModel({
      userId: (coach1 as any)._id,
      skills: ['Fitness Training', 'Child Development', 'Nutrition'],
      availability: [
        { day: 'Monday', start: '09:00', end: '17:00' },
        { day: 'Tuesday', start: '09:00', end: '17:00' },
        { day: 'Wednesday', start: '09:00', end: '17:00' },
      ],
      earningsDerived: 0,
    });
    await coach1Profile.save();

    const coach2Profile = new coachProfileModel({
      userId: (coach2 as any)._id,
      skills: ['Swimming', 'Gymnastics', 'Team Sports'],
      availability: [
        { day: 'Thursday', start: '10:00', end: '18:00' },
        { day: 'Friday', start: '10:00', end: '18:00' },
        { day: 'Saturday', start: '08:00', end: '16:00' },
      ],
      earningsDerived: 0,
    });
    await coach2Profile.save();
    console.log('✅ Created coach users and profiles');

    // 3. Create Parent users
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

    // Create parent profiles
    const parent1Profile = new parentProfileModel({
      userId: (parent1 as any)._id,
      children: [],
    });
    await parent1Profile.save();

    const parent2Profile = new parentProfileModel({
      userId: (parent2 as any)._id,
      children: [],
    });
    await parent2Profile.save();
    console.log('✅ Created parent users and profiles');

    // 4. Create Children
    const child1 = new childModel({
      parentId: (parent1 as any)._id,
      name: 'Emma Child',
      birthDate: new Date('2018-05-15'),
      goals: ['Improve coordination', 'Build confidence', 'Learn swimming'],
    });
    await child1.save();

    const child2 = new childModel({
      parentId: (parent1 as any)._id,
      name: 'Liam Child',
      birthDate: new Date('2020-03-22'),
      goals: ['Basic motor skills', 'Social interaction'],
    });
    await child2.save();

    const child3 = new childModel({
      parentId: (parent2 as any)._id,
      name: 'Sophia Child',
      birthDate: new Date('2019-08-10'),
      goals: ['Fitness foundation', 'Team sports'],
    });
    await child3.save();

    const child4 = new childModel({
      parentId: (parent2 as any)._id,
      name: 'Noah Child',
      birthDate: new Date('2021-12-05'),
      goals: ['Early development', 'Play skills'],
    });
    await child4.save();

    // Update parent profiles with children
    await parentProfileModel.updateOne(
      { userId: (parent1 as any)._id },
      { children: [(child1 as any)._id, (child2 as any)._id] },
    );
    await parentProfileModel.updateOne(
      { userId: (parent2 as any)._id },
      { children: [(child3 as any)._id, (child4 as any)._id] },
    );
    console.log('✅ Created children and linked to parents');

    // 5. Create Locations
    const location1 = new locationModel({ label: 'Main Gym - Colombo' });
    await location1.save();

    const location2 = new locationModel({ label: 'Swimming Pool - Kandy' });
    await location2.save();

    const location3 = new locationModel({
      label: 'Outdoor Playground - Galle',
    });
    await location3.save();
    console.log('✅ Created locations');

    // 6. Create Sessions
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const session1 = new sessionModel({
      type: SessionType.INDIVIDUAL,
      coachId: (coach1 as any)._id,
      childIds: [(child1 as any)._id],
      locationId: (location1 as any)._id,
      startAt: new Date(tomorrow.getTime() + 10 * 60 * 60 * 1000), // 10 AM tomorrow
      endAt: new Date(tomorrow.getTime() + 11 * 60 * 60 * 1000), // 11 AM tomorrow
      status: SessionStatus.BOOKED,
    });
    await session1.save();

    const session2 = new sessionModel({
      type: SessionType.GROUP,
      coachId: (coach1 as any)._id,
      childIds: [(child2 as any)._id, (child3 as any)._id],
      locationId: (location1 as any)._id,
      startAt: new Date(tomorrow.getTime() + 14 * 60 * 60 * 1000), // 2 PM tomorrow
      endAt: new Date(tomorrow.getTime() + 15 * 60 * 60 * 1000), // 3 PM tomorrow
      status: SessionStatus.BOOKED,
    });
    await session2.save();

    const session3 = new sessionModel({
      type: SessionType.INDIVIDUAL,
      coachId: (coach2 as any)._id,
      childIds: [(child1 as any)._id],
      locationId: (location2 as any)._id,
      startAt: new Date(nextWeek.getTime() + 9 * 60 * 60 * 1000), // 9 AM next week
      endAt: new Date(nextWeek.getTime() + 10 * 60 * 60 * 1000), // 10 AM next week
      status: SessionStatus.BOOKED,
    });
    await session3.save();

    const session4 = new sessionModel({
      type: SessionType.GROUP,
      coachId: (coach2 as any)._id,
      childIds: [(child3 as any)._id, (child4 as any)._id],
      locationId: (location3 as any)._id,
      startAt: new Date(nextWeek.getTime() + 15 * 60 * 60 * 1000), // 3 PM next week
      endAt: new Date(nextWeek.getTime() + 16 * 60 * 60 * 1000), // 4 PM next week
      status: SessionStatus.BOOKED,
    });
    await session4.save();

    const session5 = new sessionModel({
      type: SessionType.INDIVIDUAL,
      coachId: (coach1 as any)._id,
      childIds: [(child2 as any)._id],
      locationId: (location1 as any)._id,
      startAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 2 days ago + 1 hour
      status: SessionStatus.COMPLETED,
    });
    await session5.save();

    const session6 = new sessionModel({
      type: SessionType.GROUP,
      coachId: (coach2 as any)._id,
      childIds: [(child1 as any)._id, (child3 as any)._id],
      locationId: (location2 as any)._id,
      startAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      endAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 day ago + 1 hour
      status: SessionStatus.COMPLETED,
    });
    await session6.save();
    console.log('✅ Created sessions');

    // 7. Create Requests
    const request1 = new requestModel({
      type: RequestType.RESCHEDULE,
      sessionId: (session1 as any)._id,
      requesterId: (parent1 as any)._id,
      reason: 'Family emergency, need to reschedule',
      isLate: false,
      status: RequestStatus.PENDING,
    });
    await request1.save();

    const request2 = new requestModel({
      type: RequestType.CANCEL,
      sessionId: (session2 as any)._id,
      requesterId: (parent1 as any)._id,
      reason: 'Child is sick',
      isLate: false,
      status: RequestStatus.APPROVED,
      adminNote: 'Approved due to illness',
      decidedAt: new Date(),
    });
    await request2.save();

    const request3 = new requestModel({
      type: RequestType.RESCHEDULE,
      sessionId: (session3 as any)._id,
      requesterId: (parent2 as any)._id,
      reason: 'Work conflict',
      isLate: true, // Less than 12 hours before session
      status: RequestStatus.REJECTED,
      adminNote: 'Rejected - too late to reschedule',
      decidedAt: new Date(),
    });
    await request3.save();
    console.log('✅ Created requests');

    // 8. Create Invoices
    const invoice1 = new invoiceModel({
      parentId: (parent1 as any)._id,
      amountLKR: 5000,
      status: InvoiceStatus.PAID,
      paidDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      paidMethod: PaymentMethod.BANK,
    });
    await invoice1.save();

    const invoice2 = new invoiceModel({
      parentId: (parent2 as any)._id,
      amountLKR: 7500,
      status: InvoiceStatus.UNPAID,
    });
    await invoice2.save();
    console.log('✅ Created invoices');

    // 9. Create Milestone Rule
    const milestoneRule = new milestoneRuleModel({
      name: '10 Sessions Completed',
      conditionJSON: {
        type: 'session_count',
        threshold: 10,
        timeFrame: 'all_time',
      },
      rewardType: 'certificate',
      isActive: true,
    });
    await milestoneRule.save();
    console.log('✅ Created milestone rule');

    // 10. Create Resource
    const resource = new resourceModel({
      title: 'Healthy Snacks for Active Kids',
      category: 'Nutrition',
      tags: ['nutrition', 'snacks', 'kids', 'health'],
      contentRef: 'https://example.com/healthy-snacks-guide',
    });
    await resource.save();
    console.log('✅ Created resource');

    // 11. Create Notifications
    const notification1 = new notificationModel({
      userId: (admin as any)._id,
      type: 'new_request',
      payload: {
        requestId: (request1 as any)._id,
        message: 'New reschedule request from Alice Parent',
      },
    });
    await notification1.save();

    const notification2 = new notificationModel({
      userId: (admin as any)._id,
      type: 'session_reminder',
      payload: {
        sessionId: (session1 as any)._id,
        message: 'Session reminder: Emma Child has a session tomorrow at 10 AM',
      },
    });
    await notification2.save();
    console.log('✅ Created notifications');

    console.log('🎉 Seed completed successfully!');
    console.log('\n📋 Test Data Summary:');
    console.log('- 1 Admin user (admin@growfitness.lk / admin123)');
    console.log('- 2 Coach users with profiles');
    console.log('- 2 Parent users with profiles');
    console.log('- 4 Children linked to parents');
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

// Run seed if this file is executed directly
if (require.main === module) {
  seed().catch(console.error);
}

export { seed };
