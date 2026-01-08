# MDX Components User Guide

Welcome to the complete guide for using custom MDX components in your technical blog! This guide covers all available components, how to use them, and how to customize them for your needs.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Code Display Components](#code-display-components)
3. [Interactive Components](#interactive-components)
4. [DevOps Components](#devops-components)
5. [UI Components](#ui-components)
6. [Customization Guide](#customization-guide)
7. [Best Practices](#best-practices)

---

## Getting Started

### Importing Components

All components are available in your MDX files by default. Simply use them directly:

```mdx
import { PanelSwitcher, Panel } from '@/components/shared/PanelSwitcher.astro';

<PanelSwitcher defaultActive="npm">
  <Panel label="npm">
    ```bash
    npm install package
    ```
  </Panel>
</PanelSwitcher>
```

### Component Structure

Most components follow this pattern:
- **Props**: Configuration options (optional)
- **Slot**: Content goes between opening and closing tags
- **Styling**: Automatically themed with CSS variables

---

## Code Display Components

### 1. PanelSwitcher

**Purpose**: Display alternative code examples (e.g., npm vs pnpm vs yarn)

**When to use**: 
- Package manager instructions
- Multiple language examples
- Configuration alternatives

**Usage**:
```mdx
<PanelSwitcher defaultActive="npm">
  <Panel label="npm" value="npm">
    ```bash
    npm install express
    ```
  </Panel>
  
  <Panel label="pnpm" value="pnpm">
    ```bash
    pnpm add express
    ```
  </Panel>
  
  <Panel label="yarn" value="yarn">
    ```bash
    yarn add express
    ```
  </Panel>
</PanelSwitcher>
```

**Props**:
- `defaultActive` (optional): Which panel to show initially (defaults to first)
- `class` (optional): Additional CSS classes

**Panel Props**:
- `label` (required): Display name for the tab
- `value` (optional): Internal identifier (auto-generated from label if not provided)

**Features**:
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Animated indicator line
- ✅ Click ripple effect
- ✅ Mobile-friendly (44px touch targets)

---

### 2. FileTree

**Purpose**: Display project directory structures

**When to use**:
- Showing project scaffolding
- Explaining file organization
- Documentation of folder structures

**Usage**:
```mdx
<FileTree>
src/
  components/
    Button.astro
    Header.astro
  pages/
    index.astro
  styles/
    global.css
package.json
</FileTree>
```

**Features**:
- ✅ Automatic file/folder icons
- ✅ Color-coded (blue folders, cyan files)
- ✅ Copy path buttons (always visible)
- ✅ Collapsible directories
- ✅ Supports unlimited nesting (up to 9 levels)

**Tips**:
- Use 2-space indentation for nesting
- End folder names with `/`
- Copy buttons appear on hover (or always visible on mobile)

---

### 3. DiffViewer

**Purpose**: Show code changes (additions/removals)

**When to use**:
- Migration guides
- Before/after comparisons
- Configuration updates

**Usage**:
```mdx
<DiffViewer mode="unified">
  <DiffBlock type="removed">
    const oldFunction = () => {
      return "old";
    };
  </DiffBlock>
  
  <DiffBlock type="added">
    const newFunction = () => {
      return "new";
    };
  </DiffBlock>
</DiffViewer>
```

**Props**:
- `mode` (optional): `"unified"` or `"split"` (default: unified)

**DiffBlock Props**:
- `type` (required): `"added"` or `"removed"`

**Features**:
- ✅ +/- symbols for changes
- ✅ Color-coded backgrounds (green/red)
- ✅ Syntax highlighting preserved
- ✅ Left border indicators

---

### 4. TerminalOutput

**Purpose**: Display terminal/console output

**When to use**:
- Command execution results
- Log outputs
- Build/deployment logs

**Usage**:
```mdx
<TerminalOutput 
  title="Build Output" 
  searchable={true}
  copyable={true}
>
```
$ npm run build

> Building for production...
✓ Built in 2.3s
```
</TerminalOutput>
```

**Props**:
- `title` (optional): Terminal window title
- `searchable` (optional): Enable search box (default: false)
- `copyable` (optional): Show copy button (default: true)

**Features**:
- ✅ Functional search with highlighting
- ✅ Match count display
- ✅ Copy entire output
- ✅ Terminal-style UI with colored dots

---

### 5. CodeSwitcher

**Purpose**: Switch between different code implementations

**When to use**:
- Comparing frameworks
- Different approaches to same problem
- Language comparisons

**Usage**:
```mdx
<CodeSwitcher>
  <Panel label="JavaScript">
    ```js
    const sum = (a, b) => a + b;
    ```
  </Panel>
  
  <Panel label="TypeScript">
    ```ts
    const sum = (a: number, b: number): number => a + b;
    ```
  </Panel>
</CodeSwitcher>
```

**Similar to PanelSwitcher** but optimized for code comparisons.

---

## Interactive Components

### 6. Command

**Purpose**: Display CLI commands with descriptions

**When to use**:
- Tutorial steps
- Command references
- Installation instructions

**Usage**:
```mdx
<Command 
  command="npm install -g vercel" 
  description="Install Vercel CLI globally"
/>
```

**Props**:
- `command` (required): The command to display
- `description` (optional): Explanation of what it does

**Features**:
- ✅ Copy button
- ✅ Syntax highlighting
- ✅ Description tooltip

---

### 7. Step

**Purpose**: Create numbered step-by-step tutorials

**When to use**:
- Tutorials
- Setup guides
- Workflows

**Usage**:
```mdx
<Step number={1} title="Install Dependencies">
  First, install the required packages:
  
  ```bash
  npm install express
  ```
</Step>

<Step number={2} title="Configure Server">
  Create a `server.js` file...
</Step>
```

**Props**:
- `number` (required): Step number
- `title` (required): Step title

**Features**:
- ✅ Numbered badges
- ✅ Visual hierarchy
- ✅ Collapsible content (optional)

---

### 8. ComparisonTable

**Purpose**: Compare features, options, or tools

**When to use**:
- Tool comparisons
- Feature matrices
- Pros/cons lists

**Usage**:
```mdx
<ComparisonTable>
  <ComparisonHeader>
    <div>Feature</div>
    <div>Option A</div>
    <div>Option B</div>
  </ComparisonHeader>
  
  <ComparisonRow>
    <div>Speed</div>
    <div>⚡ Fast</div>
    <div>🐌 Slow</div>
  </ComparisonRow>
  
  <ComparisonRow>
    <div>Price</div>
    <div>$10/mo</div>
    <div>$5/mo</div>
  </ComparisonRow>
</ComparisonTable>
```

**Features**:
- ✅ Auto-detects column count
- ✅ Responsive grid layout
- ✅ Alternating row colors

---

## DevOps Components

### 9. K8sManifest

**Purpose**: Display Kubernetes manifests

**When to use**:
- Kubernetes tutorials
- Deployment guides
- Configuration examples

**Usage**:
```mdx
<K8sManifest 
  kind="Deployment" 
  name="my-app"
  namespace="production"
>
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

**Props**:
- `kind` (required): Resource type (Deployment, Service, etc.)
- `name` (required): Resource name
- `namespace` (optional): Kubernetes namespace

**Features**:
- ✅ Kind badge with color coding
- ✅ Namespace indicator
- ✅ Copy manifest button

---

### 10. Service

**Purpose**: Document Kubernetes services

**When to use**:
- Service mesh documentation
- Network architecture
- Service discovery guides

**Usage**:
```mdx
<Service 
  name="api-service"
  type="ClusterIP"
  port={8080}
  targetPort={3000}
>
  Internal API service for backend communication
</Service>
```

**Props**:
- `name` (required): Service name
- `type` (required): Service type (ClusterIP, NodePort, LoadBalancer)
- `port` (required): Service port
- `targetPort` (required): Container port

---

### 11. EnvVars

**Purpose**: Document environment variables

**When to use**:
- Configuration guides
- Deployment documentation
- Setup instructions

**Usage**:
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
    required={false}
    description="Server port"
  />
</EnvVars>
```

**EnvVar Props**:
- `name` (required): Variable name
- `value` (optional): Example value
- `required` (optional): Whether it's required
- `description` (optional): What it does

**Features**:
- ✅ Copy variable name
- ✅ Copy value
- ✅ Required badge
- ✅ Syntax highlighting

---

### 12. ApiEndpoint

**Purpose**: Document REST API endpoints

**When to use**:
- API documentation
- Integration guides
- Backend tutorials

**Usage**:
```mdx
<ApiEndpoint 
  method="POST" 
  path="/api/users"
  description="Create a new user"
>
  <ResponseExample>
    ```json
    {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com"
    }
    ```
  </ResponseExample>
</ApiEndpoint>
```

**Props**:
- `method` (required): HTTP method (GET, POST, PUT, DELETE, PATCH)
- `path` (required): API endpoint path
- `description` (optional): Endpoint description

**Features**:
- ✅ Color-coded method badges
- ✅ Copy path button
- ✅ Response examples
- ✅ Request/response tabs

---

## UI Components

### 13. Badge

**Purpose**: Display status, tags, or labels

**Usage**:
```mdx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Beta</Badge>
<Badge variant="error">Deprecated</Badge>
```

**Props**:
- `variant`: `"success"`, `"warning"`, `"error"`, `"info"` (default)

---

### 14. Button

**Purpose**: Call-to-action buttons

**Usage**:
```mdx
<Button href="/docs" variant="primary">
  Read the Docs
</Button>
```

**Props**:
- `href` (optional): Link URL
- `variant`: `"primary"`, `"secondary"`, `"ghost"`

---

### 15. VimShortcuts

**Purpose**: Display Vim keyboard shortcuts

**When to use**:
- Editor tutorials
- Vim guides
- Keyboard shortcut references

**Usage**:
```mdx
<VimShortcuts>
  <Shortcut keys="dd" description="Delete line" />
  <Shortcut keys="yy" description="Copy line" />
  <Shortcut keys="p" description="Paste" />
</VimShortcuts>
```

---

## Customization Guide

### Theming

All components use CSS variables for theming. Customize in your global CSS:

```css
:root {
  /* Colors */
  --bg-primary: #1a1b26;
  --bg-secondary: #24283b;
  --bg-tertiary: #414868;
  
  --fg-primary: #c0caf5;
  --fg-secondary: #a9b1d6;
  --fg-muted: #565f89;
  
  /* Accents */
  --accent-blue: #7aa2f7;
  --accent-green: #9ece6a;
  --accent-red: #f7768e;
  --accent-cyan: #7dcfff;
  --accent-yellow: #e0af68;
  
  /* Borders */
  --border: #414868;
  
  /* Spacing */
  --component-margin: 1.5rem;
}
```

### Component Margins

All components use standardized `1.5rem` margins. Override with:

```css
.panel-switcher-wrapper {
  margin: 2rem 0; /* Custom margin */
}
```

### Font Customization

Components use `Inconsolata` for monospace. Change in CSS:

```css
:root {
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Best Practices

### 1. Use Appropriate Components

- **Code alternatives** → `PanelSwitcher`
- **File structures** → `FileTree`
- **Code changes** → `DiffViewer`
- **Terminal output** → `TerminalOutput`
- **API docs** → `ApiEndpoint`

### 2. Keep Content Concise

- Limit PanelSwitcher to 3-5 options
- FileTree should show relevant files only
- Use descriptions to explain complex code

### 3. Accessibility

All components are keyboard-accessible:
- Use `Tab` to navigate
- `Arrow keys` for tabs/panels
- `Enter/Space` to activate
- `Esc` to close modals

### 4. Mobile Optimization

- Components are responsive by default
- Touch targets are 44px minimum
- Horizontal scroll enabled where needed

### 5. Performance

- Components are lightweight (<10KB total)
- Lazy-loaded where possible
- No external dependencies

---

## Common Patterns

### Tutorial Structure

```mdx
<Step number={1} title="Setup">
  <Command command="npm create astro@latest" />
</Step>

<Step number={2} title="Install Dependencies">
  <PanelSwitcher>
    <Panel label="npm">...</Panel>
    <Panel label="pnpm">...</Panel>
  </PanelSwitcher>
</Step>

<Step number={3} title="Configure">
  <FileTree>
    src/
      config.ts
  </FileTree>
</Step>
```

### API Documentation

```mdx
<ApiEndpoint method="GET" path="/api/users/:id">
  Fetch a user by ID
  
  <ResponseExample>
    ```json
    { "id": "123", "name": "John" }
    ```
  </ResponseExample>
</ApiEndpoint>
```

### Migration Guide

```mdx
<DiffViewer>
  <DiffBlock type="removed">
    // Old way
  </DiffBlock>
  <DiffBlock type="added">
    // New way
  </DiffBlock>
</DiffViewer>
```

---

## Troubleshooting

### Component Not Rendering

1. Check import path
2. Verify props are correct
3. Ensure content is properly formatted

### Styling Issues

1. Check CSS variable values
2. Verify no conflicting styles
3. Use browser DevTools to inspect

### Performance Issues

1. Limit nested components
2. Use code splitting for large files
3. Optimize images and media

---

## Support

For issues or questions:
- Check the [examples page](/blog/mdx-mastery-series/04-code-focused-components)
- Review component source code
- File an issue on GitHub

---

## Version History

- **v2.0** (2026-01-08): Major UX improvements
  - PanelSwitcher redesign
  - FileTree copy buttons always visible
  - DiffViewer +/- symbols
  - TerminalOutput functional search
  
- **v1.0** (2025-12): Initial release
  - 15+ components
  - Full accessibility support
  - Mobile-responsive design
