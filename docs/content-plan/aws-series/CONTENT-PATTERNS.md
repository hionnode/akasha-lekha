# Content Patterns — AWS From Zero to Production

## The Design → Generate → Verify Loop → Explain (DGVE) Pipeline

Every technical part follows this four-beat structure. The depth varies by phase.

The DGVE pipeline is the pedagogical backbone of the series. In early parts the reader performs each step manually and learns what each beat accomplishes. As the series progresses, the beats get automated one at a time until a full scripted pipeline handles generation, verification, and explanation without human intervention — at which point the reader's role shifts from executor to reviewer and governor.

The critical insight: each beat exists because skipping it produces a specific, predictable failure mode. Design-skip leads to aimless generation. Generate-skip means hand-writing everything (defeats the purpose of agent-assisted development). Verify-skip means shipping agent hallucinations. Explain-skip means the reader never builds a mental model and becomes dependent on the agent.

### Pipeline Variants by Part Range

| Parts | Pipeline Depth | What It Looks Like |
|---|---|---|
| 1-5 (Foundation) | Conceptual only | Reader designs, agent generates, reader manually reviews. No scripted pipeline. Verification is "run the command, check the output." |
| 6-9 (Developer Workflow) | First automated verifier | Pre-commit hooks are Agent 2 in automated form. First two-agent pattern (manual: two terminals). |
| 10-18 (Local Dev + Frontend) | Manual pipeline | Design → prompt agent → review output → fix → apply. Verify step is running terraform validate + tflint + checkov manually. |
| 19 (First Scripted Pipeline) | Scripted pipeline | `scripts/pipeline/verify.sh` with iterative fix loop (max 3 iterations). `scripts/pipeline/explain.sh` uses cheapest model via `invoke_model`. First MCP server. |
| 20-42 | Scripted pipeline (growing) | Same scripts, more checks added per domain (networking rules, API validation, Docker checks). |
| 43 (Full Pipeline) | Full multi-agent pipeline | `scripts/pipeline/full-pipeline.sh` — configurable generator/verifier/explainer models. Parallel generation with git worktrees. Unified MCP verification. Pipeline eval. |
| 44-61 | Full pipeline (standard) | Readers use the full pipeline as a daily tool. Focus shifts from building the pipeline to using it. |
| 62-70 (Production) | Governed pipeline | OPA policies, environment-scoped MCP, audit logging, trust score. Pipeline is a governance tool. |

### DGVE Section Template

When writing a DGVE section in a post:

```markdown
## Design: {What We're Building}

{Architecture decisions. Why this approach. Constraints. 2-4 paragraphs max.}

{ASCII diagram in <Alert type="important"> if architecture is involved}

## Generate: {Agent Builds It}

{The actual prompt given to the agent — show it verbatim in a code block.}

{Agent output — show it unedited. If it's long, show the key sections and note what's omitted.}

## Verify: {Checking the Output}

{Run verification tools. Show pass/fail output.}

{If failures: show the fix loop iteration. "Iteration 1: tflint found X. Agent fixes. Iteration 2: clean."}

{Log results to Scorecard if applicable.}

## Explain: {What Just Happened}

{Summary of what was generated, what was flagged, how many iterations, what to focus on in review.}

{Key decisions the reader should validate — not just "looks good" but specific things to check.}
```

### DGVE Writing Rules

1. **Design must justify constraints before the agent sees them.** If you tell the agent "use t3.micro," the Design section must explain why t3.micro and not t3.small. The reader needs to know which constraints are load-bearing and which are preferences so they can adapt the prompt for their own situation.

2. **Generate must show the real prompt, not a cleaned-up version.** Include the messy parts — the context preamble, the AGENT-INSTRUCTIONS.md reference, the specific file paths. Readers learn prompting by seeing actual prompts, not idealized ones.

3. **Verify must show failures, not just the happy path.** If the agent got it right on the first try, say so and move on. But if it took two iterations, show both iterations. The fix loop is where the reader learns the most — seeing what went wrong and why the tool caught it builds intuition for what to review manually.

