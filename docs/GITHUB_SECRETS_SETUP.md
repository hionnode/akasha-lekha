# GitHub Secrets Setup Guide

This document explains how to configure the required GitHub secrets for the CI/CD workflows.

## Required Secrets

You need to add two secrets to your GitHub repository for the workflows to function:

### 1. CLOUDFLARE_API_TOKEN

**Purpose**: Allows GitHub Actions to deploy to Cloudflare Pages

**How to create**:

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Pages" template
4. Configure permissions:
   - Account: Cloudflare Pages (Edit)
5. Set the token name (e.g., "GitHub Actions - Akasha Lekha")
6. Click "Continue to summary" and then "Create Token"
7. **Copy the token immediately** (you won't be able to see it again)

### 2. CLOUDFLARE_ACCOUNT_ID

**Purpose**: Identifies your Cloudflare account for deployments

**How to find**:

1. Go to your Cloudflare Dashboard
2. Navigate to your Pages project (akasha-lekha)
3. Go to Settings
4. Look for "Account ID" - it's a 32-character hexadecimal string
5. Copy this value

## Adding Secrets to GitHub

1. Go to your GitHub repository: https://github.com/YOUR_USERNAME/akasha-lekha
2. Click on "Settings" (top navigation)
3. In the left sidebar, expand "Secrets and variables"
4. Click on "Actions"
5. Click "New repository secret"
6. Add each secret:

   **First Secret**:
   - Name: `CLOUDFLARE_API_TOKEN`
   - Secret: Paste the API token you created
   - Click "Add secret"

   **Second Secret**:
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Secret: Paste your account ID
   - Click "Add secret"

## Verifying the Setup

After adding the secrets:

1. Create a test branch
2. Make a small change and push
3. Create a pull request
4. Check the "Actions" tab to see if the workflow runs successfully
5. If successful, you should see:
   - All quality checks passing
   - A preview deployment URL posted as a comment on the PR

## Troubleshooting

### Workflow fails with authentication error

- Double-check that `CLOUDFLARE_API_TOKEN` is correct
- Ensure the API token has "Edit Cloudflare Pages" permissions
- Verify the token hasn't expired

### Workflow fails with "Project not found"

- Verify `CLOUDFLARE_ACCOUNT_ID` is correct
- Ensure the project name in the workflow files matches your Cloudflare Pages project name
- Check if the project exists in your Cloudflare account

### Preview URL not posted to PR

- Check that the workflow has `pull-requests: write` permission
- Verify the `cloudflare-deploy` step completed successfully
- Check the Actions logs for any errors in the comment step

## Security Best Practices

1. **Never commit secrets to your repository**
2. **Regularly rotate API tokens** (recommended: every 90 days)
3. **Use minimal permissions** - only grant what's needed
4. **Monitor token usage** in Cloudflare dashboard
5. **Revoke tokens immediately** if compromised

## Additional Notes

- The `GITHUB_TOKEN` is automatically provided by GitHub Actions and doesn't need to be configured
- If you change the Cloudflare project name, update it in both workflow files:
  - `.github/workflows/pr-preview.yml`
  - `.github/workflows/production-deploy.yml`



