# Amber-Studios Workspace - Product Requirements Document

## Core Purpose & Success
- **Mission Statement**: A mobile-first Progressive Web App that provides multi-role access to manage multi-country operations with secure authentication, user management, and comprehensive data management.
- **Success Indicators**: Successful authentication for all roles, data isolation per country, functional role-based navigation, user account creation, CSV import functionality, and comprehensive admin panel.
- **Experience Qualities**: Professional, secure, efficient, scalable

## Project Classification & Approach
- **Complexity Level**: Complex Application (multi-role system with advanced functionality, user management, CSV processing)
- **Primary User Activity**: Acting (managing data, users, and operations across multiple roles)

## Thought Process for Feature Selection
- **Core Problem Analysis**: Provide comprehensive multi-role workspace management with country-specific data isolation and role-appropriate access control
- **User Context**: Different user types (Admin, SM, Dealer, Operation) need access to specific functionality based on their role and country
- **Critical Path**: Login → Role-based Dashboard → Feature Access → Data Management
- **Key Moments**: Authentication with role detection, admin user creation, CSV data import, role-appropriate data visibility

## Essential Features

### Authentication System
- Multi-role support: Admin, SM, Dealer, Operation
- Admin credentials: username "admin", password "admin" 
- Country selection dropdown (Poland, Georgia, Colombia, Latvia, Lithuania)
- User account creation by admins for other roles
- Session persistence using useKV hook
- Role-based authentication with created user accounts

### User Management (Admin Only)
- Create user accounts for SM, Dealer, Operation roles
- User profile management (name, email, login, role, country)
- Password reset functionality
- User activation/deactivation
- Role-based access control enforcement

### CSV Import System (Admin Only)
- Support for 8 CSV file types:
  - dealer_schedule_current/adjacent
  - sm_schedule_current/adjacent  
  - mistake_statistics_current/previous
  - daily_mistakes_current/previous
- File upload with validation
- Column mapping interface
- Import progress tracking
- Error reporting and handling
- GitHub integration webhook (future)

### Role-based Navigation
- Admin: Full access to all features including admin panel
- SM: Access to SM schedules, mistakes, training academies, news, handovers
- Dealer: Access to dealer schedules, mistakes, dealer training academy only
- Operation: Read-only access to all schedules and mistakes, both training academies, news, handovers

### Dashboard
- Role-specific welcome content
- Quick stats relevant to user role
- Recent activity feed
- Quick action buttons for key functions

### Training Academy
- Dealer Training Academy (for Dealers)
- SM Training Academy (for SMs, Operations, Admins)
- Video content support
- Category/subcategory organization
- Admin content management

### Audit Logging
- Track all system activities
- User actions and data changes
- CSV import records
- Search and filtering capabilities

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Professional confidence, operational efficiency, and secure reliability
- **Design Personality**: Clean, modern, enterprise-focused with role-appropriate information density
- **Visual Metaphors**: Multi-role workspace, secure data management, operational dashboard
- **Simplicity Spectrum**: Clean interface that scales complexity based on user role

### Color Strategy
- **Color Scheme Type**: Brand-based corporate palette
- **Primary Color**: Violet (#4F06A7) - authority, professionalism, security
- **Secondary Colors**: Near-white backgrounds, structured grays for data organization
- **Accent Color**: Orange (#FFA500) - calls-to-action, highlights, progress indicators
- **Color Psychology**: Violet conveys trust and reliability, orange adds energy and action orientation
- **Foreground/Background Pairings**: 
  - Dark violet text on white/light backgrounds (4.5:1+ contrast)
  - White text on violet backgrounds for primary actions
  - Orange accents on neutral backgrounds for emphasis

### Typography System
- **Font Pairing Strategy**: Host Grotesk variable font for all text with weight variations
- **Typographic Hierarchy**: Bold headings for sections, medium weights for data labels, regular for content
- **Font Personality**: Modern, corporate, highly legible across devices
- **Typography Consistency**: Tailwind typography scale with consistent line heights and spacing
- **Which fonts**: Host Grotesk from Google Fonts
- **Legibility Check**: Host Grotesk provides excellent readability at all sizes

### Visual Hierarchy & Layout
- **Attention Direction**: Primary actions in violet, secondary in gray, critical alerts in orange
- **White Space Philosophy**: Generous spacing for mobile clarity, structured density for data tables
- **Grid System**: Responsive grid system using Tailwind's layout utilities
- **Responsive Approach**: Mobile-first with progressive enhancement for desktop
- **Content Density**: Role-appropriate information density (admins see more, dealers see focused views)

### UI Elements & Component Selection
- **Component Usage**: Shadcn v4 components for forms, tables, dialogs, and navigation
- **Component States**: Clear hover, focus, active, and disabled states
- **Icon Selection**: Phosphor icons for consistent modern aesthetic
- **Spacing System**: Tailwind spacing scale for visual rhythm
- **Mobile Adaptation**: Components collapse and stack appropriately on mobile

### Accessibility & Readability
- **Contrast Goal**: WCAG AA compliance (4.5:1) for all text and meaningful UI elements
- **Focus Management**: Clear focus indicators and logical tab order
- **Screen Reader Support**: Proper ARIA labels and semantic HTML structure

## Implementation Considerations
- **Scalability Needs**: Designed for future role expansion, additional countries, and feature growth
- **Testing Focus**: Multi-role authentication, role-based permissions, CSV import validation, mobile responsiveness
- **Critical Questions**: Data synchronization across roles, CSV column mapping flexibility, user management workflows

## Reflection
This comprehensive approach provides a complete multi-role workspace management system while maintaining clear role boundaries and data security. The admin-centric user management allows for controlled expansion while the role-based access ensures appropriate data visibility and functionality for each user type.