4. **Explain must name specific review targets.** Not "review the output" but "check that the security group ingress rules only allow port 443 from 0.0.0.0/0 and port 22 from your IP CIDR, not 0.0.0.0/0." The reader should know exactly where to look and what to look for.

### When to Skip Beats

Not every section in every post needs all four beats at full depth:

- **Skip Generate** when the reader must do something manually (console actions, enabling MFA, creating an AWS account). Show the steps directly.
- **Collapse Verify + Explain** when verification is trivial ("run `terraform validate`, confirm no errors"). Don't pad a one-line check into four paragraphs.
- **Skip Design** for configuration-only sections where the "why" was already covered in an earlier Design beat within the same post.
- **Never skip Verify entirely.** Every generated artifact must be checked, even if the check is "open the file and confirm it matches the expected structure."

## The Fine Line

Every post includes a "Fine Line" box showing under-engineering, right-sizing, and over-engineering for that topic. Plus an Agent Trap.

The Fine Line box is the series' signature teaching device. It anchors every post's recommendation against two failure modes the reader might otherwise drift toward. It also serves as a quick-reference summary — a reader skimming the post can read just the Fine Line box and know the post's core recommendation.

### Format

```mdx
<Alert type="warning" title="The Fine Line">

| | |
|---|---|
| ❌ **Under** | {What happens when you skip this entirely} |
| ✅ **Right** | {The approach this post teaches} |
| ❌ **Over** | {Enterprise overkill that kills velocity} |
| 🤖 **Agent Trap** | {Specific thing agents get wrong on this topic} |

</Alert>
```

### Placement

- After the main content sections, before Quick Wins or What's Coming
- One per post (never multiple Fine Line boxes)
- The "Right" row should match exactly what the post teaches — it's a summary

### Writing Guidelines

- **Under**: Always a concrete bad outcome ("Waking up to a $47K bill"), not an abstract risk. Use a scenario the reader can picture — a Slack message, a bill, a page at 3 AM, a customer complaint. The more visceral, the more memorable.
- **Right**: Specific enough to be actionable ("Root locked, IAM admin with MFA, billing alerts at $5/$20/$50"). Should read like a compressed checklist. If someone followed only this row, they'd be in good shape.
- **Over**: Should be something a real enterprise would do that's overkill for the reader's stage ("Complex AWS Organizations with SCPs, dedicated security OU, and a 40-page IAM policy document for a solo founder"). Name the specific practice and why it's too much right now — not "too complex" but "adds 2 weeks of setup for a problem you don't have yet."
- **Agent Trap**: Specific agent behavior ("Agent creates IAM user with AdministratorAccess 'to avoid permission errors'"), not generic warnings. Must include:
  - The exact wrong thing the agent does or generates
  - The agent's likely reasoning (why it seems correct to the agent)
  - What catches it (which tool, which rule, which check)

### Examples of Good vs Bad Fine Line Content

**Bad Under:** "Not setting up monitoring" (too vague)
**Good Under:** "Your app goes down for 4 hours before a customer tweets about it because you have no health checks or alerts"

**Bad Right:** "Set up proper monitoring" (not actionable)
**Good Right:** "CloudWatch alarms on 5xx rate > 1%, CPU > 80%, and a $0 SNS topic that emails you"

**Bad Over:** "Too much monitoring" (meaningless)
**Good Over:** "Datadog enterprise with custom metrics on every function, distributed tracing across all services, and a dedicated SRE rotation for a pre-launch app serving 50 requests/day"

**Bad Agent Trap:** "Agent might not set up monitoring correctly" (vague)
**Good Agent Trap:** "Agent adds CloudWatch alarms but sets evaluation period to 1 datapoint/1 minute, guaranteeing false positives on any traffic spike. Pre-commit hook checks alarm configuration against thresholds in AGENT-INSTRUCTIONS.md"

## Agent Trap Boxes

Standalone Agent Trap callouts can appear anywhere in the post where agents commonly fail. These are separate from the Fine Line box.

Agent Trap boxes are the primary mechanism for building the reader's "agent review instinct." Over 70 parts, the reader encounters 100+ specific failure modes and learns to anticipate them. By the end of the series, the reader should be able to look at any agent-generated infrastructure code and know the three most likely things it got wrong.

