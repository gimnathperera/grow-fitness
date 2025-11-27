"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const auth_service_1 = require("./modules/auth/auth.service");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_2 = require("./schemas/user.schema");
const parent_profile_schema_1 = require("./schemas/parent-profile.schema");
const child_schema_1 = require("./schemas/child.schema");
const coach_profile_schema_1 = require("./schemas/coach-profile.schema");
const location_schema_1 = require("./schemas/location.schema");
const session_schema_1 = require("./schemas/session.schema");
const request_schema_1 = require("./schemas/request.schema");
const invoice_schema_1 = require("./schemas/invoice.schema");
const milestone_rule_schema_1 = require("./schemas/milestone-rule.schema");
const resource_schema_1 = require("./schemas/resource.schema");
const notification_schema_1 = require("./schemas/notification.schema");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userModel = app.get((0, mongoose_1.getModelToken)(user_schema_2.User.name));
    const parentProfileModel = app.get((0, mongoose_1.getModelToken)(parent_profile_schema_1.ParentProfile.name));
    const childModel = app.get((0, mongoose_1.getModelToken)(child_schema_1.Child.name));
    const coachProfileModel = app.get((0, mongoose_1.getModelToken)(coach_profile_schema_1.CoachProfile.name));
    const locationModel = app.get((0, mongoose_1.getModelToken)(location_schema_1.Location.name));
    const sessionModel = app.get((0, mongoose_1.getModelToken)(session_schema_1.Session.name));
    const requestModel = app.get((0, mongoose_1.getModelToken)(request_schema_1.Request.name));
    const invoiceModel = app.get((0, mongoose_1.getModelToken)(invoice_schema_1.Invoice.name));
    const milestoneRuleModel = app.get((0, mongoose_1.getModelToken)(milestone_rule_schema_1.MilestoneRule.name));
    const resourceModel = app.get((0, mongoose_1.getModelToken)(resource_schema_1.Resource.name));
    const notificationModel = app.get((0, mongoose_1.getModelToken)(notification_schema_1.Notification.name));
    const authService = app.get(auth_service_1.AuthService);
    try {
        console.log('🌱 Starting seed process...');
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
        const admin = await authService.createUser({
            email: 'admin@growfitness.lk',
            name: 'Admin User',
            password: 'admin123',
            role: user_schema_1.UserRole.ADMIN,
            phone: '+94771234567',
        });
        console.log('✅ Created admin user');
        const coach1 = await authService.createUser({
            email: 'coach1@growfitness.lk',
            name: 'John Coach',
            password: 'coach123',
            role: user_schema_1.UserRole.COACH,
            phone: '+94771234568',
        });
        const coach2 = await authService.createUser({
            email: 'coach2@growfitness.lk',
            name: 'Sarah Coach',
            password: 'coach123',
            role: user_schema_1.UserRole.COACH,
            phone: '+94771234569',
        });
        const coach1Profile = new coachProfileModel({
            userId: coach1._id,
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
            userId: coach2._id,
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
        const parent1 = await authService.createUser({
            email: 'parent1@growfitness.lk',
            name: 'Alice Parent',
            password: 'parent123',
            role: user_schema_1.UserRole.PARENT,
            phone: '+94771234570',
        });
        const parent2 = await authService.createUser({
            email: 'parent2@growfitness.lk',
            name: 'Bob Parent',
            password: 'parent123',
            role: user_schema_1.UserRole.PARENT,
            phone: '+94771234571',
        });
        const parent1Profile = new parentProfileModel({
            userId: parent1._id,
            children: [],
        });
        await parent1Profile.save();
        const parent2Profile = new parentProfileModel({
            userId: parent2._id,
            children: [],
        });
        await parent2Profile.save();
        console.log('✅ Created parent users and profiles');
        const child1 = new childModel({
            parentId: parent1._id,
            name: 'Emma Child',
            birthDate: new Date('2018-05-15'),
            goals: ['Improve coordination', 'Build confidence', 'Learn swimming'],
        });
        await child1.save();
        const child2 = new childModel({
            parentId: parent1._id,
            name: 'Liam Child',
            birthDate: new Date('2020-03-22'),
            goals: ['Basic motor skills', 'Social interaction'],
        });
        await child2.save();
        const child3 = new childModel({
            parentId: parent2._id,
            name: 'Sophia Child',
            birthDate: new Date('2019-08-10'),
            goals: ['Fitness foundation', 'Team sports'],
        });
        await child3.save();
        const child4 = new childModel({
            parentId: parent2._id,
            name: 'Noah Child',
            birthDate: new Date('2021-12-05'),
            goals: ['Early development', 'Play skills'],
        });
        await child4.save();
        await parentProfileModel.updateOne({ userId: parent1._id }, { children: [child1._id, child2._id] });
        await parentProfileModel.updateOne({ userId: parent2._id }, { children: [child3._id, child4._id] });
        console.log('✅ Created children and linked to parents');
        const location1 = new locationModel({ label: 'Main Gym - Colombo' });
        await location1.save();
        const location2 = new locationModel({ label: 'Swimming Pool - Kandy' });
        await location2.save();
        const location3 = new locationModel({
            label: 'Outdoor Playground - Galle',
        });
        await location3.save();
        console.log('✅ Created locations');
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const session1 = new sessionModel({
            type: session_schema_1.SessionType.INDIVIDUAL,
            coachId: coach1._id,
            childIds: [child1._id],
            locationId: location1._id,
            startAt: new Date(tomorrow.getTime() + 10 * 60 * 60 * 1000),
            endAt: new Date(tomorrow.getTime() + 11 * 60 * 60 * 1000),
            status: session_schema_1.SessionStatus.BOOKED,
        });
        await session1.save();
        const session2 = new sessionModel({
            type: session_schema_1.SessionType.GROUP,
            coachId: coach1._id,
            childIds: [child2._id, child3._id],
            locationId: location1._id,
            startAt: new Date(tomorrow.getTime() + 14 * 60 * 60 * 1000),
            endAt: new Date(tomorrow.getTime() + 15 * 60 * 60 * 1000),
            status: session_schema_1.SessionStatus.BOOKED,
        });
        await session2.save();
        const session3 = new sessionModel({
            type: session_schema_1.SessionType.INDIVIDUAL,
            coachId: coach2._id,
            childIds: [child1._id],
            locationId: location2._id,
            startAt: new Date(nextWeek.getTime() + 9 * 60 * 60 * 1000),
            endAt: new Date(nextWeek.getTime() + 10 * 60 * 60 * 1000),
            status: session_schema_1.SessionStatus.BOOKED,
        });
        await session3.save();
        const session4 = new sessionModel({
            type: session_schema_1.SessionType.GROUP,
            coachId: coach2._id,
            childIds: [child3._id, child4._id],
            locationId: location3._id,
            startAt: new Date(nextWeek.getTime() + 15 * 60 * 60 * 1000),
            endAt: new Date(nextWeek.getTime() + 16 * 60 * 60 * 1000),
            status: session_schema_1.SessionStatus.BOOKED,
        });
        await session4.save();
        const session5 = new sessionModel({
            type: session_schema_1.SessionType.INDIVIDUAL,
            coachId: coach1._id,
            childIds: [child2._id],
            locationId: location1._id,
            startAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            endAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
            status: session_schema_1.SessionStatus.COMPLETED,
        });
        await session5.save();
        const session6 = new sessionModel({
            type: session_schema_1.SessionType.GROUP,
            coachId: coach2._id,
            childIds: [child1._id, child3._id],
            locationId: location2._id,
            startAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            endAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
            status: session_schema_1.SessionStatus.COMPLETED,
        });
        await session6.save();
        console.log('✅ Created sessions');
        const request1 = new requestModel({
            type: request_schema_1.RequestType.RESCHEDULE,
            sessionId: session1._id,
            requesterId: parent1._id,
            reason: 'Family emergency, need to reschedule',
            isLate: false,
            status: request_schema_1.RequestStatus.PENDING,
        });
        await request1.save();
        const request2 = new requestModel({
            type: request_schema_1.RequestType.CANCEL,
            sessionId: session2._id,
            requesterId: parent1._id,
            reason: 'Child is sick',
            isLate: false,
            status: request_schema_1.RequestStatus.APPROVED,
            adminNote: 'Approved due to illness',
            decidedAt: new Date(),
        });
        await request2.save();
        const request3 = new requestModel({
            type: request_schema_1.RequestType.RESCHEDULE,
            sessionId: session3._id,
            requesterId: parent2._id,
            reason: 'Work conflict',
            isLate: true,
            status: request_schema_1.RequestStatus.REJECTED,
            adminNote: 'Rejected - too late to reschedule',
            decidedAt: new Date(),
        });
        await request3.save();
        console.log('✅ Created requests');
        const invoice1 = new invoiceModel({
            parentId: parent1._id,
            amountLKR: 5000,
            status: invoice_schema_1.InvoiceStatus.PAID,
            paidDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            paidMethod: invoice_schema_1.PaymentMethod.BANK,
        });
        await invoice1.save();
        const invoice2 = new invoiceModel({
            parentId: parent2._id,
            amountLKR: 7500,
            status: invoice_schema_1.InvoiceStatus.UNPAID,
        });
        await invoice2.save();
        console.log('✅ Created invoices');
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
        const resource = new resourceModel({
            title: 'Healthy Snacks for Active Kids',
            category: 'Nutrition',
            tags: ['nutrition', 'snacks', 'kids', 'health'],
            contentRef: 'https://example.com/healthy-snacks-guide',
        });
        await resource.save();
        console.log('✅ Created resource');
        const notification1 = new notificationModel({
            userId: admin._id,
            type: 'new_request',
            payload: {
                requestId: request1._id,
                message: 'New reschedule request from Alice Parent',
            },
        });
        await notification1.save();
        const notification2 = new notificationModel({
            userId: admin._id,
            type: 'session_reminder',
            payload: {
                sessionId: session1._id,
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
    }
    catch (error) {
        console.error('❌ Seed failed:', error);
        throw error;
    }
    finally {
        await app.close();
    }
}
if (require.main === module) {
    seed().catch(console.error);
}
//# sourceMappingURL=seed.js.map