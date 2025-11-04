# Contributing to Fachowiec PWA

First off, thank you for considering contributing to Fachowiec PWA! It's people like you that make this application better for tradespeople everywhere.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to support@fachowiec.pl.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**When creating a bug report, include:**
- **Clear title**: Descriptive summary of the issue
- **Steps to reproduce**: Detailed steps to reproduce the problem
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable
- **Environment**: Browser, OS, device
- **Console errors**: Any error messages in browser console

**Example bug report:**
```markdown
**Title:** Jobs not saving when offline on iOS Safari

**Steps to Reproduce:**
1. Open app on iOS Safari
2. Enable airplane mode
3. Try to add a new job
4. Check IndexedDB in DevTools

**Expected:** Job should save to IndexedDB
**Actual:** Error thrown, job not saved
**Browser:** Safari 14.1, iOS 14.5
**Console Error:** `QuotaExceededError: IndexedDB storage limit exceeded`
```

### Suggesting Features

Feature suggestions are welcome! Please:
- Check existing feature requests first
- Use the feature request template
- Provide a clear use case
- Explain why this feature would be useful
- Consider if it fits the project scope

**Example feature request:**
```markdown
**Feature:** Export jobs to PDF

**Use Case:** 
As a tradesperson, I want to export my job list to PDF so I can print 
it and share it with clients who don't have digital access.

**Proposed Solution:**
Add an "Export to PDF" button that generates a formatted PDF with:
- Job descriptions
- Statuses
- Dates
- Client information

**Alternatives Considered:**
- CSV export (already exists)
- Print button (simpler but less flexible)
```

### Contributing Code

1. **Fork the repository**
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test your changes** thoroughly
5. **Commit with clear messages** (see Commit Guidelines)
6. **Push to your fork**
7. **Open a Pull Request**

---

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Modern web browser with DevTools

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/your-username/pwa-fachowiec.git
cd pwa-fachowiec

# Add upstream remote
git remote add upstream https://github.com/original-owner/pwa-fachowiec.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, test locally
npm run dev

# Lint code
npm run lint

# Build to verify no errors
npm run build

# Commit changes
git add .
git commit -m "feat: add amazing feature"

# Push to your fork
git push origin feature/my-feature
```

### Project Structure

```
src/
├── data/           # Data layer (IndexedDB)
├── components/     # React components
├── hooks/          # Custom hooks
├── utils/          # Utility functions
├── App.jsx         # Main component
└── main.jsx        # Entry point
```

---

## Coding Guidelines

### JavaScript Style

We follow modern JavaScript best practices:

```javascript
// ✅ Good
const saveJob = async (jobData) => {
  try {
    const id = jobData.id || Date.now().toString();
    await jobStore.setItem(id, { ...jobData, id });
    return id;
  } catch (error) {
    console.error('Failed to save job:', error);
    throw error;
  }
};

// ❌ Bad
function saveJob(jobData) {
  var id = jobData.id || new Date().getTime().toString();
  jobStore.setItem(id, Object.assign({}, jobData, { id: id }));
  return id;
}
```

**Key principles:**
- Use `const` and `let`, never `var`
- Prefer arrow functions
- Use async/await over promises
- Destructure objects and arrays
- Use template literals
- Add JSDoc comments for functions

### React Guidelines

```jsx
// ✅ Good - Functional component with hooks
import { useState, useEffect } from 'react';