### Format

```mdx
<Alert type="caution" title="🤖 Agent Trap">

{Description of what the agent gets wrong and why. Include which thread catches it.}

</Alert>
```

### Guidelines

- Be specific: name the exact wrong output ("Agent generates `Action: s3:*`"), not vague ("Agent might use too-broad permissions")
- Explain WHY the agent does this (path of least resistance, training data bias, context limitations)
- State which guardrail catches it (AGENT-INSTRUCTIONS.md rule, pre-commit hook, checkov, OPA policy, Scorecard panel)
- Maximum 2 standalone Agent Trap boxes per post (plus the one in The Fine Line)

### Common Agent Failure Categories

Use these categories to identify where Agent Trap boxes belong in each post:

1. **Permission Inflation**: Agent uses wildcard permissions or overly broad resource ARNs because it's the fastest way to make the code work. Caught by: checkov, tflint custom rules, OPA policies.

2. **Default Insecurity**: Agent leaves default settings that are insecure (public S3 buckets, open security groups, unencrypted volumes). Caught by: checkov, pre-commit hooks, security category in Scorecard.

3. **Cost Blindness**: Agent provisions larger instances, enables expensive features, or creates resources without lifecycle policies because cost isn't in its training signal. Caught by: cost estimation in verify step, AGENT-INSTRUCTIONS.md cost constraints.

4. **Stale Patterns**: Agent uses deprecated APIs, old provider syntax, or patterns from outdated documentation in its training data. Caught by: terraform validate, provider version checks, version pinning rules.

5. **Context Amnesia**: Agent forgets constraints from earlier in the conversation or from AGENT-INSTRUCTIONS.md (naming conventions, tag requirements, region restrictions). Caught by: tag validation in pre-commit, naming convention checks.

6. **Happy Path Only**: Agent generates code that works for the success case but has no error handling, no retry logic, no timeout configuration. Caught by: manual review checklist items, integration tests.

### Placement Heuristics

Place Agent Trap boxes:
- Immediately after showing agent-generated code that contains the trap (reader sees the code, then the callout)
- Before a verification step that catches the trap (sets up the "aha" moment when the tool flags it)
- Never at the very beginning of a section (the reader needs context first)
- Never back-to-back (space them out with at least one other section between them)

## Lead Magnet Strategy

Lead magnets serve two purposes: they give the reader a concrete deliverable that saves real setup time, and they give the series a distribution mechanism beyond organic search. Every lead magnet must pass the "would I actually use this?" test.

### Placement

- End of every post, before or after Validation Checklist
- Format: a callout describing what's included and why it's valuable
- Types: PDF checklist, template files, starter kits, config collections

### Lead Magnet Guidelines

- Must be genuinely useful standalone (not just a summary of the post)
- Should save the reader 30+ minutes of setup time
- Include agent-specific content (agent-scoped IAM templates, pre-commit configs with agent hooks, etc.)
- Key lead magnets (Parts 5, 9, 19, 43, 62) are larger bundles that combine multiple deliverables

### Lead Magnet Types by Phase

| Phase | Parts | Lead Magnet Type | Example |
|---|---|---|---|
| Foundation | 1-5 | Checklists + starter configs | AWS account setup checklist PDF, starter AGENT-INSTRUCTIONS.md template |
| Developer Workflow | 6-9 | Config bundles | Pre-commit hook collection with agent-aware rules, Git workflow templates |
| Local Dev | 10-18 | Template repositories | Terraform module starter with validation, Docker Compose templates |
| First Pipeline | 19 | Pipeline starter kit | `verify.sh` + `explain.sh` + MCP server skeleton — the complete scripted pipeline |
| Infrastructure | 20-42 | Domain-specific templates | VPC module with security groups, RDS config with backup policies, ECS task definitions |
| Full Pipeline | 43 | Complete pipeline package | `full-pipeline.sh` + model configs + worktree scripts + eval harness |
| Production | 62-70 | Governance kit | OPA policy library, audit log templates, trust score dashboard config |

