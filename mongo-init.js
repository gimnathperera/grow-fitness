// MongoDB initialization script
db = db.getSiblingDB("grow-fitness-admin");

// Create collections with indexes
db.createCollection("users");
db.createCollection("parentprofiles");
db.createCollection("children");
db.createCollection("coachprofiles");
db.createCollection("locations");
db.createCollection("sessions");
db.createCollection("requests");
db.createCollection("progresslogs");
db.createCollection("milestonerules");
db.createCollection("milestoneawards");
db.createCollection("invoices");
db.createCollection("resources");
db.createCollection("quizresults");
db.createCollection("notifications");
db.createCollection("crmevents");
db.createCollection("auditlogs");

// Create indexes for better performance
db.sessions.createIndex({ coachId: 1, startAt: 1 });
db.sessions.createIndex({ childIds: 1, startAt: 1 });
db.requests.createIndex({ status: 1 });
db.requests.createIndex({ requesterId: 1 });
db.invoices.createIndex({ status: 1, paidDate: 1 });

print("Database initialized successfully");

