# Component Playbook — AWS From Zero to Production

Reference for all components available when writing the 70-part AWS blog series. Blog posts are MDX files in `apps/web/src/content/blog/aws-for-startups/`. Components live in `apps/web/src/components/shared/`.

---

## Standard Import Block

Every AWS series post should start with the relevant subset of this import block immediately after the frontmatter:

```mdx
import GuideStep from '../../../components/shared/GuideStep.astro';
import Command from '../../../components/shared/Command.astro';
import CommandSequence from '../../../components/shared/CommandSequence.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import FileTree from '../../../components/shared/FileTree.astro';
import EnvVars from '../../../components/shared/EnvVars.astro';
import EnvVar from '../../../components/shared/EnvVar.astro';
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
import CodeSwitcher from '../../../components/shared/CodeSwitcher.astro';
import DiffViewer from '../../../components/shared/DiffViewer.astro';
import DiffBlock from '../../../components/shared/DiffBlock.astro';
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
import ComparisonHeader from '../../../components/shared/ComparisonHeader.astro';
import ComparisonRow from '../../../components/shared/ComparisonRow.astro';
import ResourceStatus from '../../../components/shared/ResourceStatus.astro';
import ApiEndpoint from '../../../components/shared/ApiEndpoint.astro';
import ResponseExample from '../../../components/shared/ResponseExample.astro';
import ServiceMapping from '../../../components/shared/ServiceMapping.astro';
import Service from '../../../components/shared/Service.astro';
```

**Only import components actually used in the post. Never import unused components.**

---

## Component Reference

### Quick Reference Table

| Content Need | Component | Import Required? | Notes |
|---|---|---|---|
| Architecture diagrams | `<Alert type="important">` + ASCII art | Yes | Wrap ASCII in code block inside Alert |
| The Fine Line box | `<Alert type="warning">` | Yes | Standard format, see CONTENT-PATTERNS.md |
| Agent Trap callout | `<Alert type="caution">` | Yes | Use title prop with agent trap prefix |
| Important warnings | `<Alert type="important">` | Yes | Critical information |
| Tips/suggestions | `:::tip` | No (remark plugin) | Inline directive, no import needed |
| Notes | `:::note` | No (remark plugin) | Inline directive |
| Info blocks | `:::info` | No (remark plugin) | Additional context |
| Warnings (inline) | `:::warning` | No (remark plugin) | Inline directive |
| Caution (inline) | `:::caution` | No (remark plugin) | Inline directive |
| Numbered steps (inline) | `:::steps` | No (remark plugin) | Wrap numbered list |
| Package manager tabs | `:::package-manager` | No (remark plugin) | npm/pnpm/yarn tabs |
| Code file headers | `` ```lang title="file.ts" `` | No (remark plugin) | Shows filename in code block |
| Terminal styling | `` ```bash terminal `` | No (remark plugin) | macOS terminal chrome |
| Procedural steps | `<GuideStep>` | Yes | With syncKey for tracking |
| Single command | `<Command>` | Yes | Copy-to-clipboard |
| Multi-step commands | `<CommandSequence>` | Yes | Sequential commands |
| Terminal output | `<TerminalOutput>` | Yes | Shows expected output |
| OS/tool variations | `<PanelSwitcher>` + `<Panel>` | Yes | Tabs for macOS/Linux/Windows |
| File structures | `<FileTree>` | Yes | Directory tree visualization |
| Environment vars | `<EnvVars>` + `<EnvVar>` | Yes | .env file display |
| End-of-post checklist | `<ValidationChecklist>` | Yes | Categories + items w/ syncKeys |
| Feature comparisons | `<ComparisonTable>` | Yes | Side-by-side comparison |
| Code alternatives | `:::code-switcher` or `<CodeSwitcher>` | Depends | Remark plugin or component |
| Before/after code | `<DiffViewer>` + `<DiffBlock>` | Yes | Diff visualization |
| AWS resource states | `<ResourceStatus>` | Yes | Resource status indicator |
| API documentation | `<ApiEndpoint>` + `<ResponseExample>` | Yes | Phase 6+ only |
| Service relationships | `<ServiceMapping>` + `<Service>` | Yes | Service dependency visualization |

