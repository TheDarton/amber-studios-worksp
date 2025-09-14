# Amber-Studios Workspace PWA

A comprehensive multi-country workspace management platform for Amber Studios with role-based access control, CSV data management, training academies, and mobile-first design.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Default Login Credentials

**Poland:**
- Admin: `admin` / `password` 
- SM: `piotr.sm` / `password`
- Dealer: `anna.dealer` / `password`
- Operation: `tomasz.ops` / `password`

**Georgia:**
- Admin: `admin` / `password`
- SM: `nino.sm` / `password` 
- Dealer: `david.dealer` / `password`

**Global Admin:** `global.admin` / `password` (works with any country)

## 📱 Features

### Multi-Country Support
- Complete data isolation between countries (Poland, Georgia, Colombia, Latvia, Lithuania)
- Country-specific admin roles
- Global admin with cross-country access

### Role-Based Access Control
- **Dealer**: View own schedule, training, and mistake data
- **SM**: Manage team, access both training academies, news
- **Operation**: Full data visibility, both academies, news
- **Admin**: Country management, user management, CSV imports
- **Global Admin**: Cross-country admin access + admin password recovery

### Data Management
- CSV import system for 8 file types per country
- Schedule management (current/adjacent periods)
- Mistake tracking and statistics
- Training content management
- News and updates system

### Mobile-First Design
- Responsive layout optimized for mobile devices
- Touch-friendly navigation
- Offline-ready architecture (placeholders implemented)
- PWA capabilities for mobile app-like experience

## 📊 CSV Data Format

The system supports 8 CSV file types per country:

### 1. dealer_schedule_current.csv
```csv
dealer_name,dealer_login,date,shift,location,notes
Anna Wiśniewska,anna.dealer,2024-12-23,Morning,Warsaw Central,New product training
```

### 2. dealer_schedule_adjacent.csv  
```csv
dealer_name,dealer_login,date,shift,location,notes
Anna Wiśniewska,anna.dealer,2024-11-30,Evening,Warsaw Central,Previous month data
```

### 3. sm_schedule_current.csv
```csv
sm_name,sm_login,date,shift,area,dealers,notes
Piotr Nowak,piotr.sm,2024-12-23,Morning,Warsaw District,"anna.dealer,marek.dealer",Team meeting scheduled
```

### 4. sm_schedule_adjacent.csv
```csv
sm_name,sm_login,date,shift,area,dealers,notes
Piotr Nowak,piotr.sm,2024-11-30,Evening,Warsaw District,"anna.dealer",Previous month
```

### 5. mistake_statistics_current.csv
```csv
period,dealer_name,dealer_login,mistake_type,count,severity,trend
2024-12,Anna Wiśniewska,anna.dealer,Pricing Error,3,medium,improving
```

### 6. mistake_statistics_previous.csv
```csv
period,dealer_name,dealer_login,mistake_type,count,severity,trend
2024-11,Anna Wiśniewska,anna.dealer,Pricing Error,5,high,stable
```

### 7. daily_mistakes_current.csv
```csv
date,dealer_name,dealer_login,mistake_description,category,severity,correction_action,status
2024-12-23,Anna Wiśniewska,anna.dealer,Incorrect price entry,Pricing,medium,Retrain on pricing policy,resolved
```

### 8. daily_mistakes_previous.csv
```csv
date,dealer_name,dealer_login,mistake_description,category,severity,correction_action,status
2024-11-30,Anna Wiśniewska,anna.dealer,Missing customer signature,Documentation,low,Reminder sent,resolved
```

## 🔗 Power Automate Integration

### GitHub Integration Setup

1. **Create GitHub Repository** for CSV data:
   ```
   amber-studios-data/
   ├── poland/
   │   ├── dealer_schedule_current.csv
   │   ├── dealer_schedule_adjacent.csv
   │   └── ...
   ├── georgia/
   └── ...
   ```

2. **Power Automate Flow**:
   - Trigger: When files are created/modified in source system
   - Action: Upload CSV files to GitHub repository
   - Format: Use country-specific folders

