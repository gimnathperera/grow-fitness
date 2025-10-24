# Grow Fitness Admin Panel MVP

A comprehensive admin panel for managing a children's fitness center, built with NestJS backend and Next.js frontend.

## 🏗️ Project Structure

```
/admin/
├── api/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── schemas/        # MongoDB schemas
│   │   └── seed.ts         # Database seeding
│   └── package.json
├── admin/                  # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable components
│   │   └── lib/          # Utilities & stores
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+
- npm or yarn

### Backend Setup

1. **Navigate to API directory:**

   ```bash
   cd api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your MongoDB URI and other settings:

   ```env
   MONGO_URI=mongodb://localhost:27017/grow-fitness-admin
   JWT_SECRET=your-super-secret-jwt-key-here
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   APP_BASE_URL=http://localhost:3000
   CRON_TZ=Asia/Colombo
   ```

4. **Seed the database:**

   ```bash
   npm run seed
   ```

5. **Start the backend:**

   ```bash
   npm run start:dev
   ```

   Backend will be available at `http://localhost:4000`

### Frontend Setup

1. **Navigate to Admin directory:**

   ```bash
   cd admin
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

4. **Start the frontend:**

   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

## 🔐 Default Login

- **Email:** admin@growfitness.lk
- **Password:** admin123

## 📋 Features

### ✅ Completed Features

- **Authentication:** JWT-based admin authentication
- **Database:** 14 MongoDB schemas with proper indexing
- **Backend APIs:** Complete CRUD operations for all entities
- **Session Management:** Conflict detection and scheduling
- **Request System:** Approve/reject reschedule/cancel requests
- **Email System:** Automated reminders and digests
- **Scheduled Jobs:** Reminder emails, daily digests, milestone awards
- **Frontend:** Modern UI with shadcn/ui components
- **Dashboard:** KPI cards and activity feed
- **Data Tables:** Reusable table component with sorting/pagination
- **Calendar View:** React Big Calendar integration
- **Responsive Design:** Mobile-friendly interface

### 🚧 In Progress

- **Reports Module:** Weekly/monthly analytics with CSV/PDF export
- **Additional CRUD Pages:** Invoices, Resources, Quizzes, CRM, Audit
- **Advanced Features:** Impersonation, advanced filtering

## 🗄️ Database Schema

### Core Entities

- **Users:** Admin, Coach, Parent roles
- **Children:** Linked to parents with goals
- **Sessions:** Individual/Group with conflict detection
- **Requests:** Reschedule/Cancel with approval workflow
- **Invoices:** LKR currency with payment tracking
- **Milestones:** Rules-based achievement system
- **CRM Events:** Activity timeline and audit logs

### Key Relationships

- Parents → Children (one-to-many)
- Coaches → Sessions (one-to-many)
- Children → Sessions (many-to-many)
- Sessions → Requests (one-to-many)
- Parents → Invoices (one-to-many)

## 🔄 Business Logic

### Session Conflict Detection

- Prevents overlapping sessions for coaches
- Prevents overlapping sessions for children
- Real-time validation during creation

### Request Approval Flow

- **Reschedule:** Admin picks new time slot
- **Cancel:** Immediate session cancellation
- **Late Requests:** <12h before session triggers fee note
- **CRM Logging:** All actions logged with timestamps

### Automated Jobs

- **Reminders:** T-24h and T-1h email notifications
- **Daily Digest:** 06:00 Asia/Colombo for admins/coaches
- **Milestone Awards:** Midnight evaluation of achievement rules

## 📧 Email Templates

### Session Reminders

- 24-hour advance notice
- 1-hour advance notice
- Child name, time, location details

### Daily Digest

- Today's scheduled sessions
- Pending requests (admin only)
- Personalized for role

### Milestone Congratulations

- Child achievement notifications
- Certificate generation
- Parent email delivery

## 🎨 UI Components

### Shared Components

- **DataTable:** Sortable, searchable, paginated tables
- **KpiCard:** Dashboard metric displays
- **Calendar:** React Big Calendar with custom styling
- **Forms:** React Hook Form with Zod validation
- **Dialogs:** Modal forms and confirmations

### Design System

- **Colors:** Neutral palette with semantic variants
- **Typography:** Inter font family
- **Spacing:** Consistent 4px grid system
- **Icons:** Lucide React icon library

## 🔧 Development

### Backend Development

```bash
cd api
npm run start:dev    # Development server
npm run build        # Production build
npm run seed         # Reset database
```

### Frontend Development

```bash
cd admin
npm run dev         # Development server
npm run build       # Production build
npm run lint        # ESLint checking
```

### Database Management

```bash
# Reset and reseed
npm run seed

# View MongoDB
mongosh mongodb://localhost:27017/grow-fitness-admin
```

## 📊 API Endpoints

### Authentication

- `POST /auth/login` - Admin login

### Core Resources

- `GET /users` - User management
- `GET /sessions` - Session listing with filters
- `POST /sessions` - Create session with conflict detection
- `GET /requests` - Request management
- `POST /requests/:id/approve` - Approve request
- `POST /requests/:id/reject` - Reject request

### Data Export

- `GET /reports/weekly` - Weekly analytics
- `GET /reports/monthly` - Monthly analytics
- `GET /reports/export/csv` - CSV download
- `GET /reports/export/pdf` - PDF download

## 🧪 Testing

### Backend Testing

```bash
cd api
npm run test        # Unit tests
npm run test:e2e    # Integration tests
```

### Frontend Testing

```bash
cd admin
npm run test        # Component tests
```

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Build: `npm run build`
3. Start: `npm run start:prod`

### Frontend Deployment

1. Set `NEXT_PUBLIC_API_URL` to production API
2. Build: `npm run build`
3. Deploy to Vercel/Netlify

## 📝 Environment Variables

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/grow-fitness-admin
JWT_SECRET=your-super-secret-jwt-key-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_BASE_URL=http://localhost:3000
CRON_TZ=Asia/Colombo
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email admin@growfitness.lk or create an issue in the repository.

---

**Built with ❤️ for children's fitness and development**
