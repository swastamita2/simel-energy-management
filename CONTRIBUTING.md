# Contributing to Energy Management Dashboard

Thank you for your interest in contributing to the Energy Management Dashboard! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Maintain a professional environment

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/your-username/web-simul.git
   cd web-simul
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy environment file:

   ```bash
   cp .env.example .env.local
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## 💻 Development Workflow

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Test your changes:

   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. Commit your changes (see [Commit Guidelines](#commit-guidelines))
5. Push to your fork
6. Open a Pull Request

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type when possible
- Use strict type checking

### React

- Use functional components with hooks
- Follow React best practices
- Keep components focused and reusable
- Use proper prop types

### Styling

- Use Tailwind CSS utility classes
- Follow existing component patterns
- Keep styles consistent with design system
- Use shadcn/ui components when possible

### File Organization

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── layouts/        # Layout components
├── services/       # API services
├── types/          # TypeScript types
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── constants/      # Constants and configs
└── config/         # Configuration files
```

### Naming Conventions

- **Components**: PascalCase (e.g., `EnergyChart.tsx`)
- **Files**: camelCase or kebab-case
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

## 📌 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes

### Examples

```bash
feat(monitoring): add real-time device control
fix(dashboard): correct energy consumption calculation
docs(readme): update installation instructions
style(components): format code with prettier
refactor(api): simplify error handling
test(utils): add tests for formatCurrency function
```

## 🔄 Pull Request Process

1. **Update Documentation**: Update README.md if needed
2. **Add Tests**: Ensure your code is tested
3. **Follow Style Guide**: Run linting and formatting
4. **Write Clear Description**: Explain what and why
5. **Link Issues**: Reference related issues
6. **Request Review**: Tag relevant reviewers
7. **Address Feedback**: Respond to review comments

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Changes are backwards compatible

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for all new features
- Update tests for bug fixes
- Aim for good coverage (>80%)
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 🐛 Bug Reports

When reporting bugs, please include:

- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

## 💡 Feature Requests

When requesting features, please include:

- Clear description of the feature
- Use case/motivation
- Proposed solution
- Alternative solutions considered

## 📞 Getting Help

- Check existing issues and discussions
- Ask in discussions for questions
- Tag maintainers for urgent issues

## 🙏 Thank You!

Your contributions make this project better. We appreciate your time and effort!
