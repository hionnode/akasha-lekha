# Frontmatter and Metadata — AWS From Zero to Production

## Frontmatter Template

Every post uses this exact YAML frontmatter structure:

```yaml
---
title: "{Topic}: {Subtitle}"
description: "{SEO meta description, 150-160 chars, includes primary keyword}"
excerpt: "{Subtitle expanded. 1-2 sentences for blog listing cards.}"
date: "YYYY-MM-DD"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", ...service-specific, ...topic-specific]
series: "AWS From Zero to Production"
seriesPart: N
featured: false
draft: true
---
```

### Field Rules

| Field | Required | Rules |
|---|---|---|
| `title` | Yes | Format: `"{Topic}: {Subtitle}"`. 5-10 words for topic, subtitle is punchy angle. |
| `description` | Yes | 150-160 characters. Starts with verb or "Learn". Includes primary keyword (usually the AWS service name). For SEO meta tag. |
| `excerpt` | Yes | The subtitle text, optionally expanded to 1-2 sentences. Shown on blog listing cards. |
| `date` | Yes | ISO format `YYYY-MM-DD`. See scheduling section below. |
| `author` | Yes | Always `"works-on-my.cloud"` |
| `tags` | Yes | Array. See tag taxonomy below. Minimum 3, maximum 7. |
| `series` | Yes | Always exactly `"AWS From Zero to Production"` |
| `seriesPart` | Yes | Integer 1-70. `seriesTotal` is auto-calculated from folder contents. |
| `featured` | No | Default `false`. Set `true` for KEY parts (9, 19, 34, 43, 62). |
| `draft` | No | Default `true` during development. Set `false` when published. |

## Tag Taxonomy

### Required Tags (every post)

Every AWS series post includes these three tags:
- `aws` — Series identifier
- `devops` — Primary category
- `startup` — Target audience

### Service-Specific Tags

Use the AWS service name in lowercase, hyphenated:

| AWS Service | Tag |
|---|---|
| IAM | `iam` |
| S3 | `s3` |
| CloudFront | `cloudfront` |
| Route 53 | `route53` |
| ACM | `acm` |
| VPC | `vpc` |
| ALB | `alb` |
| EC2 | `ec2` |
| ECS | `ecs` |
| ECR | `ecr` |
| Lambda | `lambda` |
| API Gateway | `api-gateway` |
| RDS | `rds` |
| ElastiCache | `elasticache` |
| SQS | `sqs` |
| SNS | `sns` |
| EventBridge | `eventbridge` |
| SES | `ses` |
| Secrets Manager | `secrets-manager` |
| CloudTrail | `cloudtrail` |
| Security Hub | `security-hub` |
| GuardDuty | `guardduty` |
| WAF | `waf` |
| AppConfig | `appconfig` |

### Topic Tags

| Topic | Tag | Used in Parts |
|---|---|---|
| Security | `security` | 1, 2, 12, 20, 21, 62, 65, 66 |
| Terraform/IaC | `terraform` | 4, 13-22, 28, 35, 39-42, 48-51 |
| Infrastructure as Code | `iac` | 4, and any part with significant Terraform |
| AI/Agents | `ai-agents` | 3, 9, 19, 27, 34, 43, 47, 59, 62 |
| Observability | `observability` | 5, 29, 58-61 |
| OpenTelemetry | `opentelemetry` | 29, 58, 60 |
| Docker/Containers | `docker` | 10, 39-44 |
| CI/CD | `ci-cd` | 8, 27, 45-47 |
| Testing | `testing` | 25-27, 34, 44, 53 |
| Networking | `networking` | 20-22 |
| Database | `database` | 11, 35-38 |
| Serverless | `serverless` | 48-53 |
| Frontend | `frontend` | 13-19 |
| Backend | `backend` | 28-33 |
| Authentication | `authentication` | 30 |
| Git/GitHub | `git` | 6-8 |
| Cost Management | `cost` | 64 |
| Incident Response | `incident-response` | 59, 59B, 63 |
| MCP | `mcp` | 9, 19, 27, 43, 59, 62 |
| Model Evaluation | `model-eval` | 4, 9, 19, 27, 43, 62 |

