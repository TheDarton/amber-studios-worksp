# Amber-Studios Workspace

A mobile-first Progressive Web App for multi-country workspace management with role-based access control.

## Features

- **Multi-country Support**: Fully isolated data for Poland, Georgia, Colombia, Latvia, and Lithuania
- **Role-based Access**: Admin, SM, Dealer, and Operation roles with appropriate permissions
- **User Management**: Admin can create and manage user accounts for their country
- **CSV Import**: Upload and process 8 different types of CSV files
- **Training Academy**: Separate academies for Dealers and SMs with video content support
- **Audit Logging**: Track all system activities and changes
- **Mobile-first Design**: Responsive design optimized for mobile devices

## User Roles & Permissions

### Admin
- Full CRUD access for their country
- Create and manage user accounts (SM, Dealer, Operation)
- Upload and process CSV files
- Access all data views
- Reset user passwords
- View audit logs

### SM (Sales Manager)
- View SM schedules, mistake statistics, daily mistakes
- Access both Training Academies
- View News & Updates
- Handle handover/takeover records

### Dealer
- View dealer schedules, mistake statistics, daily mistakes (own data only)
- Access Dealer Training Academy only
- Request schedule changes

### Operation
- View all schedules and mistake data (read-only)
- Access both Training Academies (view-only)
- View News & Updates
- Handle handover/takeover records

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd amber-studios-workspace
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Default Login
- **Username**: admin
- **Password**: admin
- **Country**: Select any from dropdown

## CSV File Types

The system supports 8 types of CSV files per country:

1. **dealer_schedule_current.csv** - Current dealer schedules
2. **dealer_schedule_adjacent.csv** - Previous or next period dealer schedules  
3. **sm_schedule_current.csv** - Current SM schedules
4. **sm_schedule_adjacent.csv** - Previous or next period SM schedules
5. **mistake_statistics_current.csv** - Current period mistake statistics
6. **mistake_statistics_previous.csv** - Previous period mistake statistics
7. **daily_mistakes_current.csv** - Current daily mistake records
8. **daily_mistakes_previous.csv** - Previous daily mistake records

See `/docs/csv-schemas/` for detailed column specifications.

## CSV Import Process

### Manual Upload
1. Login as Admin
2. Go to Admin Panel → CSV Import
3. Select file type and country
4. Upload CSV file
5. Review and confirm import

### GitHub Integration (Future)
The system supports automated CSV import from GitHub repositories:
1. Power Automate pushes CSV files to GitHub repo
2. Webhook triggers automatic import
3. Files are validated and processed automatically

**Webhook URL**: `https://your-app.com/api/webhook/csv-import`

## User Management

### Creating Users
1. Login as Admin
2. Go to Admin Panel → Users
3. Click "Create User"
4. Fill in user details:
   - Name and contact information
   - Login credentials
   - Role (SM, Dealer, Operation)
   - Country assignment

### Password Management
- Admin can reset any user's password in their country
- Users will receive reset instructions (email integration required)
- Temporary passwords can be generated for new users

## Data Visibility Rules

### Dealer Users
- Can only see their own records in schedules and mistake data
- Identified by login or name+surname match in CSV files

### SM Users  
- Can see their assigned dealer data
- Access to SM-specific schedules and areas

### Operation Users
- Can see all data without filters
- Read-only access to most content

### Admin Users
- Full access to all country data
- Can modify and delete records
- Access to user management and system settings

## Training Academy

### Structure
- **Dealer Training Academy**: For Dealers only
- **SM Training Academy**: For SMs, Operations, and Admins

### Content Types
- Video content (embedded player)
- Documents and articles
- Interactive quizzes (future)
- Categories and subcategories

### Permissions
- Admins can add/edit/delete content in both academies
- Users can view content based on their role
- Progress tracking (future enhancement)

## Mobile App Integration

The PWA is designed to share components and logic with React Native/Expo mobile apps:

### Shared Components
- All UI components in `/src/components/` are designed to be portable
- Business logic in `/src/lib/` can be reused
- Types in `/src/types/` are shared between platforms

### API Endpoints
The app includes REST API stubs for:
- Authentication (`/api/auth`)
- User management (`/api/users`)
- CSV import (`/api/csv`)
- Data synchronization (`/api/sync`)

### Offline Support
- Service worker registration included
- Data caching with background sync (to be implemented)
- Conflict resolution for offline changes

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components  
│   ├── AdminPanel.tsx  # Admin functionality
│   ├── UserManagement.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
├── types/              # TypeScript type definitions
├── assets/             # Images, videos, documents
└── styles/             # CSS and styling
```

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Phosphor Icons
- **Notifications**: Sonner
- **Storage**: KV store for persistence
- **Build**: Vite

### Adding New Features
1. Define types in `/src/types/`
2. Create components in `/src/components/`
3. Add business logic to `/src/lib/`
4. Update navigation and routing
5. Add appropriate permissions checks

## Deployment

### PWA Features
- Installable on mobile devices
- Offline capability
- Push notifications (to be implemented)
- Background sync

### Production Build
```bash
npm run build
```

### Environment Configuration
Set the following environment variables:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_GITHUB_WEBHOOK_SECRET` - GitHub webhook secret
- `VITE_APP_ENV` - Environment (development/production)

## API Integration

### Backend Requirements
The PWA expects a REST API with the following endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

#### User Management  
- `GET /api/users` - List users (admin only)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `POST /api/users/:id/reset-password` - Reset password

#### CSV Import
- `POST /api/csv/upload` - Upload CSV file
- `GET /api/csv/jobs` - List import jobs
- `POST /api/csv/jobs/:id/process` - Process uploaded file

#### Data Access
- `GET /api/schedules` - Get schedule data
- `GET /api/mistakes` - Get mistake statistics
- `GET /api/training` - Get training content
- `GET /api/news` - Get news updates

### Data Sync
Mobile apps can synchronize data using:
- `GET /api/sync/delta/:timestamp` - Get changes since timestamp
- `POST /api/sync/push` - Push local changes to server

## Security Considerations

### Authentication
- JWT tokens for API access
- Role-based permissions enforced server-side
- Country-level data isolation

### Data Protection
- Per-country data segregation
- Encrypted passwords and sensitive data
- Audit logging for all changes
- GDPR compliance measures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[License information]

## Support

For questions and support, contact the development team or create an issue in the repository.