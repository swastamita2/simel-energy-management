# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Authentication & Authorization System** (Role-based Access Control)
  - Mock authentication without database
  - Four user roles: Admin, Teknisi, Manajer, Mahasiswa/Dosen
  - Auto-detection for Mahasiswa/Dosen (any @ac.id email domain)
  - Login page with form validation (React Hook Form + Zod)
  - AuthContext for global auth state management
  - ProtectedRoute component for route guards
  - Role-based permissions system
  - Permission helper functions (`hasSimplePermission`, `canAccessRoute`)
  - Dynamic sidebar menu based on user role
  - User profile section with role badge
  - Logout functionality with confirmation dialog
  - Documentation in `docs/AUTHENTICATION.md`
- Search Functionality
  - Global search dialog (Ctrl+K shortcut)
  - Debounced search with recent searches
  - Keyboard navigation support
  - Search across energy data, rooms, devices
- Notification System
  - Notification center with real-time updates
  - Four notification types (alert, warning, success, info)
  - Unread badge counter
  - Mark as read and delete actions
  - Priority-based notifications
- Initial project setup with Vite + React + TypeScript
- shadcn/ui component library integration
- TailwindCSS styling
- React Router for navigation
- React Query for data fetching
- Energy Management Dashboard
  - Real-time consumption monitoring
  - KPI cards for key metrics
  - Interactive charts (Recharts)
  - Weekly consumption trends
- Monitoring System
  - Room-level monitoring
  - Device control interface
  - Real-time status updates
- Environment variable configuration
  - `.env.example` template
  - Development and production configs
- API Service Layer
  - Axios-based API client
  - Error handling with interceptors
  - Mock data support for development
  - Energy service endpoints
  - Monitoring service endpoints
  - Authentication service
- TypeScript Types
  - Complete type definitions
  - API response types
  - Domain models (Room, Device, Energy, etc.)
- Utility Functions
  - Currency formatting (IDR)
  - Percentage calculations
  - Date formatting
  - Debounce/throttle helpers
  - Clipboard utilities
- Error Boundary component
- Loading spinner component
- Dashboard Layout component
- Testing Setup
  - Vitest configuration
  - Testing Library integration
  - Sample tests for components and utils
- Code Quality Tools
  - ESLint configuration
  - Prettier formatting
  - Husky git hooks
  - Commitlint for conventional commits
  - Lint-staged for pre-commit checks
- Documentation
  - Comprehensive README
  - Contributing guidelines
  - Code of conduct

### Changed

- Renamed `gitignore.txt` to `.gitignore`
- Enhanced `utils.ts` with additional helper functions
- Updated TypeScript configuration for strict mode

### Fixed

- N/A (initial release)

## [1.0.0] - 2024-12-04

### Added

- Initial release of Energy Management Dashboard
- Basic dashboard functionality
- Real-time monitoring capabilities
- Device control features

---

## Release Types

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes
