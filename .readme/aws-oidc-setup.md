# AWS OIDC Setup for GitHub Actions

This guide explains how to set up OIDC (OpenID Connect) authentication between GitHub Actions and AWS. OIDC eliminates the need for long-lived AWS credentials stored in GitHub secrets.

## Benefits of OIDC

| Traditional (Access Keys) | OIDC |
|---------------------------|------|
| Long-lived credentials | Short-lived tokens (15 min - 1 hour) |
| Stored in GitHub secrets | No secrets to manage |
| Must be rotated manually | Automatic token refresh |
| Risk of credential leakage | No credentials to leak |
| Hard to audit | Full CloudTrail audit trail |

## Setup Steps

### 1. Create OIDC Identity Provider in AWS

**Via AWS Console:**

1. Go to **IAM** → **Identity providers** → **Add provider**
2. Configure:
   - Provider type: **OpenID Connect**
   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
3. Click **Add provider**

**Via AWS CLI:**

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

**Via Terraform:**

```hcl
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}
```

### 2. Create IAM Role for GitHub Actions

**Via AWS Console:**

1. Go to **IAM** → **Roles** → **Create role**
2. Select **Web identity**
3. Configure:
   - Identity provider: `token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
4. Add condition to restrict to your repository:
   - Key: `token.actions.githubusercontent.com:sub`
   - Condition: `StringLike`
   - Value: `repo:YOUR_ORG/YOUR_REPO:*`
5. Attach policies (see below)
6. Name the role: `github-actions-akasha-labs`

**Via Terraform:**

```hcl
data "aws_iam_policy_document" "github_actions_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [
        "repo:hionnode/akasha-lekha:*"
      ]
    }
  }
}

resource "aws_iam_role" "github_actions" {
  name               = "github-actions-akasha-labs"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role.json
}
```

### 3. Attach Required Permissions

The role needs permissions for SST to deploy. Create a policy with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SST",
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "s3:*",
        "iam:*",
        "lambda:*",
        "apigateway:*",
        "dynamodb:*",
        "logs:*",
        "ssm:*",
        "sts:AssumeRole",
        "secretsmanager:*"
      ],
      "Resource": "*"
    }
  ]
}
```

> **Note:** This is a broad policy for SST. For production, consider restricting resources to specific ARN patterns.

**More restrictive policy (recommended):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudFormation",
      "Effect": "Allow",
      "Action": ["cloudformation:*"],
      "Resource": "arn:aws:cloudformation:ap-south-1:*:stack/akasha-labs-*/*"
    },
    {
      "Sid": "S3",
      "Effect": "Allow",
      "Action": ["s3:*"],
      "Resource": [
        "arn:aws:s3:::akasha-labs-*",
        "arn:aws:s3:::akasha-labs-*/*"
      ]
    },
    {
      "Sid": "Lambda",
      "Effect": "Allow",
      "Action": ["lambda:*"],
      "Resource": "arn:aws:lambda:ap-south-1:*:function:akasha-labs-*"
    },
    {
      "Sid": "APIGateway",
      "Effect": "Allow",
      "Action": ["apigateway:*"],
      "Resource": "arn:aws:apigateway:ap-south-1::*"
    },
    {
      "Sid": "DynamoDB",
      "Effect": "Allow",
      "Action": ["dynamodb:*"],
      "Resource": "arn:aws:dynamodb:ap-south-1:*:table/akasha-labs-*"
    },
    {
      "Sid": "IAM",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRole",
        "iam:PassRole",
        "iam:TagRole",
        "iam:UntagRole"
      ],
      "Resource": "arn:aws:iam::*:role/akasha-labs-*"
    },
    {
      "Sid": "Logs",
      "Effect": "Allow",
      "Action": ["logs:*"],
      "Resource": "arn:aws:logs:ap-south-1:*:log-group:/aws/lambda/akasha-labs-*"
    },
    {
      "Sid": "SSM",
      "Effect": "Allow",
      "Action": ["ssm:*"],
      "Resource": "arn:aws:ssm:ap-south-1:*:parameter/sst/*"
    }
  ]
}
```

### 4. Add Role ARN to GitHub Secrets

1. Copy the role ARN: `arn:aws:iam::ACCOUNT_ID:role/github-actions-akasha-labs`
2. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
3. Add secret:
   - Name: `AWS_ROLE_ARN`
   - Value: `arn:aws:iam::ACCOUNT_ID:role/github-actions-akasha-labs`

### 5. Verify Setup

The workflow uses OIDC like this:

```yaml
permissions:
  id-token: write  # Required for OIDC

steps:
  - name: Configure AWS Credentials (OIDC)
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
      role-session-name: github-actions-${{ github.run_id }}
      aws-region: ap-south-1
```

## Restricting Access

### By Branch

Only allow deployments from `main`:

```json
{
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:sub": "repo:hionnode/akasha-lekha:ref:refs/heads/main"
    }
  }
}
```

### By Environment

Only allow from specific GitHub environment:

```json
{
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:sub": "repo:hionnode/akasha-lekha:environment:production"
    }
  }
}
```

### By Pull Request

Allow PR deployments to preview:

```json
{
  "Condition": {
    "StringLike": {
      "token.actions.githubusercontent.com:sub": [
        "repo:hionnode/akasha-lekha:ref:refs/heads/main",
        "repo:hionnode/akasha-lekha:pull_request"
      ]
    }
  }
}
```

## Troubleshooting

### "Not authorized to perform sts:AssumeRoleWithWebIdentity"

1. Check the OIDC provider is created correctly
2. Verify the trust policy has correct repository name
3. Ensure `id-token: write` permission is set in workflow

### "Token is expired"

OIDC tokens are short-lived. If your deployment takes longer than the token lifetime:

```yaml
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
    role-duration-seconds: 3600  # 1 hour (max depends on role config)
```

### Debugging

Add this step to debug OIDC claims:

```yaml
- name: Debug OIDC
  run: |
    echo "GitHub Actor: ${{ github.actor }}"
    echo "GitHub Ref: ${{ github.ref }}"
    echo "GitHub Event: ${{ github.event_name }}"
    echo "Repository: ${{ github.repository }}"
```

## CloudTrail Audit

All OIDC authentications are logged in CloudTrail:

```json
{
  "eventName": "AssumeRoleWithWebIdentity",
  "userIdentity": {
    "type": "WebIdentityUser",
    "userName": "repo:hionnode/akasha-lekha:ref:refs/heads/main"
  }
}
```

## References

- [GitHub: Configuring OIDC in AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [AWS: Creating OIDC Identity Providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials)