---

### Detailed Usage Examples

---

#### 1. Alert

**Props:** `type` (`'note' | 'tip' | 'important' | 'warning' | 'caution'`, default `'note'`), `title` (optional string override)

**Architecture diagram inside Alert:**

```mdx
<Alert type="important" title="VPC Architecture">

```
┌─────────────────────────────────────────────────────────────┐
│                        VPC (10.0.0.0/16)                    │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │   Public Subnet      │  │   Public Subnet      │         │
│  │   10.0.1.0/24        │  │   10.0.2.0/24        │         │
│  │   ┌──────────┐       │  │   ┌──────────┐       │         │
│  │   │   NAT GW │       │  │   │   ALB    │       │         │
│  │   └──────────┘       │  │   └──────────┘       │         │
│  └──────────────────────┘  └──────────────────────┘         │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │   Private Subnet     │  │   Private Subnet     │         │
│  │   10.0.3.0/24        │  │   10.0.4.0/24        │         │
│  │   ┌──────────┐       │  │   ┌──────────┐       │         │
│  │   │   EC2    │       │  │   │   EC2    │       │         │
│  │   └──────────┘       │  │   └──────────┘       │         │
│  └──────────────────────┘  └──────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

</Alert>
```

**The Fine Line box:**

```mdx
<Alert type="warning" title="The Fine Line">

**Production approach:** Use Terraform modules for VPC creation with standardized CIDR blocks and tagging.

**Learning approach:** We create the VPC manually first so you understand every subnet, route table, and NAT gateway before abstracting it away.

**Why it matters:** When your NAT gateway fails at 2 AM, you need to know what it does, not just that Terraform created it.

</Alert>
```

**Agent Trap callout:**

```mdx
<Alert type="caution" title="Agent Trap">

AI coding assistants will suggest using `aws configure` with long-lived access keys. This is the single biggest security mistake in AWS.

**What agents suggest:** Hardcoded `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in your shell profile.

**What you should do:** Use `aws sso configure` with IAM Identity Center. Short-lived credentials, automatic rotation, no secrets to leak.

</Alert>
```

**Important warning:**

```mdx
<Alert type="important" title="Cost Alert">

NAT Gateways cost $0.045/hour ($32.40/month) per AZ plus $0.045/GB of data processed. For development environments, consider a NAT instance (t3.nano at ~$3.80/month) or VPC endpoints for specific AWS services.

</Alert>
```

---

#### 2. GuideStep

**Props:** `title` (required string), `number` (optional number), `variant` (`'default' | 'compact'`, default `'default'`), `defaultExpanded` (optional boolean), `syncKey` (optional string, links to ValidationChecklist items)

```mdx
<GuideStep title="Create the VPC" number={1} syncKey="create-vpc">

Run the following command to create your VPC with DNS support enabled:

```bash terminal
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=prod-vpc},{Key=Environment,Value=production}]'
```

Note the `VpcId` in the output. You will need it for the next step.

</GuideStep>

<GuideStep title="Enable DNS Hostnames" number={2} syncKey="enable-dns">

By default, DNS hostnames are disabled. Enable them so EC2 instances get public DNS names:

<Command cmd="aws ec2 modify-vpc-attribute --vpc-id vpc-0abc123 --enable-dns-hostnames" description="Enable DNS hostnames on the VPC" />

</GuideStep>
```

---

#### 3. Command

**Props:** `cmd` (required string), `description` (optional string), `copyable` (boolean, default `true`)

```mdx
<Command
  cmd="aws sts get-caller-identity"
  description="Verify your AWS credentials are configured correctly"
/>
```

```mdx
<Command
  cmd="terraform init -backend-config=backend.hcl"
  description="Initialize Terraform with remote state backend"
/>
```

---

#### 4. CommandSequence

**Props:** `class` (optional string)

Wraps multiple `<Command>` elements into a visual sequence:

```mdx
<CommandSequence>
  <Command cmd="cd ~/projects/aws-infra" description="Navigate to your infrastructure directory" />
  <Command cmd="terraform init" description="Initialize the Terraform working directory" />
  <Command cmd="terraform plan -out=tfplan" description="Preview the changes Terraform will make" />
  <Command cmd="terraform apply tfplan" description="Apply the planned changes" />
</CommandSequence>
```

---

#### 5. TerminalOutput

**Props:** `title` (optional string), `searchable` (optional boolean, default `false`), `class` (optional string)

Shows expected command output with macOS terminal chrome, optional search, and copy button:

```mdx
<TerminalOutput title="aws sts get-caller-identity">

```json
{
    "UserId": "AIDACKCEVSQ6C2EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/dev-user"
}
```

</TerminalOutput>
```

```mdx
<TerminalOutput title="terraform plan" searchable>

```
Terraform will perform the following actions:

  # aws_vpc.main will be created
  + resource "aws_vpc" "main" {
      + arn                              = (known after apply)
      + cidr_block                       = "10.0.0.0/16"
      + enable_dns_hostnames             = true
      + enable_dns_support               = true
      + id                               = (known after apply)
      + tags                             = {
          + "Environment" = "production"
          + "Name"        = "prod-vpc"
        }
    }

Plan: 1 to add, 0 to change, 0 to destroy.
```

</TerminalOutput>
```

---

#### 6. PanelSwitcher + Panel

**PanelSwitcher props:** `defaultActive` (optional string), `class` (optional string)
**Panel props:** `label` (required string), `value` (optional string, defaults to lowercase label)

```mdx
<PanelSwitcher defaultActive="macos">
  <Panel label="macOS" value="macos">

    ```bash terminal
    brew install awscli
    ```

    Verify installation:

    <Command cmd="aws --version" />

  </Panel>
  <Panel label="Linux" value="linux">

    ```bash terminal
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    ```

    Verify installation:

    <Command cmd="aws --version" />

  </Panel>
  <Panel label="Windows" value="windows">

    Download and run the MSI installer from the [AWS CLI page](https://aws.amazon.com/cli/).

    Or use winget:

    ```powershell
    winget install Amazon.AWSCLI
    ```

    Verify installation:

    <Command cmd="aws --version" />

  </Panel>
</PanelSwitcher>
```

---

#### 7. FileTree

**Props:** `collapsible` (boolean, default `true`), `defaultExpanded` (boolean, default `true`), `class` (optional string)

Provide plain-text tree structure as slot content. Directories are detected by trailing `/` or by not having a file extension. Indentation uses 2 or 4 spaces:

```mdx
<FileTree>
infra/
  modules/
    vpc/
      main.tf
      variables.tf
      outputs.tf
    ec2/
      main.tf
      variables.tf
      outputs.tf
      userdata.sh
  environments/
    dev/
      main.tf
      terraform.tfvars
      backend.hcl
    prod/
      main.tf
      terraform.tfvars
      backend.hcl
  provider.tf
  versions.tf
</FileTree>
```

---

#### 8. EnvVars + EnvVar

**EnvVars props:** `class` (optional string)
**EnvVar props:** `name` (required string), `required` (boolean, default `false`), `description` (optional string), `default` (optional string), `type` (`'string' | 'number' | 'boolean'`, default `'string'`)

```mdx
<EnvVars>
  <EnvVar
    name="AWS_PROFILE"
    required
    description="The named profile to use for AWS CLI commands. Set this instead of exporting access keys."
    default="default"
  />
  <EnvVar
    name="AWS_DEFAULT_REGION"
    required
    description="The AWS region for resource creation. Use the region closest to your users."
    default="ap-south-1"
  />
  <EnvVar
    name="TF_VAR_environment"
    description="Terraform variable for the deployment environment name."
    default="dev"
  />
  <EnvVar
    name="TF_LOG"
    description="Terraform log verbosity. Set to TRACE for debugging provider issues."
    type="string"
  />
</EnvVars>
```

