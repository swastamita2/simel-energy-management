# Energy Management Dashboard

A comprehensive real-time monitoring and analytics platform for ITPLN campus energy facilities. This application provides a complete solution for tracking energy consumption, managing devices, and optimizing energy efficiency across multiple buildings and rooms.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-18.3-blue)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

### Core Dashboard Capabilities

- Real-time energy consumption monitoring with live data updates
- Interactive data visualizations and analytics charts
- Financial tracking for cost savings and ROI analysis
- Environmental impact metrics including carbon footprint reduction
- Historical trend analysis with weekly and monthly views

### Monitoring System

- Building-wide and room-level energy tracking
- Remote device control interface with status monitoring
- Environmental sensors integration for temperature monitoring
- Live power consumption metrics per device
- Automated alert system for detecting anomalies and threshold violations

### Analytics Engine

- Comprehensive historical data analysis
- Predictive trend forecasting using consumption patterns
- Performance efficiency metrics and KPI tracking
- Custom report generation with flexible date ranges and parameters

### Administration Modules

**Rooms Management**

- Complete CRUD operations for managing building spaces
- Real-time tracking of device count and energy consumption per room
- Data export and import capabilities in JSON format for backup and migration
- Advanced search and filtering by building, floor, or status
- Statistics dashboard displaying active rooms and consumption patterns

**Devices Management**

- Full lifecycle management for all energy-consuming devices
- Bulk device import via CSV with built-in validation
- Pre-configured device templates for common room types:
  - Standard Lab: 2 AC units, 1 Projector, 10 Computers, 1 Light panel
  - Smart Classroom: 1 AC unit, 1 Projector, 1 Sound system, 2 Lights
  - Office Space: 1 AC unit, 5 Computers, 1 Light panel
  - Auditorium: 4 AC units, 2 Projectors, 1 Sound system, 1 Stage lighting
- Multi-criteria filtering (room, device type, operational status)
- Real-time statistics dashboard with device health monitoring
- Downloadable CSV template for streamlined data entry

**Data Management**

- Automatic synchronization with browser localStorage
- No backend database required for development
- Export and import functionality for data portability
- Template library with persistent storage

### Technical Features

- Modern, responsive interface built with shadcn/ui component library
- Dark mode support with system preference detection
- Mobile-optimized design with touch-friendly controls
- Role-based access control with five distinct user roles
- Advanced search functionality with keyboard shortcuts (Ctrl+K)
- Comprehensive test coverage with Vitest and Testing Library
- Full TypeScript implementation for type safety and IDE support
- Optimized build pipeline with Vite for fast development and production builds
- Performance optimization using React best practices (memoization, lazy loading)

## Tech Stack

### Frontend

- **Framework**: React 18.3
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 5.4
- **Styling**: TailwindCSS 3.4
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM 6.30
- **State Management**: React Query 5.83
- **Charts**: Recharts 2.15
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Development Tools

- **Testing**: Vitest + Testing Library
- **Linting**: ESLint 9
- **Formatting**: Prettier
- **Git Hooks**: Husky + Lint-staged
- **Commit Lint**: Commitlint

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js 18.x or higher
- npm (comes with Node.js)
- Git for version control

### Installation

Follow these steps to set up the development environment:

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/web-simul.git
   cd web-simul
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   VITE_API_BASE_URL=/api
   VITE_API_PROXY_TARGET=http://localhost:3000
   VITE_ENABLE_MOCK_DATA=false
   ```

4. **Start backend API (for real API mode)**

   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```

   Default test credentials:
   - Email: `admin@itpln.ac.id`
   - Password: `admin123`

5. **Start the frontend development server**

   ```bash
   npm run dev
   ```

6. **Access the application**

   Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
web-simul/
├── backend/              # Local API server (Express + JWT)
├── .github/              # GitHub workflows (CI/CD)
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── monitoring/  # Monitoring components
│   │   └── auth/        # Authentication components
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Monitoring.tsx
│   │   ├── Analytics.tsx
│   │   ├── RoomsManagement.tsx      # NEW: Rooms CRUD
│   │   ├── DevicesManagement.tsx    # NEW: Devices CRUD
│   │   ├── Reports.tsx
│   │   ├── Automation.tsx
│   │   ├── Users.tsx
│   │   └── Settings.tsx
│   ├── layouts/         # Layout components
│   ├── contexts/        # React contexts
│   │   ├── EnergyContext.tsx    # Energy data & CRUD methods
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── services/        # API services
│   │   ├── api.ts       # API client
│   │   ├── energyService.ts
│   │   ├── monitoringService.ts
│   │   └── authService.ts
│   ├── types/           # TypeScript types
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── constants/       # App constants
│   ├── config/          # Configuration
│   └── test/            # Test utilities
├── .env.example         # Environment template
├── eslint.config.js     # ESLint config
├── .prettierrc          # Prettier config
├── vitest.config.ts     # Vitest config
├── tailwind.config.ts   # Tailwind config
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:run         # Run tests once
npm run test:coverage    # Generate coverage report
```

### Environment Variables

| Variable                | Description                | Default                 |
| ----------------------- | -------------------------- | ----------------------- |
| `VITE_API_BASE_URL`     | Frontend API path          | `/api`                  |
| `VITE_API_PROXY_TARGET` | Backend proxy target       | `http://localhost:3000` |
| `VITE_ENABLE_MOCK_DATA` | Use mock data              | `true`                  |
| `VITE_ENABLE_DEV_TOOLS` | Enable dev tools           | `true`                  |
| `VITE_REFRESH_INTERVAL` | Data refresh interval (ms) | `5000`                  |

