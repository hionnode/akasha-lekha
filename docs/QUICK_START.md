# Quick Start Guide: Pre-commit & CI/CD

## 🚀 Setup Complete!

Your blog now has a comprehensive pre-commit and CI/CD setup. Here's what you need to know:

## 📝 Daily Development Workflow

### 1. Make Changes
Edit your code or create new blog posts as usual.

### 2. Commit Changes
```bash
git add .
git commit -m "your commit message"
```

The pre-commit hook will automatically:
- ✨ Lint and format your code
- 📝 Validate blog post frontmatter
- 🔷 Check TypeScript types
- 🏗️  Verify the site builds

If any check fails, the commit will be blocked until you fix the issues.

### 3. Push Changes
```bash
git push origin your-branch
```

### 4. Create Pull Request
When you create a PR, GitHub Actions will:
- ✅ Run all quality checks
- 🚀 Deploy a preview to Cloudflare Pages
- 💬 Post the preview URL as a comment on your PR

### 5. Merge to Main
Once merged, the site automatically deploys to production!

## 🛠️ Available Commands

### Linting
```bash
# Check for linting errors
pnpm lint

# Auto-fix linting errors
pnpm lint:fix
```

### Formatting
```bash
# Check code formatting
pnpm format:check

# Auto-format all files
pnpm format
```

### Type Checking
```bash
# Check TypeScript types
pnpm typecheck
```

### Blog Validation
```bash
# Validate all blog post frontmatter
pnpm validate:blog
```

### Build
```bash
# Build the site
pnpm build

# Preview the build
pnpm preview
```

## ⚠️ One-Time Setup Required

### Configure GitHub Secrets
Before your first PR, you need to add two secrets to your GitHub repository:

1. Go to your repo → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

See `GITHUB_SECRETS_SETUP.md` for detailed instructions.

## 📋 Creating Blog Posts

Blog posts are automatically validated. Required frontmatter:

```yaml
---
title: "Your Post Title"
date: "2025-01-02"
excerpt: "A brief description (min 10 characters)"
tags: ["tag1", "tag2"]
featured: false  # optional
draft: false     # optional
series: "Series Name"  # optional, for multi-part series
seriesPart: 1    # optional
seriesTotal: 5   # optional
---
```

## 🔧 Bypassing Checks (Emergency Only)

If you absolutely need to commit without running checks:

```bash
# NOT RECOMMENDED - Use only in emergencies
git commit --no-verify -m "emergency fix"
```

## 📊 What Happens on Commit?

```
You run: git commit
         ↓
[Pre-commit Hook Runs]
         ↓
1. Lint-staged → ESLint + Prettier on changed files
2. Blog validation → Check frontmatter
3. Type check → TypeScript errors
4. Build → Verify site builds
         ↓
[If all pass] → Commit created ✅
[If any fail] → Commit blocked ❌
```

## 📊 What Happens on Pull Request?

```
You create PR
         ↓
[GitHub Actions Triggered]
         ↓
1. Quality Checks Job
   - Install dependencies
   - Run linting
   - Check formatting
   - Validate blog posts
   - Type check
   - Build site
         ↓
2. Deploy Preview Job (if checks pass)
   - Build site
   - Deploy to Cloudflare Pages
   - Comment on PR with preview URL
         ↓
[You can test changes at preview URL] ✅
```

## 📊 What Happens on Merge to Main?

```
PR merged to main
         ↓
[Production Deployment Workflow]
         ↓
1. Quality Checks Job
   - Full validation suite
         ↓
2. Deploy Production Job (if checks pass)
   - Build site
   - Deploy to Cloudflare Pages production
         ↓
[Site is live!] 🎉
```

## 💡 Tips

### Skip Pre-commit for Specific Files
Add to `.gitignore` or `.prettierignore` / eslint.config.js ignores

### Fix All Formatting Issues
```bash
pnpm format
```

### Fix Auto-fixable Linting Issues
```bash
pnpm lint:fix
```

### Check Everything Before Committing
```bash
pnpm lint && pnpm format:check && pnpm validate:blog && pnpm typecheck && pnpm build
```

## 🐛 Common Issues

### "Husky not found"
```bash
pnpm install
pnpm prepare
```

### "Pre-commit hook not executing"
```bash
chmod +x .husky/pre-commit
```

### "Build failing on CI but works locally"
- Ensure all changes are committed
- Check that dependencies are in package.json
- Verify no environment-specific code

## 📚 More Information

- Full details: `PRE_COMMIT_CI_CD_IMPLEMENTATION_SUMMARY.md`
- GitHub secrets setup: `GITHUB_SECRETS_SETUP.md`
- Blog post guide: `BLOG-GUIDE.md`

## ✨ You're All Set!

Start committing and enjoy automated quality checks and deployments! 🚀