---

#### 9. ValidationChecklist

**Props:** `items` (required array of `{ category: string; tasks: (string | { text: string; syncKey?: string })[] }[]`)

Items with `syncKey` automatically sync with `<GuideStep syncKey="...">` checkboxes via localStorage. The checklist shows a progress bar at the bottom.

```mdx
<ValidationChecklist items={[
  {
    category: "Security",
    tasks: [
      { text: "IAM user has MFA enabled", syncKey: "enable-mfa" },
      { text: "Root account has MFA enabled", syncKey: "root-mfa" },
      { text: "No long-lived access keys in shell profile", syncKey: "no-access-keys" },
      "AWS SSO configured with Identity Center"
    ]
  },
  {
    category: "Networking",
    tasks: [
      { text: "VPC created with /16 CIDR block", syncKey: "create-vpc" },
      { text: "DNS hostnames enabled", syncKey: "enable-dns" },
      { text: "Public and private subnets in 2 AZs", syncKey: "create-subnets" },
      "Internet Gateway attached and route table configured"
    ]
  },
  {
    category: "Monitoring",
    tasks: [
      "CloudTrail enabled for API auditing",
      "Billing alerts configured",
      "AWS Config enabled for resource tracking"
    ]
  }
]} />
```

---

#### 10. ComparisonTable + ComparisonHeader + ComparisonRow

**ComparisonTable props:** `class` (optional string) -- wraps the table
**ComparisonHeader props:** `columns` (required string array) -- defines column headers (first column is auto-generated as the feature/label column)
**ComparisonRow props:** `feature` (required string) + dynamic key-value pairs matching column names. Values containing "best" or "fastest" (case-insensitive) get highlighted styling.

```mdx
<ComparisonTable>
  <ComparisonHeader columns={["EC2", "ECS Fargate", "Lambda"]} />
  <ComparisonRow feature="Startup time" EC2="Minutes" ECS_Fargate="30-60 seconds" Lambda="<100ms (Best)" />
  <ComparisonRow feature="Max runtime" EC2="Unlimited" ECS_Fargate="Unlimited" Lambda="15 minutes" />
  <ComparisonRow feature="Scaling" EC2="ASG (minutes)" ECS_Fargate="Service scaling (seconds)" Lambda="Instant (Best)" />
  <ComparisonRow feature="Min cost/month" EC2="~$3.80 (t3.nano)" ECS_Fargate="~$9.40 (0.25 vCPU)" Lambda="Free tier (Best)" />
  <ComparisonRow feature="Control" EC2="Full OS access (Best)" ECS_Fargate="Container-level" Lambda="Function-level" />
  <ComparisonRow feature="Best for" EC2="Legacy apps, GPU" ECS_Fargate="Microservices" Lambda="Event-driven, APIs" />
</ComparisonTable>
```

---

#### 11. DiffViewer + DiffBlock

**DiffViewer props:** `mode` (`'unified' | 'split'`, default `'unified'`), `class` (optional string)
**DiffBlock props:** `type` (`'added' | 'removed' | 'context'`, required)

```mdx
<DiffViewer>
  <DiffBlock type="removed">

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

  </DiffBlock>
  <DiffBlock type="added">

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  metadata_options {
    http_tokens = "required"  # IMDSv2 only
  }

  tags = {
    Name        = "web-server"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
```

  </DiffBlock>
</DiffViewer>
```

Split mode (side-by-side):

```mdx
<DiffViewer mode="split">
  <DiffBlock type="removed">

```hcl
# Before: open security group
ingress {
  from_port   = 0
  to_port     = 0
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}
```

  </DiffBlock>
  <DiffBlock type="added">