export function JobList({ jobs, onDelete }) {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    console.log('Jobs updated:', jobs.length);
  }, [jobs]);

  return (
    <ul>
      {jobs.map(job => (
        <li key={job.id}>
          {job.description}
          <button onClick={() => onDelete(job.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// ❌ Bad - Class component
class JobList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filter: 'all' };
  }
  // ...
}
```

**React best practices:**
- Use functional components
- Use hooks (useState, useEffect, etc.)
- Proper key props in lists
- PropTypes or TypeScript for type checking
- Memoization for performance (useMemo, useCallback)

### CSS Guidelines

```css
/* ✅ Good - BEM-like naming */
.job-list {
  padding: 20px;
}

.job-list__item {
  margin: 10px 0;
}

.job-list__item--active {
  background-color: #e3f2fd;
}

/* ❌ Bad - Generic names */
.item {
  margin: 10px;
}

.active {
  background: blue;
}
```

**CSS best practices:**
- Use meaningful class names
- Follow BEM or similar convention
- Mobile-first responsive design
- Avoid !important
- Use CSS variables for theming

### File Naming

- **Components**: PascalCase (`JobList.jsx`)
- **Utilities**: camelCase (`jobStore.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL.js`)
- **Styles**: kebab-case (`job-list.css`)

### Code Organization

```javascript
// ✅ Good - Organized imports
// 1. External dependencies
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 2. Internal dependencies
import { saveJob, getAllJobs } from './data/jobStore';
import { formatDate } from './utils/date';

// 3. Components
import { JobItem } from './components/JobItem';

// 4. Styles
import './App.css';

// Component code...
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Simple feature
git commit -m "feat: add job deletion functionality"

# Bug fix with scope
git commit -m "fix(storage): handle quota exceeded error in IndexedDB"

# Breaking change
git commit -m "feat!: change job status enum values

BREAKING CHANGE: Job status values changed from
'Lokalny' to 'pending', 'In Progress' to 'active'."

# Detailed commit
git commit -m "refactor(jobStore): improve error handling

- Add try-catch blocks to all async functions
- Return meaningful error messages
- Log errors to console for debugging

Closes #123"
```

### Commit Message Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should be 50 characters or less
- Body should wrap at 72 characters
- Reference issues and pull requests

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console warnings or errors
- [ ] Tested in multiple browsers
- [ ] Tested offline functionality (if applicable)

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested on mobile
- [ ] Tested offline

## Screenshots
If applicable, add screenshots.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested thoroughly
```

### Review Process

1. **Automated checks**: Linting, build verification
2. **Code review**: Maintainer reviews code
3. **Testing**: Manual testing of changes
4. **Approval**: PR approved and merged

### After Merge

- Delete your feature branch
- Pull latest changes from main
- Update your fork

```bash
git checkout main
git pull upstream main
git push origin main
```

---

## Testing Guidelines

### Manual Testing

Before submitting a PR, test:

1. **Functionality**: Feature works as expected
2. **Edge cases**: Test with empty data, large datasets
3. **Error handling**: Test error scenarios
4. **Offline**: Test offline functionality
5. **Browsers**: Test in Chrome, Firefox, Safari
6. **Mobile**: Test on mobile devices
7. **Performance**: Check for slowdowns

### Testing Checklist

```markdown
## Feature Testing Checklist

### Happy Path
- [ ] Feature works with valid input
- [ ] UI updates correctly
- [ ] Data persists correctly

### Edge Cases
- [ ] Works with empty data
- [ ] Works with large datasets (100+ items)
- [ ] Works with special characters
- [ ] Works with very long text

### Error Handling
- [ ] Handles network errors
- [ ] Handles storage errors
- [ ] Shows user-friendly error messages
- [ ] Doesn't crash app

### Offline
- [ ] Works offline
- [ ] Syncs when back online
- [ ] No data loss

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)
```

### Unit Tests (Future)

When we add unit tests:

```javascript
// Example test
import { saveJob, getAllJobs } from './jobStore';

describe('jobStore', () => {
  beforeEach(async () => {
    // Clear database
    await jobStore.clear();
  });

  test('saveJob creates new job with ID', async () => {
    const job = { description: 'Test job' };
    const id = await saveJob(job);
    
    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });

  test('getAllJobs returns all jobs', async () => {
    await saveJob({ description: 'Job 1' });
    await saveJob({ description: 'Job 2' });
    
    const jobs = await getAllJobs();
    expect(jobs).toHaveLength(2);
  });
});
```

---

## Documentation

### Code Comments

```javascript
/**
 * Saves a job to IndexedDB
 * @param {Object} jobData - Job data object
 * @param {string} [jobData.id] - Unique job ID (auto-generated if not provided)
 * @param {string} jobData.description - Job description
 * @param {string} [jobData.status='Lokalny'] - Job status
 * @returns {Promise<string>} Job ID
 * @throws {Error} If save fails
 * @example
 * const id = await saveJob({ description: 'Fix sink' });
 */
export async function saveJob(jobData) {
  // Implementation
}
```

### Component Documentation

```jsx
/**
 * JobList - Displays a list of jobs
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.jobs - Array of job objects
 * @param {Function} props.onDelete - Delete callback
 * @param {boolean} [props.loading=false] - Loading state
 * @example
 * <JobList 
 *   jobs={jobs}
 *   onDelete={handleDelete}
 *   loading={isLoading}
 * />
 */
export function JobList({ jobs, onDelete, loading = false }) {
  // Component code
}
```

### Updating Documentation

When adding features:
- Update README.md
- Update API_DOCUMENTATION.md
- Update COMPONENTS_GUIDE.md
- Add usage examples to USAGE_EXAMPLES.md
- Update ROADMAP.md if applicable

---

## Getting Help

### Resources

- **Documentation**: [API Docs](./API_DOCUMENTATION.md)
- **Examples**: [Usage Examples](./USAGE_EXAMPLES.md)
- **Roadmap**: [Feature Roadmap](./ROADMAP.md)

### Contact

- **GitHub Issues**: [Issues Page](https://github.com/your-username/pwa-fachowiec/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/pwa-fachowiec/discussions)
- **Email**: support@fachowiec.pl

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Our website (when available)

Thank you for contributing! 🎉

---

**Last Updated:** 2025-11-04  
**Version:** 1.0.0
