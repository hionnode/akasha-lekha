# MDX Components LLM Reference Guide

**Purpose**: This document provides structured, machine-readable information about all available MDX components for LLM code generation and assistance.

**Format**: Component specifications with props, types, examples, and constraints.

---

## Component Index

1. [PanelSwitcher](#panelswitcher)
2. [FileTree](#filetree)
3. [DiffViewer](#diffviewer)
4. [TerminalOutput](#terminaloutput)
5. [CodeSwitcher](#codeswitcher)
6. [Command](#command)
7. [Step](#step)
8. [ComparisonTable](#comparisontable)
9. [K8sManifest](#k8smanifest)
10. [Service](#service)
11. [EnvVars](#envvars)
12. [ApiEndpoint](#apiendpoint)
13. [Badge](#badge)
14. [Button](#button)
15. [VimShortcuts](#vimshortcuts)

---

## PanelSwitcher

### Specification

```typescript
interface PanelSwitcherProps {
  defaultActive?: string;  // Default: first panel value
  class?: string;          // Additional CSS classes
}

interface PanelProps {
  label: string;           // Required: Tab display text
  value?: string;          // Optional: Internal ID (auto-generated from label)
}
```

### Usage Pattern

```mdx
<PanelSwitcher defaultActive="npm">
  <Panel label="npm" value="npm">
    CONTENT_HERE
  </Panel>
  <Panel label="pnpm" value="pnpm">
    CONTENT_HERE
  </Panel>
</PanelSwitcher>
```

### Constraints

- Minimum panels: 1
- Recommended panels: 2-5
- Maximum panels: No limit (but 5+ may wrap on mobile)
- Content: Any MDX content (code blocks, text, components)

### Use Cases

- Package manager alternatives (npm/pnpm/yarn/bun)
- Programming language examples (JS/TS/Python)
- Framework comparisons (React/Vue/Svelte)
- Configuration formats (JSON/YAML/TOML)

### Features

- Keyboard navigation (Arrow keys, Home, End)
- Animated blue indicator line
- Click ripple effect
- Mobile-responsive (44px touch targets)
- Automatic activation on arrow key navigation

### Generation Rules

1. Always provide at least 2 panels for meaningful comparison
2. Use consistent content structure across panels
3. Set `defaultActive` to most common option (usually "npm")
4. Keep panel labels short (1-2 words)
5. Use `value` prop only if label contains spaces or special characters

---

## FileTree

### Specification

```typescript
// No props - content-based component
```

### Usage Pattern

```mdx
<FileTree>
src/
  components/
    Button.astro
    Header.astro
  pages/
    index.astro
package.json
</FileTree>
```

### Constraints

- Indentation: 2 spaces per level
- Maximum nesting: 9 levels
- Folder indicator: Trailing `/`
- File extensions: Automatically detected for icons

### Formatting Rules

```
folder/              # Folder (blue icon)
  subfolder/         # Nested folder (2 spaces)
    file.ext         # File (cyan icon)
  another-file.js    # File at same level
top-level.json       # Root file
```

### Features

- Copy path buttons (always visible at 0.4 opacity)
- Collapsible directories
- Color-coded icons (blue folders, cyan files)
- Automatic icon selection based on extension

### Generation Rules

1. Use 2-space indentation consistently
2. Add `/` to all folder names
3. Show only relevant files (avoid clutter)
4. Order: folders first, then files (alphabetically)
5. Include file extensions for clarity
6. Limit depth to 4-5 levels for readability

### Common File Extensions

- `.astro`, `.js`, `.ts`, `.jsx`, `.tsx`
- `.css`, `.scss`, `.sass`
- `.json`, `.yaml`, `.yml`, `.toml`
- `.md`, `.mdx`
- `.env`, `.gitignore`

---

## DiffViewer

### Specification

```typescript
interface DiffViewerProps {
  mode?: 'unified' | 'split';  // Default: 'unified'
}

interface DiffBlockProps {
  type: 'added' | 'removed';   // Required
}
```

### Usage Pattern

```mdx
<DiffViewer mode="unified">
  <DiffBlock type="removed">
    OLD_CODE_HERE
  </DiffBlock>
  <DiffBlock type="added">
    NEW_CODE_HERE
  </DiffBlock>
</DiffViewer>
```

### Constraints

- Must have at least one DiffBlock
- DiffBlock content: Plain text or code
- Syntax highlighting: Preserved from parent context

### Features

- +/- symbols for additions/removals
- Color-coded backgrounds (green: 0.15 opacity, red: 0.15 opacity)
- Left border indicators (3px solid)
- Monospace font for symbols

### Generation Rules

1. Use `unified` mode by default
2. Place removed blocks before added blocks
3. Show minimal context (only changed lines)
4. Align indentation between removed/added blocks
5. Include language identifier in code blocks if needed

### Example Patterns

**Configuration change**:
```mdx
<DiffViewer>
  <DiffBlock type="removed">
    port: 3000
  </DiffBlock>
  <DiffBlock type="added">
    port: 8080
  </DiffBlock>
</DiffViewer>
```

**Function refactor**:
```mdx
<DiffViewer>
  <DiffBlock type="removed">
    function oldWay() { ... }
  </DiffBlock>
  <DiffBlock type="added">
    const newWay = () => { ... }
  </DiffBlock>
</DiffViewer>
```

---

## TerminalOutput

### Specification

```typescript
interface TerminalOutputProps {
  title?: string;        // Terminal window title
  searchable?: boolean;  // Enable search (default: false)
  copyable?: boolean;    // Show copy button (default: true)
}
```

### Usage Pattern

```mdx
<TerminalOutput title="Build Output" searchable={true}>
```
$ command here
output line 1
output line 2
```
</TerminalOutput>
```

### Constraints

- Content: Must be code block (triple backticks)
- Title: Max 50 characters recommended
- Search: Only works with searchable={true}

### Features

- Functional search with regex
- Yellow highlighting for matches
- Match count display in placeholder
- Copy entire output button
- Terminal-style UI (colored dots)

### Generation Rules

1. Include `$` or `>` prompt for commands
2. Use realistic output formatting
3. Enable search for long outputs (>20 lines)
4. Set descriptive title
5. Use ANSI-style formatting if needed

### Common Use Cases

- Build outputs
- Test results
- Deployment logs
- Error messages
- Command execution results

---

## CodeSwitcher

### Specification

Same as PanelSwitcher - it's an alias optimized for code.

### Usage Pattern

```mdx
<CodeSwitcher>
  <Panel label="JavaScript">
    ```js
    CODE_HERE
    ```
  </Panel>
  <Panel label="TypeScript">
    ```ts
    CODE_HERE
    ```
  </Panel>
</CodeSwitcher>
```

### Generation Rules

1. Always use code blocks inside panels
2. Specify language for syntax highlighting
3. Keep code examples equivalent across panels
4. Use for language/framework comparisons

---

## Command

### Specification

```typescript
interface CommandProps {
  command: string;      // Required: The command
  description?: string; // Optional: What it does
}
```

### Usage Pattern

```mdx
<Command 
  command="npm install express" 
  description="Install Express.js framework"
/>
```

### Constraints

- Command: Single line only
- Description: Max 100 characters
- No multiline commands (use CommandSequence instead)

### Features

- Copy button
- Syntax highlighting
- Description tooltip

### Generation Rules

1. Use full commands (not abbreviated)
2. Include flags and options
3. Provide clear descriptions
4. Use for standalone commands only

---

## Step

### Specification

```typescript
interface StepProps {
  number: number;  // Required: Step number
  title: string;   // Required: Step title
}
```

### Usage Pattern

```mdx
<Step number={1} title="Install Dependencies">
  Content explaining this step...
  
  <Command command="npm install" />
</Step>
```

### Constraints

- Number: Must be sequential (1, 2, 3...)
- Title: Max 60 characters
- Content: Any MDX content

### Features

- Numbered badges
- Visual hierarchy
- Collapsible content

### Generation Rules

1. Number steps sequentially
2. Use imperative titles ("Install", "Configure", "Deploy")
3. Keep steps focused (one task per step)
4. Include code examples where relevant
5. Nest other components inside steps

---

## ComparisonTable

### Specification

```typescript
// No props - uses child components

interface ComparisonHeaderProps {
  // No props - children are column headers
}

interface ComparisonRowProps {
  // No props - children are cell values
}
```

### Usage Pattern

```mdx
<ComparisonTable>
  <ComparisonHeader>
    <div>Feature</div>
    <div>Option A</div>
    <div>Option B</div>
  </ComparisonHeader>
  
  <ComparisonRow>
    <div>Speed</div>
    <div>Fast</div>
    <div>Slow</div>
  </ComparisonRow>
</ComparisonTable>
```

### Constraints

- Minimum columns: 2
- Maximum columns: 5 (recommended)
- All rows must have same column count
- Header required

### Features

- Auto-detects column count
- Responsive grid layout
- Alternating row colors

### Generation Rules

1. First column: Feature/criteria name
2. Subsequent columns: Values for each option
3. Use consistent formatting across cells
4. Keep cell content concise (1-2 lines)
5. Use emojis for visual indicators (✅❌⚡🐌)

---

## K8sManifest

### Specification

```typescript
interface K8sManifestProps {
  kind: string;       // Required: Resource type
  name: string;       // Required: Resource name
  namespace?: string; // Optional: K8s namespace
}
```

### Usage Pattern

```mdx
<K8sManifest kind="Deployment" name="my-app" namespace="production">
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
```
</K8sManifest>
```

### Constraints

- Content: Must be YAML code block
- Kind: Standard K8s resource types
- Name: Must match metadata.name in YAML

### Common Kinds

- Deployment, StatefulSet, DaemonSet
- Service, Ingress
- ConfigMap, Secret
- Pod, Job, CronJob

### Features

- Kind badge with color coding
- Namespace indicator
- Copy manifest button

### Generation Rules

1. Use valid K8s YAML
2. Include apiVersion and kind
3. Set namespace for non-default namespaces
4. Use realistic configurations
5. Include comments for complex fields

---

## Service

### Specification

```typescript
interface ServiceProps {
  name: string;       // Required: Service name
  type: string;       // Required: ClusterIP | NodePort | LoadBalancer
  port: number;       // Required: Service port
  targetPort: number; // Required: Container port
}
```

### Usage Pattern

```mdx
<Service 
  name="api-service"
  type="ClusterIP"
  port={8080}
  targetPort={3000}
>
  Description of the service
</Service>
```

### Constraints

- Type: Must be valid K8s service type
- Port: 1-65535
- TargetPort: 1-65535

### Generation Rules

1. Use ClusterIP for internal services
2. Use LoadBalancer for external services
3. Match targetPort to container port
4. Provide clear description

---

## EnvVars

### Specification

```typescript
interface EnvVarProps {
  name: string;        // Required: Variable name
  value?: string;      // Optional: Example value
  required?: boolean;  // Optional: Is it required?
  description?: string;// Optional: What it does
}
```

### Usage Pattern

```mdx
<EnvVars>
  <EnvVar 
    name="DATABASE_URL" 
    value="postgresql://localhost:5432/db"
    required={true}
    description="PostgreSQL connection string"
  />
  <EnvVar 
    name="PORT" 
    value="3000"
    description="Server port"
  />
</EnvVars>
```

### Constraints

- Name: UPPERCASE_SNAKE_CASE convention
- Value: String (will be displayed as-is)
- Description: Max 100 characters

### Features

- Copy variable name
- Copy value
- Required badge
- Syntax highlighting

### Generation Rules

1. Use UPPERCASE_SNAKE_CASE for names
2. Provide realistic example values
3. Mark critical vars as required
4. Include descriptions for clarity
5. Group related vars together

---

## ApiEndpoint

### Specification

```typescript
interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;        // Required: Endpoint path
  description?: string;// Optional: What it does
}
```

### Usage Pattern

```mdx
<ApiEndpoint method="POST" path="/api/users" description="Create a new user">
  <ResponseExample>
    ```json
    {
      "id": "123",
      "name": "John Doe"
    }
    ```
  </ResponseExample>
</ApiEndpoint>
```

### Constraints

- Method: Must be valid HTTP method
- Path: Must start with `/`
- Content: Typically ResponseExample component

### Features

- Color-coded method badges
- Copy path button
- Response examples
- Request/response tabs

### Generation Rules

1. Use RESTful path conventions
2. Include path parameters (`:id`, `:slug`)
3. Provide realistic response examples
4. Use proper HTTP methods
5. Add descriptions for clarity

### Method Colors

- GET: Blue
- POST: Green
- PUT: Yellow
- DELETE: Red
- PATCH: Purple

---

## Badge

### Specification

```typescript
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
}
```

### Usage Pattern

```mdx
<Badge variant="success">Active</Badge>
```

### Generation Rules

1. Use for status indicators
2. Keep text short (1-2 words)
3. Choose appropriate variant

---

## Button

### Specification

```typescript
interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}
```

### Usage Pattern

```mdx
<Button href="/docs" variant="primary">
  Read the Docs
</Button>
```

### Generation Rules

1. Use primary for main CTAs
2. Use secondary for alternatives
3. Use ghost for subtle actions

---

## VimShortcuts

### Specification

```typescript
interface ShortcutProps {
  keys: string;        // Required: Key combination
  description: string; // Required: What it does
}
```

### Usage Pattern

```mdx
<VimShortcuts>
  <Shortcut keys="dd" description="Delete line" />
  <Shortcut keys="yy" description="Copy line" />
</VimShortcuts>
```

### Generation Rules

1. Use standard Vim notation
2. Group related shortcuts
3. Provide clear descriptions

---

## Global Styling Variables

All components use these CSS variables:

```css
--bg-primary: #1a1b26;
--bg-secondary: #24283b;
--bg-tertiary: #414868;

--fg-primary: #c0caf5;
--fg-secondary: #a9b1d6;
--fg-muted: #565f89;

--accent-blue: #7aa2f7;
--accent-green: #9ece6a;
--accent-red: #f7768e;
--accent-cyan: #7dcfff;
--accent-yellow: #e0af68;

--border: #414868;
```

---

## Component Selection Logic

Use this decision tree when generating MDX:

```
Need to show code alternatives?
  → PanelSwitcher or CodeSwitcher

Need to show file structure?
  → FileTree

Need to show code changes?
  → DiffViewer

Need to show terminal output?
  → TerminalOutput

Need to show step-by-step tutorial?
  → Step components

Need to compare options?
  → ComparisonTable

Need to document API?
  → ApiEndpoint

Need to document K8s resources?
  → K8sManifest, Service

Need to document environment variables?
  → EnvVars

Need to show CLI command?
  → Command

Need status indicator?
  → Badge

Need call-to-action?
  → Button
```

---

## Best Practices for LLM Generation

### 1. Component Nesting

**Allowed**:
- Step > Command
- Step > PanelSwitcher
- Step > FileTree
- ApiEndpoint > ResponseExample
- EnvVars > EnvVar
- ComparisonTable > ComparisonHeader/Row

**Not Recommended**:
- PanelSwitcher > PanelSwitcher (use separate instances)
- FileTree > FileTree (flatten structure)
- DiffViewer > DiffViewer (combine blocks)

### 2. Content Organization

1. Start with context (text explanation)
2. Add interactive component
3. Follow with additional details
4. End with next steps or summary

### 3. Code Block Formatting

- Always specify language for syntax highlighting
- Use consistent indentation (2 spaces)
- Include comments for complex code
- Keep examples concise but complete

### 4. Accessibility

- Provide descriptive labels
- Use semantic HTML in content
- Include alt text for images
- Maintain logical heading hierarchy

### 5. Performance

- Limit components per page (max 10-15)
- Avoid deeply nested structures (max 3 levels)
- Use code splitting for large examples
- Optimize images before embedding

---

## Error Handling

### Common Errors

1. **Missing required props**: Check component specification
2. **Invalid prop values**: Verify type and allowed values
3. **Malformed content**: Ensure proper MDX syntax
4. **Nesting issues**: Review allowed nesting patterns

### Validation Rules

- All required props must be provided
- Prop types must match specification
- Content must be valid MDX
- Component names are case-sensitive

---

## Version Compatibility

**Current Version**: 2.0 (2026-01-08)

**Breaking Changes from v1.0**:
- PanelSwitcher: New unified container design
- FileTree: Copy buttons always visible
- DiffViewer: +/- symbols now visible by default
- TerminalOutput: Search is functional (was placeholder)

**Deprecated**:
- None currently

**Experimental**:
- None currently

---

## Component File Locations

All components located in: `/src/components/shared/`

- `PanelSwitcher.astro` + `Panel.astro`
- `FileTree.astro`
- `DiffViewer.astro` + `DiffBlock.astro`
- `TerminalOutput.astro`
- `CodeSwitcher.astro`
- `Command.astro`
- `Step.astro`
- `ComparisonTable.astro` + `ComparisonHeader.astro` + `ComparisonRow.astro`
- `K8sManifest.astro`
- `Service.astro`
- `EnvVars.astro` + `EnvVar.astro`
- `ApiEndpoint.astro` + `ResponseExample.astro`
- `Badge.astro`
- `Button.astro`
- `VimShortcuts.astro`

---

## Testing Checklist

When generating MDX with components:

- [ ] All required props provided
- [ ] Prop values match types
- [ ] Content is valid MDX
- [ ] Nesting follows allowed patterns
- [ ] Code blocks have language identifiers
- [ ] Indentation is consistent
- [ ] Component names are correct
- [ ] No deprecated components used

---

## End of LLM Reference Guide

This guide provides complete specifications for all MDX components. Use it to generate accurate, consistent MDX content with proper component usage.