```hcl
# After: least-privilege security group
ingress {
  from_port   = 443
  to_port     = 443
  protocol    = "tcp"
  cidr_blocks = ["10.0.0.0/16"]
}
```

  </DiffBlock>
</DiffViewer>
```

---

#### 12. ResourceStatus

**Props:** `name` (required string), `status` (required: `'Running' | 'Pending' | 'Error' | 'Failed' | 'Succeeded' | 'CrashLoopBackOff' | 'Unknown'`), `ready` (optional string), `namespace` (optional string), `kind` (optional string), `class` (optional string)

Use for showing the state of AWS resources after provisioning:

```mdx
<ResourceStatus name="prod-vpc" status="Running" kind="VPC" ready="available" />
<ResourceStatus name="web-server-1" status="Running" kind="EC2" ready="2/2 checks" />
<ResourceStatus name="api-lambda" status="Succeeded" kind="Lambda" />
<ResourceStatus name="rds-primary" status="Pending" kind="RDS" ready="creating" />
<ResourceStatus name="failed-deploy" status="Failed" kind="CloudFormation" />
```

---

#### 13. ApiEndpoint + ResponseExample

**ApiEndpoint props:** `method` (required: `'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'`), `path` (required string), `description` (optional string), `class` (optional string)
**ResponseExample props:** `title` (optional string)

```mdx
<ApiEndpoint method="GET" path="/api/v1/health" description="Health check endpoint. Returns service status and dependency health.">

  **Headers:**
  - `Authorization: Bearer <token>` (optional for health check)

  <ResponseExample title="200 OK">

```json
{
  "status": "healthy",
  "version": "1.2.0",
  "uptime": "3d 14h 22m",
  "dependencies": {
    "database": "connected",
    "cache": "connected",
    "queue": "connected"
  }
}
```

  </ResponseExample>

  <ResponseExample title="503 Service Unavailable">

```json
{
  "status": "degraded",
  "version": "1.2.0",
  "dependencies": {
    "database": "connected",
    "cache": "timeout",
    "queue": "connected"
  }
}
```

  </ResponseExample>

</ApiEndpoint>

<ApiEndpoint method="POST" path="/api/v1/users" description="Create a new user account.">

  **Request Body:**

```json
{
  "email": "dev@example.com",
  "name": "Developer",
  "role": "admin"
}
```

  <ResponseExample title="201 Created">

```json
{
  "id": "usr_abc123",
  "email": "dev@example.com",
  "name": "Developer",
  "role": "admin",
  "createdAt": "2026-01-15T10:30:00Z"
}
```

  </ResponseExample>

</ApiEndpoint>
```

---

#### 14. ServiceMapping + Service

**ServiceMapping props:** `class` (optional string) -- wrapper component
**Service props:** `name` (required string), `port` (required number), `targetPort` (required number), `protocol` (optional `'TCP' | 'UDP'`, default `'TCP'`), `namespace` (optional string)

Use for documenting service port mappings and dependencies:

```mdx
<ServiceMapping>
  <Service name="api-gateway" port={443} targetPort={8080} protocol="TCP" />
  <Service name="web-app" port={80} targetPort={3000} protocol="TCP" />
  <Service name="postgres-primary" port={5432} targetPort={5432} protocol="TCP" />
  <Service name="redis-cache" port={6379} targetPort={6379} protocol="TCP" />
</ServiceMapping>
```

---

#### 15. Remark Directives (No Import Needed)

These are processed by remark plugins and need no import statement. Use them directly in MDX content.

**Callout directives:**

```mdx
:::tip
Use `aws configure list` to verify which profile and region are currently active before running any infrastructure commands.
:::

:::note
All AWS resources created in this guide use the `ap-south-1` (Mumbai) region. Adjust region-specific AMI IDs if you choose a different region.
:::

:::info
AWS Free Tier includes 750 hours of t2.micro (or t3.micro in regions where t2 is unavailable) per month for the first 12 months. This is enough to run one instance 24/7.
:::