### Tag Examples by Part

| Part | Tags |
|---|---|
| 1 | `["aws", "devops", "startup", "security", "iam", "cloudtrail"]` |
| 4 | `["aws", "devops", "startup", "terraform", "iac", "model-eval"]` |
| 9 | `["aws", "devops", "startup", "ai-agents", "model-eval", "mcp"]` |
| 20 | `["aws", "devops", "startup", "vpc", "networking", "terraform"]` |
| 43 | `["aws", "devops", "startup", "ecs", "ai-agents", "mcp", "docker"]` |

## File Naming

### Convention

```
apps/web/src/content/blog/aws-for-startups/{NN}-{kebab-case-slug}.mdx
```

- `NN` — Zero-padded two-digit part number (01-70)
- `kebab-case-slug` — Lowercase, hyphenated, descriptive
- Part 59B uses filename `59b-debugging-decision-tree.mdx`

### Complete File List

| Part | Filename |
|:--:|---|
| 1 | `01-your-first-60-minutes-in-aws.mdx` |
| 2 | `02-iam-key-to-everything.mdx` |
| 3 | `03-local-setup-agents.mdx` |
| 4 | `04-terraform-fundamentals.mdx` |
| 5 | `05-observability-setup.mdx` |
| 6 | `06-git-github-agents.mdx` |
| 7 | `07-branch-protection-pr.mdx` |
| 8 | `08-pre-commit-code-quality.mdx` |
| 9 | `09-monorepo-context-evals.mdx` |
| 10 | `10-docker-compose-local.mdx` |
| 11 | `11-database-migrations.mdx` |
| 12 | `12-env-vars-secrets-security.mdx` |
| 13 | `13-s3-static-hosting.mdx` |
| 14 | `14-route53-acm-dns.mdx` |
| 15 | `15-cloudfront-cdn.mdx` |
| 16 | `16-user-uploads-s3.mdx` |
| 17 | `17-frontend-react-astro.mdx` |
| 18 | `18-frontend-svelte-solid.mdx` |
| 19 | `19-preview-environments.mdx` |
| 20 | `20-vpc-fundamentals.mdx` |
| 21 | `21-security-groups.mdx` |
| 22 | `22-alb-load-balancer.mdx` |
| 23 | `23-api-design-rest.mdx` |
| 24 | `24-request-validation-openapi.mdx` |
| 25 | `25-mocking-external-services.mdx` |
| 26 | `26-e2e-testing-playwright.mdx` |
| 27 | `27-testing-in-ci.mdx` |
| 28 | `28-ec2-compute-fundamentals.mdx` |
| 29 | `29-backend-bun-signoz.mdx` |
| 30 | `30-authentication-clerk.mdx` |
| 31 | `31-backend-python-fastapi.mdx` |
| 32 | `32-backend-go-api.mdx` |
| 33 | `33-auto-scaling-groups.mdx` |
| 34 | `34-k6-human-judgment.mdx` |
| 35 | `35-rds-postgres.mdx` |
| 36 | `36-database-operations.mdx` |
| 37 | `37-secrets-manager.mdx` |
| 38 | `38-elasticache-redis.mdx` |
| 39 | `39-docker-production.mdx` |
| 40 | `40-ecr-container-registry.mdx` |
| 41 | `41-ecs-fargate-bun.mdx` |
| 42 | `42-ecs-fargate-python-go.mdx` |
| 43 | `43-full-stack-preview.mdx` |
| 44 | `44-k6-containers.mdx` |
| 45 | `45-github-actions-ci.mdx` |
| 46 | `46-github-actions-oidc.mdx` |
| 47 | `47-production-deployment.mdx` |
| 48 | `48-lambda-fundamentals.mdx` |
| 49 | `49-lambda-bun.mdx` |
| 50 | `50-api-gateway.mdx` |
| 51 | `51-api-gateway-python-go.mdx` |
| 52 | `52-serverless-patterns.mdx` |
| 53 | `53-k6-serverless.mdx` |
| 54 | `54-sqs-queues.mdx` |
| 55 | `55-sns-eventbridge.mdx` |
| 56 | `56-websockets.mdx` |
| 57 | `57-ses-email.mdx` |
| 58 | `58-event-driven-patterns.mdx` |
| 59 | `59-debugging-production.mdx` |
| 59B | `59b-debugging-decision-tree.mdx` |
| 60 | `60-opentelemetry-mastery.mdx` |
| 61 | `61-signoz-dashboards-alerts.mdx` |
| 62 | `62-feature-flags-guardrails.mdx` |
| 63 | `63-incident-response.mdx` |
| 64 | `64-cost-management.mdx` |
| 65 | `65-security-posture.mdx` |
| 66 | `66-compliance-basics.mdx` |
| 67 | `67-capstone-architecture.mdx` |
| 68 | `68-capstone-deployment.mdx` |
| 69 | `69-capstone-operations.mdx` |
| 70 | `70-capstone-review-graduation.mdx` |