3. **Webhook Integration** (Backend Implementation Required):
   ```javascript
   // Example webhook endpoint structure
   POST /api/webhook/csv-import
   {
     "country": "poland",
     "file_type": "dealer_schedule_current", 
     "github_url": "https://github.com/org/repo/raw/main/poland/dealer_schedule_current.csv"
   }
   ```

4. **Automated Processing**:
   - Webhook receives GitHub file URLs
   - System downloads and validates CSV files
   - Automatic import with error reporting
   - Admin notification of import status

## 🏗️ Architecture

### Frontend (Current Implementation)
- **React 19** with TypeScript
- **Tailwind CSS** with Amber Studios brand colors
- **shadcn/ui** component library
- **Spark Runtime** for data persistence and LLM integration
- **Framer Motion** for animations
- **Sonner** for notifications

### Backend Stubs (Ready for Implementation)
```
/api/auth
├── POST /login
├── POST /logout  
├── POST /refresh-token
└── POST /reset-password

/api/users
├── GET /users/:country
├── POST /users
├── PUT /users/:id
└── DELETE /users/:id

/api/csv
├── POST /csv/upload
├── GET /csv/jobs
├── POST /csv/validate
├── POST /csv/import
└── GET /csv/data/:type/:country

/api/training
├── GET /training/:academy
├── POST /training/content
├── PUT /training/content/:id
└── DELETE /training/content/:id

/api/news
├── GET /news/:country
├── POST /news
├── PUT /news/:id
└── DELETE /news/:id
```

### Data Storage Strategy
- **Small Data**: Key-value store (user preferences, settings)
- **Structured Data**: JSON files or simple relational DB
- **Country Isolation**: Logical separation with country prefixes
- **Mobile Sync**: REST endpoints for offline-first mobile apps

## 📱 Mobile App Development

### React Native/Expo Integration
The codebase is structured for easy React Native porting:

1. **Shared Components**: UI components in `/components` can be reused
2. **Business Logic**: Hooks and utilities are platform-agnostic  
3. **State Management**: Spark KV can be replaced with AsyncStorage
4. **Navigation**: Current routing can map to React Navigation

### Migration Steps:
```bash
# 1. Create Expo project
npx create-expo-app AmberStudiosApp --template tabs

# 2. Copy shared code
cp -r src/components/ mobile/src/
cp -r src/hooks/ mobile/src/
cp -r src/types/ mobile/src/

# 3. Adapt platform-specific code
# - Replace web routing with React Navigation
# - Replace Spark KV with AsyncStorage + API calls
# - Adapt shadcn components to React Native equivalents
```

## 🎨 Brand Guidelines

### Colors
- **Primary**: #4F06A7 (Violet) - Authority and professionalism
- **Secondary**: #FFFFFF (White) - Clean backgrounds  
- **Accent**: #FFA500 (Orange) - CTAs and highlights

### Typography
- **Font**: Host Grotesk (Google Fonts)
- **Hierarchy**: Bold headlines, medium subheadings, regular body text

### Design Principles
- Mobile-first responsive design
- Clean, professional enterprise interface
- Generous whitespace and clear visual hierarchy
- Consistent component usage across all pages

## 🔒 Security Considerations

### Authentication
- Password hashing (bcrypt recommended for production)
- JWT tokens with secure refresh mechanism
- Session timeout and cleanup

### Authorization  
- Role-based permissions enforced at API level
- Country-based data isolation
- Audit logging for sensitive operations

### Data Protection
- Country-specific data isolation
- Secure CSV upload with validation
- Input sanitization and XSS prevention

## 🚧 Development Roadmap

### Phase 1 (Current)
- ✅ Authentication system
- ✅ Role-based navigation  
- ✅ Basic dashboard
- ✅ Mobile-responsive design

### Phase 2 (Next)
- CSV import UI with validation
- Data tables with filtering
- Training academy content management
- News and updates system

### Phase 3 (Future)
- Real backend API integration
- Advanced reporting and analytics
- Push notifications
- Offline synchronization
- Mobile app (React Native/Expo)

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

## 📄 License

This project is proprietary software owned by Amber Studios.

---

**Built with ❤️ for Amber Studios by the Development Team**