### Format in Post

```mdx
:::tip
**Free Download: {Lead Magnet Name}**

{1-2 sentences on what's included and why it saves time.} Get it at [works-on-my.cloud/resources/{slug}](/resources/{slug}).
:::
```

### Lead Magnet Quality Checklist

Before including a lead magnet, verify:

- [ ] It works without reading the post (standalone instructions included)
- [ ] It includes comments explaining non-obvious decisions
- [ ] Agent-specific content is clearly labeled
- [ ] File paths and naming follow the series conventions
- [ ] It's been tested against the current provider/tool versions mentioned in the post

## Post Length Guidelines

| Category | Parts | Word Count | Rationale |
|---|---|---|---|
| Foundation | 1-5 | 2,000-3,500 | Reader is new, keep focused |
| Standard | Most parts | 2,500-4,000 | Normal depth |
| KEY parts | 9, 19, 34, 43, 62 | 4,000-6,000 | Major deliverables, multiple systems introduced |
| Capstone | 67-70 | 3,000-4,500 | Integration, not new concepts |
| Short setup | 5, 40 | 1,500-2,000 | "Run, verify, move on" parts |

KEY parts are marked in the master plan. They introduce major systems (eval framework, first pipeline, full pipeline, guardrails) and need more space.

### Managing Length

- **If a post is running long**, split the DGVE into fewer, larger beats rather than many small ones. Five Design/Generate/Verify/Explain cycles in one post is too many — consolidate related resources into a single generation step.
- **If a post is running short**, add depth to the Explain beats. More "here's what to review and why" is always valuable. Do not pad with generic AWS documentation — every sentence should be specific to the reader's project.
- **Code blocks don't count toward word count guidelines.** A post with 2,000 words of prose and 200 lines of code is fine for a standard part.
- **The Fine Line box, Validation Checklist, and Key Takeaways are mandatory regardless of length.** Even a 1,500-word setup post gets all three.

## Cross-Referencing

Cross-references are the connective tissue of the series. They help readers who jump into the middle understand what they missed, and they help linear readers see the progression of ideas across parts.

### Back-References (inline links)

When referring to something established in an earlier part:

```markdown
As we configured in [Part 4](/blog/aws-for-startups/04-terraform-fundamentals), all resources require four tags.
```

