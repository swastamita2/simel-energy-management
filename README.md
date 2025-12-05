# Energy Management Dashboard 🔋⚡

Real-time monitoring and analytics dashboard for ITPLN campus energy facilities. Built with modern web technologies for optimal performance and user experience.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-18.3-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### Dashboard

- 📊 Real-time energy consumption monitoring
- 📈 Interactive charts and visualizations
- 💰 Cost savings tracking
- 🌱 Carbon reduction metrics
- 📉 Weekly consumption trends

### Monitoring

- 🏢 Room-level energy monitoring
- 💡 Device control interface
- 🌡️ Temperature monitoring
- ⚡ Real-time power consumption
- 🔴 Alert system for anomalies

### Analytics

- 📊 Historical data analysis
- 📈 Trend forecasting
- 📉 Efficiency metrics
- 📋 Custom reports generation

### Additional Features

- 🎨 Modern, responsive UI with shadcn/ui
- 🌓 Dark mode support
- 📱 Mobile-friendly design
- 🔐 Authentication & authorization (ready)
- 🧪 Comprehensive testing setup
- 📝 TypeScript for type safety
- 🚀 Fast development with Vite

## 🛠 Tech Stack

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/web-simul.git
   cd web-simul
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_ENABLE_MOCK_DATA=true
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
web-simul/
├── .github/              # GitHub workflows (CI/CD)
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── dashboard/   # Dashboard components
│   │   └── monitoring/  # Monitoring components
│   ├── pages/           # Page components
│   ├── layouts/         # Layout components
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

## 💻 Development

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

| Variable                | Description                | Default                     |
| ----------------------- | -------------------------- | --------------------------- |
| `VITE_API_BASE_URL`     | Backend API URL            | `http://localhost:3000/api` |
| `VITE_ENABLE_MOCK_DATA` | Use mock data              | `true`                      |
| `VITE_ENABLE_DEV_TOOLS` | Enable dev tools           | `true`                      |
| `VITE_REFRESH_INTERVAL` | Data refresh interval (ms) | `5000`                      |

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **Commitlint** for commit message validation

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Generate coverage
npm run test:coverage
```

### Writing Tests

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

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel deploy --prod
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy via Lovable

Simply open [Lovable](https://lovable.dev/projects/94fe7620-77e0-4458-b921-7bb8f6ef0b98) and click on Share → Publish.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team

**Institut Teknologi PLN**

- Energy Management Team

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icons
- [Recharts](https://recharts.org/) for the charts
- Built with [Lovable](https://lovable.dev/)

## 📞 Support

For support, email support@itpln.ac.id or open an issue.

---

Made with ❤️ by ITPLN Team