### Administration System Usage

#### Rooms Management

The Rooms Management module is accessible through the sidebar navigation menu (admin role required) or via the quick search feature (Ctrl+K → type "rooms").

**Key Features:**

- Create new rooms with building assignment and configuration
- Edit room details including name, building location, and operational status
- Delete rooms with automatic validation (warns if devices are assigned)
- View comprehensive statistics including consumption metrics
- Export and import room data in JSON format for backup and migration
- Search and filter capabilities by building or room name

**Usage Workflow:**

1. Navigate to Rooms Management from the sidebar
2. Click the "Add Room" button to create a new space
3. Fill in the required fields: room name and building assignment
4. Toggle the room status (enabled/disabled)
5. Save the configuration and the room will appear in the management table

#### Devices Management

The Devices Management module provides complete control over all energy-consuming devices. Access it through the sidebar menu (admin only) or quick search (Ctrl+K → type "devices").

**Key Features:**

- Manual device addition with detailed specifications
- Bulk device import via CSV with data validation
- Edit device properties including power ratings and operational parameters
- Delete individual devices with confirmation
- Apply pre-built templates for common room configurations
- Advanced filtering by room, device type, and operational status
- Real-time statistics dashboard with device health metrics

**CSV Import Workflow:**

1. Click the "CSV Import" button in the Devices Management interface
2. Download the provided CSV template or prepare your data according to the format
3. Paste the CSV data into the import dialog or upload a file
4. Review the preview of devices to be imported
5. Confirm the import operation (includes automatic validation)

**CSV Data Format:**

```csv
name,type,room,building,maxPower,status
AC Unit 1,AC,Lab Komputer 1,Gedung A - Lt. 2,1500,on
Projector 1,Projector,Lab Komputer 1,Gedung A - Lt. 2,300,on
Computer 1,Computer,Lab Komputer 1,Gedung A - Lt. 2,400,on
```

**Device Template System:**

1. Navigate to the "Templates" tab in Devices Management
2. Select from four pre-configured templates:
   - **Standard Lab**: 2 AC units + 1 Projector + 10 Computers + 1 Light panel (14 devices)
   - **Smart Classroom**: 1 AC unit + 1 Projector + 1 Sound system + 2 Lights (5 devices)
   - **Office Space**: 1 AC unit + 5 Computers + 1 Light panel (7 devices)
   - **Auditorium**: 4 AC units + 2 Projectors + 1 Sound system + 1 Stage lighting (8 devices)
3. Choose the target room where devices will be created
4. Click "Apply" to automatically generate all devices with proper configurations

#### Quick Search Integration

The application includes a powerful quick search feature accessible via **Ctrl+K** keyboard shortcut:

- Search for "rooms" to quickly access Rooms Management
- Search for "devices" to navigate to Devices Management
- Search for specific room names to jump directly to room details
- Search for device names to locate specific equipment
- Navigate to any page by typing its name

#### Data Persistence Strategy

All application data is automatically persisted to browser localStorage:

- Changes are synchronized in real-time across all pages and components
- No backend database configuration required for development
- Export and import functionality provides backup and data portability
- Device template library persists between browser sessions
- Data survives page refreshes and browser restarts

### Code Quality Standards

This project maintains high code quality through the following tools and practices:

- **ESLint**: Static code analysis to identify problematic patterns
- **Prettier**: Automatic code formatting for consistency
- **Husky**: Git hooks for pre-commit quality checks
- **Commitlint**: Enforces conventional commit message standards

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
feat: add new feature
fix: resolve bug or issue
docs: update documentation
style: format code without logic changes
refactor: restructure code without changing behavior
test: add or modify tests
chore: update build process or dependencies
```

## Testing

### Running Tests

Execute the test suite using the following commands:

```bash
# Run all tests in watch mode
npm run test

# Run tests with interactive UI
npm run test:ui

# Generate code coverage report
npm run test:coverage
```

### Writing Tests

Follow this structure for writing new tests:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Deployment

### Building for Production

Generate an optimized production build:

```bash
npm run build
```

The compiled output will be available in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options

**Vercel Deployment**

```bash
npm install -g vercel
vercel deploy --prod
```

**Netlify Deployment**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Lovable Platform**

Navigate to [Lovable](https://lovable.dev/projects/94fe7620-77e0-4458-b921-7bb8f6ef0b98) and use the Share → Publish feature for instant deployment.

## Contributing

Contributions are welcome and appreciated. Please review [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

**Contribution Workflow:**

1. Fork the repository to your GitHub account
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes following conventional commit standards (`git commit -m 'feat: add some amazing feature'`)
4. Push the branch to your fork (`git push origin feature/AmazingFeature`)
5. Submit a Pull Request with a detailed description of your changes

## Project Team

**Institut Teknologi PLN**

Energy Management Development Team

## Acknowledgments

This project leverages several excellent open-source libraries and tools:

- [shadcn/ui](https://ui.shadcn.com/) - High-quality React component library
- [Lucide](https://lucide.dev/) - Beautiful icon set
- [Recharts](https://recharts.org/) - Composable charting library
- Built with [Lovable](https://lovable.dev/) - AI-powered development platform

## Support

For technical support or questions:

- Email: support@itpln.ac.id
- Create an issue in the GitHub repository

---

Institut Teknologi PLN - Energy Management Team