- Use inline markdown links, not footnotes
- Reference the specific concept, not just "see Part N" — the link text or surrounding text must name what was covered
- Maximum 3-4 back-references per post (don't over-link)
- Prefer referencing the most recent occurrence of a concept, not the first introduction. If tags were introduced in Part 4 but refined in Part 12, link to Part 12.
- Back-references should never be required reading. The current post must make sense without clicking any back-reference links. Use them to offer depth, not to hide prerequisites.

### Forward-References ("Coming in Part N" callouts)

When teasing upcoming content:

```markdown
:::note
**Coming in Part 19:** Your first real Generate → Verify → Explain pipeline. The verification you're doing manually today gets automated.
:::
```

- Use `:::note` directive
- Be specific about what's coming (not "we'll learn more about this later")
- Include the deliverable, not just the topic
- Maximum 2 forward-references per post
- Only forward-reference parts that are fully planned (have a title, outline, and confirmed position in the series). Never forward-reference tentative content.
- Forward-references create reader expectations — they're implicit promises. If a forward-referenced part changes significantly, update the referring posts.

### Cross-Reference Maintenance

When editing any post, check:

1. All back-reference links still point to the correct part and section
2. All forward-references still accurately describe what's coming
3. No broken links from series reordering
4. Part numbers in prose match actual part numbers (easy to get wrong after reordering)

### What's Coming Section Template

Every post ends with a brief What's Coming section before the Validation Checklist:

```markdown
## What's Coming

Next in **Part {N}: {Title}**, we'll {specific deliverable}. {One sentence on why it matters or what it builds on from this part.}
```

- 2-3 sentences maximum
- Name the next part explicitly with its title
- Mention what carries forward from the current part
- If the current part left something intentionally incomplete (e.g., "we hardcoded the region — we'll parameterize it in Part 12"), call that out explicitly

## Validation Checklist Pattern

Every post ends with a ValidationChecklist component. This is the reader's "definition of done."

The Validation Checklist serves a dual purpose: it confirms the reader completed all the steps, and it creates a structured record of progress. The syncKey attributes enable future progress tracking integration with the labs system.

### Structure

```mdx
<ValidationChecklist>
  <Category name="Security" syncKey="part-N-security">
    <Item syncKey="part-N-mfa">MFA enabled on root account</Item>
    <Item syncKey="part-N-cloudtrail">CloudTrail logging enabled</Item>
  </Category>
  <Category name="Monitoring" syncKey="part-N-monitoring">
    <Item syncKey="part-N-billing">Billing alerts configured</Item>
  </Category>
</ValidationChecklist>
```

### Guidelines

- 2-4 categories per post
- 2-5 items per category
- syncKeys follow pattern: `part-{NN}-{kebab-descriptor}` where NN is zero-padded (part-01, part-19, part-43)
- Items must be verifiable (reader can check yes/no), not aspirational
- Include "Agent output reviewed" items where DGVE is used
- Common categories: Security, Infrastructure, Monitoring, Code Quality, Agent Workflow

### Writing Good Checklist Items

**Bad:** "Security is configured" (not verifiable)
**Good:** "Root account has MFA enabled (check: Security credentials page shows MFA device)"

**Bad:** "Terraform code works" (too broad)
**Good:** "`terraform plan` shows 0 to add, 0 to change, 0 to destroy after applying"

**Bad:** "Understand VPC networking" (aspirational, not checkable)
**Good:** "Can ping EC2 instance in private subnet from bastion host in public subnet"

### Category Selection

Choose categories that reflect the post's actual content areas. Common mappings:

- Posts with IAM, encryption, or access control content → **Security** category
- Posts with Terraform, CloudFormation, or resource creation → **Infrastructure** category
- Posts with CloudWatch, alerts, or dashboards → **Monitoring** category
- Posts with linting, testing, or validation → **Code Quality** category
- Posts with DGVE pipeline, agent prompts, or MCP → **Agent Workflow** category
- Posts with Docker, ECS, or Lambda → **Deployment** category
- Posts with cost alerts, budgets, or resource sizing → **Cost Management** category

### Agent Workflow Items

For posts that include DGVE sections, always include an Agent Workflow category with items like:

```mdx
<Category name="Agent Workflow" syncKey="part-N-agent">
  <Item syncKey="part-N-agent-reviewed">Agent-generated code reviewed against AGENT-INSTRUCTIONS.md</Item>
  <Item syncKey="part-N-verify-clean">Verification script passes with 0 findings</Item>
  <Item syncKey="part-N-scorecard">Scorecard updated with generation results</Item>
</Category>
```

## Key Takeaways Pattern

3-5 numbered items at the very end of the post, after Validation Checklist.

```markdown
## Key Takeaways

1. {One sentence, actionable or memorable}
2. {One sentence}
3. {One sentence}
```

- Each takeaway is exactly one sentence
- Mix of practical ("Always save terraform plan output before applying") and philosophical ("Trust is a number, not a feeling")
- The last takeaway should tease what's next or connect to the bigger picture
- Avoid restating checklist items — takeaways are insights, not tasks
- At least one takeaway per post should be quotable out of context (shareable on social media without needing the post for context)

### Takeaway Categories

Aim for a mix across these categories in each post:

1. **Tool-specific**: A concrete command, flag, or configuration to remember ("Always run `terraform plan -out=tfplan` so your apply matches exactly what you reviewed")
2. **Pattern-level**: A reusable principle beyond this specific tool ("Verify before you trust — whether the output came from an agent, a coworker, or yourself")
3. **Series-narrative**: Connects this post to the larger arc ("This is the last time you'll run verification manually — from Part 19 onward, the pipeline handles it")

Not every post needs all three categories, but every post needs at least one tool-specific and one pattern-level takeaway. Series-narrative takeaways are especially important at phase boundaries (Parts 5, 9, 19, 43, 62).
