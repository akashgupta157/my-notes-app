# Multi-Tenant SaaS Notes Application

A secure, multi-tenant notes application built with Next.js 15, TypeScript, MongoDB Atlas, and shadcn/ui components.

## Features

- **Multi-tenancy** with strict data isolation between companies
- **JWT-based authentication** with HTTP-only cookies
- **Role-based access control** (Admin/Member)
- **Subscription plans** (Free/Pro) with feature gating
- **Full CRUD operations** for notes with tenant isolation
- **Responsive UI** with shadcn/ui components
- **Deployment ready** for Vercel

## Multi-Tenancy Approach

This application uses a **shared schema with tenant ID column** approach for multi-tenancy. All tenant-specific data includes a `tenantId` field that is used to enforce data isolation. This approach provides:

1. **Data Isolation**: All database queries include a `tenantId` filter to ensure users can only access data from their own tenant
2. **Scalability**: Easy to scale with MongoDB's horizontal scaling capabilities
3. **Maintainability**: Single database schema simplifies maintenance and updates

## Test Accounts

The following test accounts are available (all with password: `password`):

| Email | Role | Tenant | Plan |
|-------|------|--------|------|
| `admin@acme.test` | Admin | Acme | Free |
| `user@acme.test` | Member | Acme | Free |
| `admin@globex.test` | Admin | Globex | Free |
| `user@globex.test` | Member | Globex | Free |

## Subscription Plans

### Free Plan
- Up to 3 notes
- Basic note management
- Multi-user support
- Role-based access control

### Pro Plan ($10/month)
- Unlimited notes
- Advanced note management
- Priority support
- Export capabilities
- Custom themes
- Advanced security features

## API Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/auth/login` | User authentication | Public |
| `GET` | `/api/auth/me` | Get current user info | JWT required |
| `POST` | `/api/auth/logout` | User logout | JWT required |
| `GET` | `/api/health` | Health check endpoint | Public |
| `GET` | `/api/notes` | List all notes for current tenant | JWT required |
| `POST` | `/api/notes` | Create a new note | JWT required |
| `GET` | `/api/notes/:id` | Get a specific note | JWT required |
| `PUT` | `/api/notes/:id` | Update a note | JWT required |
| `DELETE` | `/api/notes/:id` | Delete a note | JWT required |
| `POST` | `/api/tenants/:slug/upgrade` | Upgrade tenant to Pro plan | Admin only |

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **UI Components**: shadcn/ui with Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/akashgupta157/my-notes-app.git
   cd my-notes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Initialize the database**
   ```bash
   npm run init-data
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Security Features

- JWT authentication with HTTP-only cookies
- Role-based access control
- Tenant data isolation at the application level
- Password hashing with bcrypt
- CORS enabled for API endpoints
- Input validation and error handling

## Usage

### For Admins
1. Log in with an admin account
2. View and manage all notes in your tenant
3. Access the upgrade page to subscribe to the Pro plan
4. Invite users to your tenant (if implemented)

### For Members
1. Log in with a member account
2. View, create, edit, and delete your notes
3. See note limit warnings on the Free plan

### Testing Multi-Tenancy
1. Log in as a user from Acme tenant
2. Create some notes
3. Log out and log in as a user from Globex tenant
4. Verify that you cannot see Acme's notes

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
