# 🤝 Contributing to Crackifyed Backend

Thank you for contributing to the Crackifyed Backend! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and professional in all interactions.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 12 or higher with PostGIS extension
- Git

### Setup Development Environment

```bash
# 1. Clone the repository
git clone <repo-url>
cd crackifyed/backend

# 2. Install dependencies
npm install

# 3. Create .env from .env.example
cp .env.example .env

# 4. Start development server
npm run start:dev
```

## Development Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `bugfix/description`
- Hotfix: `hotfix/description`
- Chore: `chore/description`

### Creating a Feature

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**
   - Write code following the style guide
   - Write tests for new functionality
   - Update documentation

3. **Run tests**
   ```bash
   npm run test          # Run tests
   npm run test:cov     # With coverage
   npm run lint         # Linting
   npm run format       # Formatting
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

5. **Push to remote**
   ```bash
   git push origin feature/my-feature
   ```

6. **Create Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Add screenshots/examples if applicable

## Commit Message Guidelines

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Tests
- `chore`: Maintenance

### Examples
```
feat(ratings): add nearby search functionality
fix(persons): handle missing images gracefully
docs(api): update endpoint documentation
style: format code with prettier
```

## Style Guide

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Format with Prettier

```bash
npm run lint      # Check style
npm run format    # Fix formatting
```

### Naming Conventions
- **Classes**: PascalCase (e.g., `PersonService`)
- **Functions**: camelCase (e.g., `findPersonById()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RATING`)
- **Files**: kebab-case for most files, PascalCase for entities

### Code Structure
```typescript
// Import statements
import { Injectable } from '@nestjs/common';

// Class definition
@Injectable()
export class MyService {
  // Constructor
  constructor(private readonly repository: MyRepository) {}

  // Public methods
  public method1(): void {}

  // Private methods
  private helperMethod(): void {}
}
```

## Testing

### Writing Tests
```typescript
describe('PersonService', () => {
  describe('findAll', () => {
    it('should return all persons', async () => {
      const result = await service.findAll();
      expect(result).toBeDefined();
    });
  });
});
```

### Running Tests
```bash
npm run test              # Run all tests once
npm run test:watch      # Watch mode
npm run test:cov        # With coverage report
```

### Coverage Targets
- Services: 80%
- Controllers: 70%
- Overall: 75%

## Documentation

### API Documentation
- Update relevant files in `docs/`
- Run Swagger generation
- Test endpoints manually

### Code Comments
- Document complex logic
- Explain "why", not "what"
- Use JSDoc for functions

### Example JSDoc
```typescript
/**
 * Find a person by ID with all their ratings
 * @param id - The person ID
 * @returns Person object with ratings
 * @throws NotFoundException if person doesn't exist
 */
public async findById(id: number): Promise<Person> {
  // Implementation
}
```

## Database Changes

### Creating Migrations
```bash
npm run migration:generate -- src/migrations/DescriptionOfChange
```

### Running Migrations
```bash
npm run migration:run
```

### Reverting Migrations
```bash
npm run migration:revert
```

## Review Process

### Before Submitting PR
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Code is formatted with Prettier
- [ ] ESLint passes
- [ ] Documentation is updated
- [ ] No console.log statements left
- [ ] Commit messages are clear

### PR Review
- All PRs require at least 1 approval
- Address feedback and suggestions
- Keep commits clean and meaningful

## Issues and Bugs

### Reporting Issues
- Use GitHub Issues
- Provide clear title and description
- Include steps to reproduce
- Attach error logs if applicable
- Specify version/environment

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers

## Performance Considerations

When adding features:
- Minimize database queries
- Use pagination for lists
- Cache when appropriate
- Avoid N+1 query problems
- Test with large datasets

### Optimization Tips
```typescript
// ✓ Good: Eager load relations
const persons = await this.repository.find({
  relations: ['ratings'],
});

// ✗ Bad: N+1 queries
const persons = await this.repository.find();
persons.forEach(p => p.ratings); // Loads ratings one by one
```

## Security Considerations

- Never commit secrets or credentials
- Validate all user inputs
- Use parameterized queries
- Escape output when needed
- Keep dependencies updated
- Report security issues privately

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Conventional Commits](https://www.conventionalcommits.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Questions?

- Check existing issues and PRs
- Read documentation
- Ask in discussions
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy coding! 🚀**