:::warning
Elastic IPs are free while attached to a running instance but cost $0.005/hour when unattached. Always release EIPs you are not using.
:::

:::caution
Deleting a VPC will not delete its associated resources (EC2 instances, RDS, etc.). You must terminate all resources inside the VPC first, or the deletion will fail.
:::
```

**Steps directive:**

```mdx
:::steps
1. Create the S3 bucket for Terraform state
2. Create the DynamoDB table for state locking
3. Configure the backend block in `provider.tf`
4. Run `terraform init` to migrate local state
5. Verify state file exists in S3
:::
```

**Package manager directive:**

````mdx
:::package-manager
```bash npm
npm install -g aws-cdk
```

```bash pnpm
pnpm add -g aws-cdk
```

```bash yarn
yarn global add aws-cdk
```
:::
````

**Code switcher directive (remark plugin version, no import):**

````mdx
:::code-switcher
```hcl title="Terraform"
resource "aws_s3_bucket" "assets" {
  bucket = "my-app-assets"
}
```

```yaml title="CloudFormation"
Resources:
  AssetsBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-app-assets
```

```typescript title="CDK"
const bucket = new s3.Bucket(this, 'Assets', {
  bucketName: 'my-app-assets',
});
```
:::
````

**Code block with file title:**

````mdx
```hcl title="infra/modules/vpc/main.tf"
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(var.common_tags, {
    Name = "${var.project}-${var.environment}-vpc"
  })
}
```
````

**Terminal code block:**

````mdx
```bash terminal
terraform apply -auto-approve
```
````

---

## Components NOT to Use in This Series

| Component | Reason |
|---|---|
| `K8sManifest` | Kubernetes series only. Not relevant to the AWS series. |
| `VimShortcuts` | Not relevant to AWS infrastructure content. |
| `AwsRegionLatency` | Only used in Part 1 (already included). Do not use in subsequent parts. |
| `Ingress` | Kubernetes-specific networking component. Use AWS ALB/NLB content instead. |

---

## Component Selection Decision Tree

```
Need to show...
|
+-- A warning about agent behavior?
|   --> <Alert type="caution" title="Agent Trap">
|
+-- Architecture?
|   --> <Alert type="important"> + ASCII art in code block
|
+-- The Fine Line?
|   --> <Alert type="warning" title="The Fine Line">
|
+-- Steps to follow?
|   +-- Trackable with checklist? --> <GuideStep syncKey="...">
|   +-- Simple inline?           --> :::steps
|
+-- A command to run?
|   +-- Single command?   --> <Command>
|   +-- Multiple steps?   --> <CommandSequence> wrapping <Command> elements
|
+-- Expected output?
|   --> <TerminalOutput>
|
+-- Platform differences?
|   --> <PanelSwitcher> + <Panel>
|
+-- File structure?
|   --> <FileTree>
|
+-- Environment variables?
|   --> <EnvVars> + <EnvVar>
|
+-- End-of-post verification?
|   --> <ValidationChecklist> (with syncKeys matching GuideStep syncKeys)
|
+-- Service comparison?
|   --> <ComparisonTable> + <ComparisonHeader> + <ComparisonRow>
|
+-- Code alternatives (Terraform vs CloudFormation vs CDK)?
|   +-- Inline (remark plugin)? --> :::code-switcher
|   +-- Component?              --> <CodeSwitcher>
|
+-- Code changes (before/after)?
|   --> <DiffViewer> + <DiffBlock>
|
+-- AWS resource state?
|   --> <ResourceStatus>
|
+-- API docs (Phase 6+)?
|   --> <ApiEndpoint> + <ResponseExample>
|
+-- Service port mappings?
|   --> <ServiceMapping> + <Service>
|
+-- Quick tip?
|   --> :::tip (no import needed)
|
+-- Quick note?
|   --> :::note (no import needed)
```
