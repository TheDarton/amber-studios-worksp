# Amber-Studios Workspace - Product Requirements Document

## Core Purpose & Success
- **Mission Statement**: A mobile-first Progressive Web App that provides admin-only access to manage multi-country operations with secure authentication and comprehensive data management.
- **Success Indicators**: Successful admin login, data isolation per country, functional navigation, and secure access control.
- **Experience Qualities**: Professional, secure, efficient

## Project Classification & Approach
- **Complexity Level**: Light Application (admin dashboard with basic authentication)
- **Primary User Activity**: Acting (managing data and users)

## Thought Process for Feature Selection
- **Core Problem Analysis**: Provide simplified admin-only access to country-specific data without complex role management
- **User Context**: Admin users need to quickly access their country's data and management functions
- **Critical Path**: Login → Country Selection → Dashboard → Navigation to features
- **Key Moments**: Authentication, country selection, dashboard overview

## Essential Features

### Authentication System
- Fixed credentials: username "admin", password "admin"
- Country selection dropdown (Poland, Georgia, Colombia, Latvia, Lithuania)
- Session persistence using useKV hook
- Single admin role only

### Dashboard
- Welcome message with admin-specific content
- Quick stats overview (Total Users, System Health, Pending Actions)
- Recent activity feed
- Quick action buttons for key admin functions

### Navigation
- Mobile-first responsive navigation
- Access to all admin features
- Clean sidebar/menu system

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Professional confidence and efficiency
- **Design Personality**: Clean, modern, business-focused
- **Visual Metaphors**: Corporate dashboard, data management interface
- **Simplicity Spectrum**: Minimal interface that prioritizes functionality

### Color Strategy
- **Color Scheme Type**: Brand-based with violet primary and orange accent
- **Primary Color**: Violet (#4F06A7) - conveys professionalism and authority
- **Secondary Colors**: Near-white backgrounds, muted grays for supporting elements
- **Accent Color**: Orange (#FFA500) - for calls-to-action and highlights
- **Color Psychology**: Violet suggests reliability and professionalism, orange adds energy
- **Foreground/Background Pairings**: Dark violet text on white/light gray backgrounds

### Typography System
- **Font Pairing Strategy**: Single font family (Host Grotesk) with varied weights
- **Typographic Hierarchy**: Bold headings, medium weights for labels, regular for body text
- **Font Personality**: Modern, clean, highly readable
- **Typography Consistency**: Consistent spacing and sizing based on Tailwind scale

### Visual Hierarchy & Layout
- **Attention Direction**: Primary actions emphasized with violet buttons and orange accents
- **White Space Philosophy**: Generous spacing for mobile-first clarity
- **Grid System**: Responsive grid using Tailwind's layout utilities
- **Responsive Approach**: Mobile-first with progressive enhancement

### UI Elements & Component Selection
- **Component Usage**: Shadcn components for consistency and accessibility
- **Component States**: Clear hover, focus, and active states
- **Icon Selection**: Phosphor icons for clean, modern aesthetic
- **Spacing System**: Tailwind's spacing scale for consistency

## Implementation Considerations
- **Scalability Needs**: Prepared for future role expansion and feature additions
- **Testing Focus**: Authentication flow, country selection, navigation
- **Critical Questions**: Data persistence requirements, mobile performance

## Reflection
This simplified approach removes complexity while maintaining the foundation for future expansion. The admin-only model provides immediate value while keeping the authentication system simple and secure.