## Date Scheduling

- Series starts: **2026-01-08** (Part 1)
- Cadence: approximately **3-4 days apart**
- Schedule is approximate — actual dates set when posts are ready

### Approximate Schedule

| Part | Approximate Date | Notes |
|:--:|---|---|
| 1 | 2026-01-08 | Series launch |
| 2 | 2026-01-12 | |
| 3 | 2026-01-16 | |
| 4 | 2026-01-20 | |
| 5 | 2026-01-24 | |
| 6 | 2026-01-28 | Phase 2 start |
| 7 | 2026-02-01 | |
| 8 | 2026-02-04 | |
| 9 | 2026-02-08 | KEY part — may need extra day |
| 10 | 2026-02-12 | Phase 3 start |
| 11 | 2026-02-16 | |
| 12 | 2026-02-20 | |
| 13-19 | 2026-02-24 to 2026-03-20 | Phase 4, ~3.5 days apart |
| 20-22 | 2026-03-24 to 2026-04-01 | Phase 5 |
| 23-27 | 2026-04-04 to 2026-04-18 | Phase 6 |
| 28-33 | 2026-04-22 to 2026-05-12 | Phase 7 |
| 34 | 2026-05-16 | KEY part |
| 35-38 | 2026-05-20 to 2026-06-01 | Phase 9 |
| 39-44 | 2026-06-04 to 2026-06-24 | Phase 10 |
| 45-47 | 2026-06-28 to 2026-07-06 | Phase 11 |
| 48-53 | 2026-07-10 to 2026-07-30 | Phase 12 |
| 54-57 | 2026-08-02 to 2026-08-14 | Phase 13 |
| 58-59B | 2026-08-18 to 2026-09-01 | Phase 14 |
| 60-61 | 2026-09-04 to 2026-09-08 | Phase 15 |
| 62-66 | 2026-09-12 to 2026-09-28 | Phase 16 |
| 67-70 | 2026-10-02 to 2026-10-14 | Phase 17, series finale |

## SEO Guidelines

### Title Tag
- Same as frontmatter `title`
- Should include primary keyword (AWS service or concept name)

### Meta Description
- Frontmatter `description` field
- 150-160 characters
- Starts with action verb or "Learn"
- Includes primary keyword naturally
- Mentions a concrete outcome

### URL Structure
- All posts at `/blog/aws-for-startups/{NN}-{slug}`
- Clean, descriptive slugs
- No dates in URLs (the folder provides series context)

### Heading Structure
- H1: Post title (automatic from frontmatter)
- H2: Major sections (Why This Matters, each content section, The Fine Line, Validation Checklist, Key Takeaways)
- H3: Subsections within content
- Never skip heading levels

## Featured and Draft Conventions

| Convention | Value | When |
|---|---|---|
| `featured: true` | KEY parts only | Parts 9, 19, 34, 43, 62 |
| `featured: false` | All other parts | Default |
| `draft: true` | During development | Until post is ready for publication |
| `draft: false` | Published | Set when deploying |
