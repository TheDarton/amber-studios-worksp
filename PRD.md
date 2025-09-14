# Amber-Studios Workspace PWA

A comprehensive multi-country workspace management platform for Amber Studios with role-based access control, CSV data management, training academies, and mobile-first design.

**Experience Qualities**:
1. **Professional** - Clean, business-focused interface that instills confidence in users managing critical workplace data
2. **Efficient** - Streamlined workflows for data entry, CSV uploads, and role-specific tasks with minimal friction
3. **Accessible** - Mobile-first responsive design that works seamlessly across devices and countries

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Multi-tenant architecture with country isolation, role-based permissions, CSV processing, training content management, and comprehensive admin controls requiring sophisticated state management and security.

## Essential Features

### Authentication System
- **Functionality**: Multi-country login with role-based access (Global Admin, Admin, SM, Dealer, Operation)
- **Purpose**: Secure access control with complete data isolation between countries
- **Trigger**: App launch or session expiration
- **Progression**: Login modal → Country selection → Credentials entry → Role-based dashboard redirect
- **Success criteria**: Users access only their authorized country data and role-appropriate features

### CSV Data Management
- **Functionality**: Upload, validate, and process 8 CSV file types per country with column mapping
- **Purpose**: Centralized data ingestion for schedules, statistics, and mistake tracking
- **Trigger**: Admin uploads via UI or automated GitHub webhook
- **Progression**: File upload → Column mapping → Validation → Preview → Commit → Data available to users
- **Success criteria**: CSV data accurately imported with proper validation and accessible to authorized roles

### Role-Based Data Visibility
- **Functionality**: Filter data views based on user role and ownership (own records vs all records)
- **Purpose**: Ensure users see only relevant data while maintaining security boundaries
- **Trigger**: Page navigation or data requests
- **Progression**: User action → Role check → Data filtering → Appropriate view rendering
- **Success criteria**: Each role sees exactly the data they're authorized to access

### Training Academy System
- **Functionality**: Dual academy structure (Dealer/SM) with rich content, videos, and admin editing
- **Purpose**: Centralized training content management with role-appropriate access
- **Trigger**: Training section navigation or admin content management
- **Progression**: Role check → Academy access → Content browsing/editing → Progress tracking
- **Success criteria**: Training content is properly organized, accessible, and manageable by admins

### Admin Panel
- **Functionality**: User management, CSV imports, password resets, and audit logging
- **Purpose**: Complete administrative control over country-specific operations
- **Trigger**: Admin role authentication and panel access
- **Progression**: Admin login → Panel access → Management tasks → Changes logged and applied
- **Success criteria**: Admins can manage all aspects of their country's data and users

## Edge Case Handling
- **Session Timeout**: Automatic redirect to login with country/role preservation
- **CSV Format Errors**: Detailed validation feedback with row-level error reporting  
- **Network Connectivity**: Offline data caching with sync indicators and retry mechanisms
- **Cross-Country Access Attempts**: Hard blocks with audit logging of unauthorized access
- **Password Recovery Failures**: Escalation workflows and admin notification systems
- **Large File Uploads**: Progress indicators, chunked uploads, and timeout handling

## Design Direction
The design should evoke trust, efficiency, and professionalism while maintaining accessibility across devices and user technical levels. The interface should feel enterprise-grade yet approachable, with clear visual hierarchy that supports complex workflows without overwhelming users.

## Color Selection
Triadic color scheme using the specified brand colors to create visual distinction between interface zones while maintaining brand consistency.

- **Primary Color**: Violet (#4F06A7) - Communicates authority and professionalism for primary actions
- **Secondary Colors**: White (#FFFFFF) for backgrounds and neutral elements, creating clean contrast
- **Accent Color**: Orange (#FFA500) - High-energy highlight for CTAs, notifications, and interactive elements
- **Foreground/Background Pairings**: 
  - Background (White #FFFFFF): Dark Violet text (#4F06A7) - Ratio 8.2:1 ✓
  - Primary (Violet #4F06A7): White text (#FFFFFF) - Ratio 8.2:1 ✓
  - Accent (Orange #FFA500): Dark Violet text (#4F06A7) - Ratio 2.8:1 (Large text only)
  - Card (Light Gray #F8F9FA): Dark text (#1F2937) - Ratio 16.8:1 ✓

## Font Selection
Host Grotesk conveys modern professionalism while maintaining excellent readability across devices and sizes, supporting the app's enterprise focus with clean geometric forms.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Host Grotesk Bold/28px/tight letter spacing
  - H2 (Section Headers): Host Grotesk Semibold/24px/normal spacing  
  - H3 (Subsections): Host Grotesk Medium/20px/normal spacing
  - Body (Content): Host Grotesk Regular/16px/relaxed line height
  - Small (Captions): Host Grotesk Regular/14px/tight line height
  - Button Labels: Host Grotesk Medium/16px/normal spacing

## Animations
Subtle, purposeful animations that support workflow efficiency without drawing attention away from critical business tasks. Motion should feel professional and responsive.

- **Purposeful Meaning**: Smooth transitions between role states and data views reinforce security boundaries while page transitions communicate app structure
- **Hierarchy of Movement**: Form validation feedback and data loading states receive priority, with subtle hover states on interactive elements

## Component Selection
- **Components**: Dialog for login modal, Card for data displays, Form for CSV uploads and user management, Table for schedule/statistics views, Tabs for training academies, Sheet for mobile navigation
- **Customizations**: Custom CSV upload component with drag-drop, progress indicators for file processing, role-based navigation wrapper, country-aware data tables
- **States**: Buttons show loading states during async operations, inputs provide real-time validation feedback, tables display filtering and pagination states
- **Icon Selection**: Phosphor icons for actions (Upload, Settings, User, Calendar, BookOpen for training), maintaining consistent visual weight
- **Spacing**: 4px base unit (Tailwind space-1) with generous 16px+ margins around content sections, 8px gaps in form layouts
- **Mobile**: Collapsible sidebar navigation, responsive tables with horizontal scroll, touch-friendly 44px+ button targets, optimized form layouts for mobile keyboards