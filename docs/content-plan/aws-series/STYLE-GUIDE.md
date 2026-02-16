# Style Guide — AWS From Zero to Production

This is the canonical style guide for the 70-part "AWS From Zero to Production" series on [works-on-my.cloud](https://works-on-my.cloud). Every post in the series must conform to these rules. When in doubt, re-read this document before writing.

---

## Audience

The reader is a **developer or technical founder with 1-5 years of experience** who is time-constrained and building something real.

Specifically, they:

- Have shipped products (side projects, startup MVPs, freelance work) but have not operated infrastructure at scale on AWS.
- Understand code deeply but treat infrastructure as a necessary evil they want to get right once and move on.
- Want production-grade infrastructure without the enterprise overhead of a platform team, 6-month migration plans, or committees.
- Value pragmatism over completeness. They would rather have 80% of best practice running today than 100% documented in a wiki no one reads.
- Are actively building with AI coding agents (Claude Code, Cursor, GitHub Copilot, etc.) and want to know how to use them safely for infrastructure work.
- Are spending their own money or their startup's limited runway, so cost awareness is not optional.

Do not write for:

- Complete beginners who need to learn what a terminal is.
- Enterprise architects evaluating vendor solutions for a 500-person org.
- People who want to understand AWS academically without building anything.

When you write, imagine a single person: a developer who just closed a seed round, has 18 months of runway, and needs to get their app running on AWS this week without creating a security incident or a surprise bill.

---

## Voice and Tone

**Direct, opinionated, second person ("you"), active voice.** Every sentence should sound like it came from a senior engineer pair-programming with you on a Saturday afternoon, not from a corporate documentation team.

Core principles:

- **No hedging.** Do not write "might", "could perhaps", "it depends" without immediately resolving it. If something genuinely depends on context, state the two or three contexts and give a concrete recommendation for each. Never leave the reader without a next step.
- **Conversational but technically precise.** The tone is informal. The content is not. Use correct terminology. Explain jargon on first use, then use it freely. Never dumb things down by using imprecise language.
- **The voice of a pragmatic senior managing a capable but unreliable junior (the AI agent).** This is the series' central metaphor. You trust the junior to write boilerplate. You verify everything they produce. You explain why something is wrong, not just that it is wrong.
- **Show confidence in recommendations.** When trade-offs exist, state both sides clearly, then pick one and explain why. The reader came here for opinions, not a balanced survey of the landscape.
- **Humor is dry, brief, and earned.** A well-placed observation about AWS's naming conventions or the gap between documentation and reality lands well. Forced jokes, puns, and "fun facts" do not. If you have to signal that something is funny, it is not funny.

Examples of good voice:

> "You need a VPC. Not because the default VPC is terrible (it is not), but because the default VPC teaches you nothing about networking, and when something breaks at 2 AM, you need to understand the network you are debugging."

> "Terraform will happily destroy your production database if you rename a resource. This is not a bug. This is Terraform telling you that naming matters."

Examples of bad voice:

> "You might want to consider setting up a VPC, as it could potentially help with network isolation, though the default VPC can also work in some cases."

> "Fun fact: AWS has over 200 services! Don't worry, we'll only use a few."

---

## Opening Pattern

Every post opens with the same three-beat structure. No exceptions.

**Beat 1: A vivid scenario or problem the reader recognizes (2-4 sentences max).**
This is not a generic statement about why the topic matters. It is a specific, visceral situation. The reader should think "that happened to me" or "that would definitely happen to me."

**Beat 2: A time promise ("This takes about 60 minutes").**
Be honest. If a post requires 3 hours of hands-on work, say 3 hours. The reader is time-constrained and will trust you more for being accurate than for being optimistic.

**Beat 3: An outcome promise ("By the end, you'll have X").**
Name the concrete deliverable. Not "you'll understand VPCs" but "you'll have a production VPC with public/private subnets, NAT gateway, and flow logs enabled."

Example from Part 1:

> Picture this: You create an AWS account, generate root access keys, and share them on Slack so everyone can deploy. You're moving fast. Three months later, you wake up to a $47,000 bill.
>
> **Time:** About 60 minutes.
>
> **Outcome:** A locked-down AWS account with MFA on root, an admin IAM user, billing alerts at $10/$50/$100, and an organization structure that scales to multiple environments.

---

## Title and Subtitle Convention

Every post title follows the format: `"{Topic}: {Subtitle}"`

**Title rules:**

- 5-10 words, descriptive of what the reader will do or learn.
- The topic portion names the AWS service or concept directly.
- The subtitle is a short, punchy, pragmatic angle. It tells the reader why this matters to them specifically, not what the service is in general.
- Never clickbait. Never questions as titles. Never "You Won't Believe What Happens When You Enable CloudTrail."

**Examples:**

- "Your First 60 Minutes in AWS: What Everyone Skips and Regrets Later"
- "IAM, The Key to Everything: Least Privilege Without Losing Your Mind"
- "Docker Compose, Local Development Environment: Because Localhost Isn't Production"
- "VPC From Scratch: The Network You Can Actually Debug"
- "RDS PostgreSQL: Your Database Deserves Better Than a Free Tier Prayer"
- "CloudWatch Alarms: Stop Checking the Console Every 5 Minutes"

**Anti-examples:**

- "Getting Started with AWS" (too vague, no angle)
- "Everything You Need to Know About VPCs" (too broad, no pragmatic hook)
- "Is ECS Right for You?" (question title, no opinion)

---

## Section Flow

Every post follows this standard structure. Not every section appears in every post, but the order is fixed.

### 1. Why This Matters

The problem statement. Make it visceral and specific. Name real failure modes, real costs, real consequences. This is not "VPCs are important for network isolation" but "Without a custom VPC, your database is one security group misconfiguration away from being publicly accessible, and you will not know until someone tells you on Hacker News."

2-4 paragraphs maximum.

### 2. What We're Building (or What We're Preventing)

A concrete list of deliverables for building posts, or a concrete list of protections for security/ops posts. Use a bulleted list. Each item should be specific enough that the reader can verify they have it when they finish.

Good:
- A VPC with 2 public subnets and 2 private subnets across 2 AZs
- NAT Gateway in one AZ (cost-optimized for non-production)
- VPC Flow Logs shipping to CloudWatch Logs

Bad:
- A VPC
- Some subnets
- Logging

### 3. Content Sections (varies by part)

The meat of the post. Structure varies by topic. Use headers (h2 and h3) liberally. Never let a section run longer than a screen without a visual break (code block, table, diagram, or callout).

### 4. The Fine Line

A structured section that appears in every post. It contains three columns (Under-Engineered / Right-Sized / Over-Engineered) showing the spectrum of approaches, plus an Agent Trap box highlighting where AI agents commonly go wrong. See CONTENT-PATTERNS.md for the full specification.

### 5. Quick Wins (not every post)

2-3 things the reader can do in 5 minutes that meaningfully improve their setup. These are low-effort, high-value actions. Include them when the topic has obvious quick wins. Do not force them when the topic requires sustained effort.

### 6. What's Coming

2-3 sentences teasing the next part. Name specific deliverables. Build anticipation by connecting the current part's output to the next part's input.

Good: "In Part 12, we take the Docker images we just built and deploy them to ECS with Fargate. You will have zero-downtime deployments, auto-scaling, and a load balancer, all defined in Terraform."

Bad: "Next time, we'll look at containers."

### 7. Validation Checklist

Concrete verification tasks the reader can perform to confirm they completed the post correctly. Use the ValidationChecklist component. Each item should be a command to run or a thing to check, not a concept to understand.

### 8. Key Takeaways

3-5 numbered items. Each is exactly one sentence. These are the ideas the reader should remember a month from now, not a summary of what the post covered.

Good:
1. A custom VPC costs nothing extra and gives you full control over your network topology.
2. Private subnets with NAT are where your application code runs; public subnets are for load balancers and bastion hosts only.
3. VPC Flow Logs are your network's black box recorder, enable them before you need them.

Bad:
1. We learned about VPCs.
2. We created subnets.
3. Networking is important.

---

## Prose Rules

These rules are non-negotiable. Apply them to every paragraph.

**Paragraph length:** Maximum 4 lines in the editor. If a paragraph runs longer, break it. Short paragraphs are easier to scan, and the reader is scanning.

**Bold:** Use sparingly. Bold the first occurrence of a key term when you define it. Bold critical warnings ("**Do not** use root access keys for daily work"). Do not bold for general emphasis on every other sentence.

**Comparisons:** Use tables, not prose. When you are comparing two or more options (services, configurations, approaches), a table communicates the differences faster and more clearly than paragraphs.

**Architecture diagrams:** Use ASCII art inside `<Alert type="important">` blocks. Keep diagrams simple. Label every arrow. Do not use ASCII art when a one-sentence description would suffice.

**Code blocks:** Always include `title="filename"` metadata so the reader knows where the code goes. Example: ` ```hcl title="modules/vpc/main.tf" `. Never show code without context about which file it belongs to.

**Terminal commands:** Use `terminal` meta for terminal-styled rendering. Example: ` ```bash terminal `.

**Numbers over qualifiers:** Prefer concrete numbers over vague qualifiers. Write "$47/month" not "affordable." Write "3 seconds" not "fast." Write "2 AZs" not "multiple availability zones." When the exact number depends on usage, give a range: "$12-47/month depending on traffic."

**Punctuation:** No em dashes in this series. Use commas, periods, or parentheses instead. Em dashes create a literary tone that conflicts with the technical, direct voice.

**Cross-references:** Write "Part N" not "#N" when referencing other parts in the series. Link to the post: "As we set up in [Part 4](/blog/aws-for-startups/04-terraform-fundamentals)".

**Openings:** Never write "In this article we will..." or "Today we're going to..." or any throat-clearing. Start doing the thing. The opening pattern (scenario, time, outcome) replaces all preamble.

**Lists:** Use bulleted lists for unordered items and numbered lists only when order matters (steps, rankings, priority). Do not number a list of features that have no inherent order.

---

## Agent-Era Voice

The series' thesis is that AI coding agents are transformative tools that require a new kind of engineering discipline. This is the lens through which every infrastructure topic is presented.

**Core framing:** Agents are "fast, tireless junior engineers who are confidently wrong 15% of the time." This is not dismissive. A junior engineer who is right 85% of the time and works 24/7 is extraordinarily valuable, if you have a verification system.

**Do not evangelize.** Assume the reader already uses agents. You are not convincing them to adopt AI. You are teaching them to use it safely for infrastructure, where mistakes are expensive and sometimes irreversible.

**Focus on verification, not generation.** The easy part is asking an agent to generate a Terraform module. The hard part is knowing whether the output is correct, secure, cost-effective, and idiomatic. Every post should emphasize what to check, not what to prompt.

**Show real agent output.** When demonstrating agent interactions, show unedited output, including mistakes. Then walk through the verification process. The reader learns more from watching you catch an error than from seeing a perfect generation.

**Agent Trap boxes.** Use these callout boxes to highlight specific failure modes where agents commonly go wrong. Be precise: "Agents frequently generate IAM policies with `Resource: *` even when you ask for least privilege. Always verify the Resource field." Not: "Be careful with agent-generated IAM policies."

**The curriculum's thesis: "Trust is a number, not a feeling."** Trust in agent output should be quantified through test suites, policy checks, cost estimates, and drift detection. The series progressively builds this verification infrastructure alongside the application infrastructure.

---

## Series Continuity

The 70 parts form a continuous narrative. Each part builds on previous parts and sets up future parts. Maintaining continuity is critical for the reader who follows the series in order, while ensuring each post is useful for someone who lands on it from a search engine.

**Self-contained usefulness:** Each post should be useful on its own. A reader who lands on Part 23 from Google should be able to follow the post even if they have not read Parts 1-22. This does not mean repeating all prior content. It means providing enough context (a sentence or two) for external concepts and linking to the relevant earlier part for details.

**Back-references:** When a post uses something set up in an earlier part, reference it with an inline link: "Using the VPC we created in [Part 6](/blog/aws-for-startups/06-vpc-from-scratch), we'll now..." Keep back-references brief. One sentence of context, then move on.

**Forward-references:** When a topic is coming in a later part, tease it with a callout: "We're hardcoding these values for now. In Part 19, we'll replace them with SSM Parameter Store and never hardcode a secret again." Forward-references create anticipation and help the reader understand why you are making certain temporary decisions.

**Thread additions:** The series has several progressive threads (AGENT-INSTRUCTIONS.md, Trust Scorecard, Eval Suite, MCP Server) that accumulate across posts. When a post adds to one of these threads, call it out explicitly: "Add this to your AGENT-INSTRUCTIONS.md" or "Your Trust Scorecard now includes 4 checks." The reader should always know the current state of each thread.

---

## What NOT to Do

These are hard rules, not suggestions.

- **Don't write like documentation.** Documentation is dry, exhaustive, and third person. This series is opinionated, selective, and second person. If a sentence would fit in an AWS docs page unchanged, rewrite it.
- **Don't hedge every recommendation with "it depends."** If it depends, say on what, and give a recommendation for each case. The reader wants a decision, not a framework for making decisions.
- **Don't use corporate jargon.** "Leverage", "synergize", "best-in-class", "robust", "scalable solution", "digital transformation" are banned. Use plain, specific language.
- **Don't explain basic programming concepts.** The reader knows what variables, loops, functions, APIs, and databases are. Start from there.
- **Don't pad word count.** Every sentence must earn its place. If a paragraph does not teach something, warn about something, or move the reader toward the deliverable, delete it.
- **Don't use emojis in prose.** The only exception is The Fine Line boxes, where the standard markers are used (see CONTENT-PATTERNS.md for those specific icons).
- **Don't write disclaimers.** Do not write "this is just one approach" or "your mileage may vary" or "consult your team before implementing." Own the recommendation. If there is a genuine risk, name it specifically. Generic disclaimers waste the reader's time and undermine your authority.
- **Don't use placeholder names.** No "Acme Corp", no "example.com" (except in DNS contexts), no "John Doe." Use realistic names that match the audience: a startup called "Shipfast", a developer named "you."
