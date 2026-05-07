Now I have comprehensive information. Let me compile the research report.

---

# Claude Code Comprehensive Research Report (April 2026)
## Greenfield Next.js 16 + Supabase + Payload CMS Project Setup

**Date:** April 23, 2026  
**Research Scope:** 20 domains of Claude Code capabilities  
**Verification Method:** Cross-referenced current official documentation (https://code.claude.com/docs), GitHub releases, and 2026 changelog entries

---

## 1. CLAUDE.md Best Practices

### Current Landscape (April 2026)

CLAUDE.md files are foundational to Claude Code. Running `/init` generates a starter CLAUDE.md automatically by analyzing your codebase. The 2026 best-practice consensus emphasizes **hierarchy and minimalism**: target under 200 lines per file. Longer CLAUDE.md files cause Claude to ignore instructions through context saturation.

**Hierarchical Structure:**
- **Enterprise/managed policy**: `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) or `/etc/claude-code/CLAUDE.md` (Linux) — applied to all organization users
- **Project root**: `./CLAUDE.md` or `./.claude/CLAUDE.md` — checked into git, team-shared
- **User level**: `~/.claude/CLAUDE.md` — personal, all projects
- **Local (personal)**: `./CLAUDE.local.md` — gitignored, project-specific sandbox

Child directories auto-discover and load CLAUDE.md files on-demand when Claude reads files in those directories. In monorepos, this means `root/CLAUDE.md`, `root/packages/vecna/CLAUDE.md`, and `root/packages/thumper/CLAUDE.md` all coexist without conflict.

**Import syntax** supports `@path/to/file` references, allowing composition:
```markdown
See @README.md for overview and @package.json for commands.
# Additional
- Git workflow: @docs/git-instructions.md
```

Imported files still load and consume context at session start; they don't reduce token usage but aid organization.

**What to Include vs. Exclude:**
- ✅ Build/test commands Claude can't guess
- ✅ Code style that differs from language defaults
- ✅ Architectural decisions specific to the project
- ✅ Repository etiquette (branch naming, PR conventions)
- ❌ Anything Claude can infer from reading code
- ❌ Standard language conventions
- ❌ Long API documentation (link instead)
- ❌ Information that changes frequently

**Karpathy-Derived Pattern:** The community repository [forrestchang/andrej-karpathy-skills](https://github.com/shanraisshan/claude-code-best-practice) and similar curated collections (2026 editions) emphasize the "virtuous cycle" pattern: CLAUDE.md → Skills → Hooks → Rules, where each layer handles increasingly specialized or event-driven behavior.

**Sources:**
- [Best Practices for Claude Code - Claude Code Docs](https://code.claude.com/docs/en/best-practices)
- [CLAUDE.md Best Practices (March 2026)](https://uxplanet.org/claude-md-best-practices-1ef4f861ce7c?gi=77cc11fce3f9)
- [How Claude remembers your project - Claude Code Docs](https://code.claude.com/docs/en/memory)

**What this means for a greenfield Next.js/Supabase/Payload repo:**
- Run `/init` immediately after project creation to auto-detect build commands, test frameworks, and conventions
- Create a focused root CLAUDE.md (150–200 lines) covering: pnpm commands, linting/testing, Next.js app-router patterns, Supabase schema conventions, Payload API routes, and team etiquette
- Store per-package overrides in `packages/*/CLAUDE.md` (Payload admin, Next.js frontend, shared utils) so each context is localized
- Commit the root CLAUDE.md to git; keep `.claude/CLAUDE.local.md` for personal sandbox URLs and test credentials

---

## 2. Skills System (`.claude/skills/`)

### Current State (April 2026)

Skills are the primary extension mechanism for Claude Code. They supersede the older "commands" system (`~/.claude/commands/`) which still works but is deprecated in favor of `.claude/skills/`.

**Skill Frontmatter Fields (YAML):**
```yaml
---
name: skill-name              # Required for /slash-command. Max 64 chars, lowercase+hyphens only
description: What it does     # Recommended. Front-load key use case. Truncated at 1,536 chars for skill listing
when_to_use: Additional context # Appended to description in skill listing
argument-hint: "[arg1] [arg2]" # Help text shown during /autocomplete
arguments: [arg1, arg2]        # Named positional args. Enables $arg1, $arg2 substitution
disable-model-invocation: true # Prevent Claude from auto-triggering (manual /skill-name only)
user-invocable: false          # Prevent user from typing /skill-name (Claude-only context)
allowed-tools: Read Grep Bash  # Pre-approve these tools while skill is active, no permission prompt
model: claude-opus-4-7         # Override session model for this skill. "inherit" to keep active model
effort: high                   # Override effort level (low, medium, high, xhigh, max)
context: fork                  # Run in isolated subagent context
agent: Explore                 # Which subagent type (Explore, Plan, general-purpose, or custom agent)
hooks: {...}                   # Event hooks scoped to this skill's lifecycle
paths: ["src/**/*.ts"]         # Glob patterns. Skill only loads when Claude works with matching files
shell: bash                    # Shell for !!`command` and ```! blocks. bash (default) or powershell
---
```

**String Substitutions:**
- `$ARGUMENTS` — full argument string as typed
- `$ARGUMENTS[N]` or `$N` — nth argument (0-indexed)
- `$name` — named argument from `arguments` field
- `${CLAUDE_SESSION_ID}` — current session ID
- `${CLAUDE_SKILL_DIR}` — skill directory path

**Auto-Triggering vs. Manual Invocation:**
Claude discovers skills through the Skill tool, reading their descriptions from context. The `description` field determines when Claude auto-invokes; `disable-model-invocation: true` prevents automatic invocation entirely.

**Skill Discovery:**
- Personal: `~/.claude/skills/<name>/SKILL.md` (all projects)
- Project: `.claude/skills/<name>/SKILL.md` (this project, shareable via git)
- Plugin: `<plugin>/skills/<name>/SKILL.md` (when plugin enabled)
- Nested (monorepo): `packages/*/​.claude/skills/` auto-discovered when editing files in that package

When skills share names across scopes, precedence: **enterprise > personal > project > plugin**.

**Skill Anatomy (Best Practice):**
```text
my-skill/
├── SKILL.md           # Entry point: frontmatter + instructions
├── reference.md       # Detailed docs (loaded on-demand)
├── examples.md        # Example outputs
└── scripts/
    └── helper.sh      # Executable (referenced from SKILL.md)
```

Keep `SKILL.md` under 500 lines. Reference supporting files from the main skill so Claude knows when to load them.

**Invocation Control:**
| Config | User invokes | Claude invokes | When loaded into context |
|--------|--------------|----------------|------------------------|
| Default | Yes | Yes | Description always, full skill on invoke |
| `disable-model-invocation: true` | Yes | No | Not in context (manual only) |
| `user-invocable: false` | No | Yes | Description always, full skill on invoke |

**Skill Lifecycle:**
When invoked, the rendered SKILL.md enters the conversation as a single message and persists for the rest of the session. Claude Code does not re-read the skill file on later turns. Auto-compaction preserves the first 5,000 tokens of each skill after summarization, with all re-attached skills sharing a combined 25,000-token budget.

**Shell Injection (Dynamic Context):**
The `` !`<command>` `` syntax runs shell commands before sending the skill to Claude. Output replaces the placeholder:

```yaml
---
name: pr-summary
---
## Pull request context
- Diff: !`gh pr diff`
- Comments: !`gh pr view --comments`
```

When the skill runs, commands execute first; Claude receives the rendered result with actual data.

**Sources:**
- [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Agent Skills Open Standard](https://agentskills.io)

**What this means for greenfield Next.js/Supabase/Payload:**
- Create a root `.claude/skills/` with 3–5 core skills:
  - `/migrate-schema` — Supabase schema migrations (context: fork, agent: Plan)
  - `/payload-generate-field` — Generate Payload CMS field types (disable-model-invocation: false, auto-trigger on Payload paths)
  - `/next-api-endpoint` — Bootstrap Next.js API routes with validation (paths: "app/api/**")
  - `/test-components` — Component test scaffolding (paths: "components/**/*.tsx")
  - `/deploy` — Trigger Vercel deployment (disable-model-invocation: true, manual-only)
- Use `arguments: [module]` to parameterize skills: `/migrate-schema users` populates $0 with "users"
- Add `allowed-tools: Bash(npm run lint), Bash(npm test)` to pre-approve testing for skill context
- Scope path-specific skills with `paths: ["src/**"]` so they only load when relevant, reducing noise

---

## 3. Subagents / Agents (`.claude/agents/`)

### Current State (April 2026)

Subagents are specialized AI assistants that delegate tasks to isolated contexts. Each subagent runs in its own context window with custom system prompt, specific tool access, and independent permissions.

**Built-in Subagent Types:**
- **Explore** — Read-only tools. Explores codebases, researches, reports findings without making changes
- **Plan** — Reads files, drafts plans, outputs structured proposals without executing
- **Task** — Implements tasks from a list. Structured for dependency tracking
- **general-purpose** — Full tool access, default fallback
- **claude-code-guide** — Explains Claude Code features
- **statusline-setup** — Configures terminal status line

**Custom Subagent Structure:**
```markdown
.claude/agents/security-reviewer/AGENT.md
---
name: security-reviewer
description: Reviews code for security vulnerabilities. Use when reviewing untrusted code or hardened paths.
tools: Read, Grep, Bash(grep *), Glob   # Restrict tool access
model: claude-opus-4-7                   # Force a specific model
effort: high                             # Override effort level
permissions:
  defaultMode: acceptEdits
  deny: ["Bash(curl *)", "Bash(nc *"]   # Block dangerous patterns
---

You are a senior security engineer. Review for:
- SQL injection, XSS, command injection
- Auth/authz flaws, insecure deserialization
- Secrets in code, exposed credentials
```

**Frontmatter Fields:**
- `name` — identifier for delegation
- `description` — tells Claude when to use this subagent
- `tools` — comma-separated list of allowed tools
- `model` — override session model
- `effort` — override effort level
- `permissions` — scoped permission rules (defaultMode, allow, deny)
- `memory: true` — subagent maintains own auto memory directory

**Preloading Skills into Subagents:**
When a skill has `context: fork` and references a subagent, or when you explicitly delegate to a subagent, you can preload skill files:
```yaml
---
name: my-agent
preloadedSkills:
  - api-conventions    # Loads .claude/skills/api-conventions/SKILL.md
  - test-patterns
---
```

**When to Build Custom Subagents vs. Built-ins:**
- **Use built-ins (Explore, Plan, Task)** for standard workflows — they're optimized and well-understood
- **Build custom** when you need specialized behavior: security review, database migration orchestration, domain-specific expertise, or restricted tool access

**Subagent Context Preservation:**
Subagents load CLAUDE.md from the project but start with a clean conversation context. Their work happens in a separate context window, and only results are summarized and returned to the main session, preserving your main conversation space.

**Sources:**
- [Create custom subagents - Claude Code Docs](https://code.claude.com/docs/en/agents)
- [Agent SDK overview - Claude Code Docs](https://code.claude.com/docs/en/agent-sdk/overview)

**What this means for greenfield Next.js/Supabase/Payload:**
- Define custom subagents for high-leverage workflows:
  - `.claude/agents/schema-auditor.md` — Reads Supabase schema, checks for N+1 queries, indexing, RLS policy compliance
  - `.claude/agents/payload-validator.md` — Validates Payload collection configs, field types, hooks
  - `.claude/agents/api-reviewer.md` — Reviews Next.js API routes for auth, input validation, error handling
- Use `tools: Read, Grep, Glob, Bash(npm test *)` to restrict subagents to safe operations
- Preload skills into custom agents: `.claude/agents/api-reviewer.md` preloads `/api-conventions` skill
- Invoke explicitly: "Use the schema-auditor subagent to review migrations" to delegate with clean context

---

## 4. Hooks System (`.claude/hooks/`)

### Current State (April 2026)

Hooks are deterministic event-driven automation. Unlike CLAUDE.md (advisory), hooks guarantee an action happens.

**Hook Types:**
1. **Command hooks** — Run shell scripts, receive JSON on stdin, return decisions via exit code and stdout
2. **HTTP hooks** — Send JSON via HTTP POST to external services
3. **Prompt hooks** — Ask Claude models yes/no questions
4. **Agent hooks** — Spawn subagents to decide (experimental)

**Hook Events Across Lifecycle:**

| Event | Trigger | Use Case |
|-------|---------|----------|
| `SessionStart` | Session begins/resumes | Initialize environment, set up context via `CLAUDE_ENV_FILE` |
| `InstructionsLoaded` | CLAUDE.md files load | Log/audit which instructions loaded |
| `UserPromptSubmit` | Before Claude processes prompt | Block unsafe requests |
| `PreToolUse` | Before tool executes | Validate/modify tool input, check permissions |
| `PostToolUse` | After successful tool execution | Log results, validate output |
| `PermissionRequest` | Permission dialog appears | Pre-approve or deny programmatically |
| `SubagentStart` / `SubagentStop` | Subagent spawns/exits | Track parallel work |
| `TaskCreated` / `TaskCompleted` | Task lifecycle | Integrate with external systems |
| `ConfigChange` | Settings files change | Reload configuration |
| `CwdChanged` | Working directory changes | Load directory-specific context |
| `FileChanged` | Watched files change | Trigger rebuilds or validation |
| `PreCompact` / `PostCompact` | Context compaction | Log context events |
| `Notification` | Claude Code sends notifications | Custom notification handling |
| `WorktreeCreate` / `WorktreeRemove` | Worktree lifecycle | Custom git worktree logic |
| `Elicitation` / `ElicitationResult` | MCP server requests user input | Log or validate MCP interactions |

**Hook Configuration Location & Scope:**
- `~/.claude/settings.json` — User level, all projects
- `.claude/settings.json` — Project level, shareable via git
- `.claude/settings.local.json` — Project level, local only (gitignored)
- `.claude/hooks/hooks.json` — Plugin scope
- Skill/Agent frontmatter `hooks:` section — While active

**Example: Command Hook**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(rm *)",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/validate-destructive.sh",
            "if": "Bash(rm -rf /)",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

Hook script receives JSON on stdin:
```bash
#!/bin/bash
COMMAND=$(jq -r '.tool_input.command')
if echo "$COMMAND" | grep -q 'rm -rf /'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "System critical directory"
    }
  }'
else
  exit 0
fi
```

**Exit Code Semantics:**
- `0` — Success, parse JSON from stdout
- `2` — Blocking error, stderr shown, action blocked
- Other — Non-blocking error, stderr in transcript, continue

**Decision Types:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask|defer",
    "additionalContext": "context for Claude"
  }
}
```

**Latest Conventions (2026):**
- Use environment variables with `$CLAUDE_PROJECT_DIR`, `${CLAUDE_PLUGIN_ROOT}` for paths
- Enable async hooks with `"async": true` for long-running background tasks
- Set `"asyncRewake": true` to wake Claude when background task completes (exit code 2)
- Disable all hooks with policy: `"disableAllHooks": true`
- HTTP hooks require URLs from `allowedHttpHookUrls` whitelist for security

**Sources:**
- [Claude Code Hooks: Complete Reference](https://code.claude.com/docs/en/hooks)

**What this means for greenfield Next.js/Supabase/Payload:**
- Create `.claude/hooks/hooks.json` with these event handlers:
  - **PreToolUse (Bash)**: Block `rm -rf`, `psql -h ` (production DB), and shell escapes
  - **PostToolUse (Edit on .env)**: Validate environment variable format, warn on secrets in code
  - **PreToolUse (Write on migrations)**: Check migration is timestamped and follows naming convention
  - **PostToolUse (Bash npm)**: Log test/build results for audit trail
- Use command hooks for deterministic blocking: "Prevent destructive operations on production"
- Use prompt hooks for advisory decisions: "Should this Bash command run with sudo?"
- Enable async hook for long-running migrations: `"async": true`, `"asyncRewake": true`

---

## 5. Slash Commands and Custom Commands

### Current State (April 2026)

Slash commands are unified with the skills system. A file at `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy` and work identically. The `.claude/commands/` pattern is deprecated; skills are the canonical extension point.

**Command Invocation:**
- Built-in commands: `/help`, `/config`, `/model`, `/effort`, `/memory`, `/init`, `/review`, `/security-review`, `/compact`, `/rewind`, `/rename`, `/hooks`, `/permissions`, `/status`, `/sandbox`
- Bundled skills (prompt-based): `/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api`
- Custom (via skills): `/your-skill-name`

**Built-in Argument Expansion:**
- `/model sonnet` — Switch model
- `/effort high` — Adjust thinking depth (low, medium, high, xhigh, max)
- `/effort` (no args) — Interactive slider with arrow-key navigation (April 2026 addition)
- `/loop 5m /skill-name` — Repeat skill every 5 minutes (cron scheduling)
- `/compact` — Summarize conversation to free context

**Custom Command / Skill Creation:**
Skills inherit all command capabilities plus extended frontmatter. Create `.claude/skills/my-command/SKILL.md` with:
```yaml
---
name: my-command
description: What this does
argument-hint: "[filename] [format]"
arguments: [file, format]
disable-model-invocation: true  # Manual-only
allowed-tools: Bash(npm *), Read
---

Do something with $file in $format.
```

Invoke with `/my-command src/index.ts json` — arguments substitute via `$0`, `$1`, or `$file`, `$format`.

**Discovery:**
Run `/` in the terminal to see all available commands and skills. Skills are discovered automatically from `.claude/skills/*/SKILL.md` and personal `~/.claude/skills/`.

**Sources:**
- [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills)

**What this means for greenfield Next.js/Supabase/Payload:**
- Don't create custom commands separately. Build `.claude/skills/` instead, which provides richer features (frontmatter, hooks, argument substitution)
- Create project-specific commands as skills:
  - `/seed-db` — Seed Supabase with test data (disable-model-invocation: true, allowed-tools: Bash(psql *))
  - `/generate-types` — Generate TypeScript types from Payload schema (paths: "types/**")
  - `/audit-permissions` — Check RLS policies on all Supabase tables
- Invoke via `/` autocomplete or programmatically through the Skill tool

---

## 6. Settings (`.claude/settings.json`, `.claude/settings.local.json`)

### Current State (April 2026)

Settings use a hierarchical precedence system. Each layer overrides lower layers; array settings (allow, deny, ask, paths) merge across layers.

**Precedence (highest to lowest):**
1. Managed settings (IT-deployed, system-wide)
2. Command-line arguments
3. Local project settings (`.claude/settings.local.json`)
4. Shared project settings (`.claude/settings.json`)
5. User settings (`~/.claude/settings.json`)

**Key Fields:**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  
  // Agent & Model
  "model": "claude-opus-4-7",
  "availableModels": ["sonnet", "haiku"],
  "effortLevel": "high",
  "alwaysThinkingEnabled": true,
  
  // Permissions
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": ["Bash(npm run *)", "Read(./)"],
    "deny": ["Bash(curl *)", "Read(.env*)"],
    "ask": ["Bash(git push *)"],
    "additionalDirectories": ["../shared"],
    "disableBypassPermissionsMode": "disable"
  },
  
  // Sandbox
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowWrite": ["/tmp", "~/projects"],
      "denyRead": ["~/.aws/credentials"]
    },
    "network": {
      "allowedDomains": ["api.example.com"],
      "deniedDomains": ["internal.corp"]
    }
  },
  
  // Environment
  "env": {
    "NEXT_PUBLIC_API_URL": "http://localhost:3000"
  },
  "apiKeyHelper": "~/.claude/generate-api-key.sh",
  
  // Memory
  "autoMemoryEnabled": true,
  "autoMemoryDirectory": "~/.claude/memory",
  
  // Plugins & Marketplaces
  "enabledPlugins": {
    "swift-lsp@claude-plugins-official": true,
    "my-plugin@team": true
  },
  "extraKnownMarketplaces": {
    "team-tools": {
      "source": { "source": "github", "repo": "our-org/plugins" }
    }
  },
  
  // MCP Servers
  "allowedMcpServers": [{ "serverName": "memory" }],
  "enabledMcpjsonServers": ["memory", "github"]
}
```

**Permission Modes:**
- `default` — Prompt for each action
- `acceptEdits` — Auto-approve edits, prompt others
- `plan` — Require plan approval first
- `auto` — AI classifier decides (eliminates prompts)
- `dontAsk` — Don't prompt for pre-approved actions
- `bypassPermissions` — Skip all checks (risky, use sparingly)

**Permission Rule Syntax:**
```json
{
  "allow": [
    "Bash",                    // All bash
    "Bash(npm run *)",         // Pattern matching
    "Bash(git commit *)",
    "Read(./.env)",
    "Edit(./src/**)",
    "WebFetch(domain:api.example.com)",
    "MCP(github)",             // MCP servers
    "Skill(deploy *)",         // Specific skills
    "Agent(security-reviewer)" // Specific agents
  ],
  "deny": [
    "Bash(curl *)",
    "Read(.env*)",
    "WebFetch"
  ],
  "ask": [
    "Bash(git push *)"
  ]
}
```

**MCP Server Configuration:**
```json
{
  "mcpServers": {
    "supabase": {
      "type": "stdio",
      "command": "npx",
      "args": ["@supabase/mcp-server-supabase@latest"]
    },
    "github": {
      "type": "stdio",
      "command": "gh",
      "args": ["code-search"]
    }
  }
}
```

**Environment Variable Expansion:**
```json
{
  "env": {
    "SUPABASE_PROJECT_ID": "xvvdxmmtscwvlhmhlski",
    "SUPABASE_KEY": "$SUPABASE_API_KEY"  // Loaded from shell env
  }
}
```

**Hooks Configuration:**
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/validate.sh",
        "timeout": 30
      }]
    }],
    "SessionStart": [{
      "matcher": "*",
      "hooks": [{
        "type": "prompt",
        "prompt": "Ready to code?",
        "model": "claude-opus-4-7"
      }]
    }]
  }
}
```

**Sources:**
- [Claude Code Configuration Reference - Claude Code Docs](https://code.claude.com/docs/en/settings)

**What this means for greenfield Next.js/Supabase/Payload:**
- Create `.claude/settings.json` (committed):
  ```json
  {
    "model": "claude-opus-4-7",
    "effortLevel": "high",
    "permissions": {
      "defaultMode": "acceptEdits",
      "allow": [
        "Bash(npm run *)",
        "Bash(pnpm *)",
        "Bash(git *)",
        "Bash(psql -h localhost *)"
      ],
      "deny": [
        "Bash(curl *)",
        "Read(.env*)",
        "Read(.env.local)"
      ]
    },
    "enabledMcpjsonServers": ["memory"],
    "autoMemoryEnabled": true
  }
  ```
- Create `.claude/settings.local.json` (gitignored, personal):
  ```json
  {
    "env": {
      "SUPABASE_PASSWORD": "your-local-password",
      "DATABASE_URL": "postgresql://localhost/dev"
    }
  }
  ```
- Use permission rules to auto-approve npm/pnpm/git but block destructive operations
- Enable MCP servers for domain-specific tools: `"enabledMcpjsonServers": ["supabase", "github", "memory"]`

---

## 7. Plugins & Marketplace

### Current State (April 2026)

Claude Code plugins are distributed packages that bundle skills, subagents, hooks, and MCP servers. The official Anthropic marketplace (`claude-plugins-official`) is available by default.

**Plugin Installation:**
```bash
/plugin                           # Open marketplace UI
/plugin install 5@claude-plugins-official  # Install by number
/plugin install sharp-intellisense@claude-plugins-official  # By name
claude mcp add playwright npx @playwright/mcp@latest  # MCP server direct
```

**Marketplace Sources:**
- **Official**: `@claude-plugins-official` (Anthropic-managed)
- **GitHub repo**: `{ "source": "github", "repo": "org/plugins" }`
- **Git URL**: `{ "source": "git", "url": "https://github.com/..." }`
- **NPM package**: `{ "source": "npm", "package": "@org/plugins" }`
- **URL**: `{ "source": "url", "url": "https://example.com/plugins.json" }`
- **Local**: `{ "source": "file", "path": "/path/to/plugins.json" }`

**Adding Community Marketplaces:**
```json
{
  "extraKnownMarketplaces": {
    "team-tools": {
      "source": { "source": "github", "repo": "our-org/claude-plugins" }
    }
  }
}
```

**Plugin Structure:**
```text
my-plugin/
├── plugin.json
├── skills/
│   ├── skill1/SKILL.md
│   └── skill2/SKILL.md
├── agents/
│   └── custom-agent.md
├── hooks/
│   └── hooks.json
└── mcp-servers.json
```

**Publishing:**
Submit to official marketplace via `/plugin` → **Publish** tab or at `platform.claude.com/plugins/submit`. Community plugins are shared via GitHub repositories.

**Notable Official Plugins (April 2026):**
- **Code Intelligence** (TypeScript, Swift, Go) — Symbol navigation, error detection
- **swift-lsp** — Swift language support
- **Playwright MCP** — Browser automation
- **Supabase MCP** — Database access

**Sources:**
- [Discover and install prebuilt plugins - Claude Code Docs](https://code.claude.com/docs/en/discover-plugins)
- [GitHub - anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

**What this means for greenfield Next.js/Supabase/Payload:**
- Check the official marketplace for **TypeScript/Next.js intelligence** plugins (auto-error detection after edits)
- Consider installing **Playwright MCP** for browser automation testing
- Look for **Supabase MCP** plugins if available for direct database queries
- Build internal team plugins for Payload-specific skills if you have domain-specific patterns
- Start with official marketplace; add team/community repos via `extraKnownMarketplaces` as needed

---

## 8. MCP Servers Configuration

### Current State (April 2026)

MCP (Model Context Protocol) servers extend Claude's tool access to external systems. Configuration happens in `.mcp.json` or `.claude/settings.json`.

**Official MCP Servers Relevant to Next.js/Supabase/Payload:**

| Server | Purpose | Config |
|--------|---------|--------|
| **Supabase MCP** | Query, migrate Supabase | `npx @supabase/mcp-server-supabase@latest` |
| **Playwright MCP** | Browser automation | `npx @playwright/mcp@latest` |
| **GitHub MCP** | Access repositories, issues, PRs | `gh code-search` or `npx @anthropic/mcp-github` |
| **Memory MCP** | Persistent note-taking | Built-in |
| **Filesystem MCP** | Safe file operations | Built-in |

**Configuration in `.mcp.json`:**
```json
{
  "mcpServers": {
    "supabase": {
      "type": "stdio",
      "command": "npx",
      "args": ["@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "$SUPABASE_TOKEN",
        "SUPABASE_PROJECT_ID": "xvvdxmmtscwvlhmhlski"
      }
    },
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "github": {
      "type": "stdio",
      "command": "gh",
      "args": ["code-search"]
    }
  }
}
```

**Environment Variables:**
Use `$VAR_NAME` syntax for shell environment variable expansion. Secrets should be stored in shell env, not in settings.json.

**Authentication:**
- **Supabase**: Generate personal access token at `supabase.com/dashboard/account/tokens` (set `SUPABASE_ACCESS_TOKEN`)
- **GitHub**: Use `gh` CLI (auto-authenticated) or provide GitHub token
- **Playwright**: No auth required for local browser control

**Permissions & Allowlisting:**
```json
{
  "allowedMcpServers": [
    { "serverName": "supabase" },
    { "serverName": "memory" }
  ],
  "deniedMcpServers": [
    { "serverName": "filesystem" }
  ]
}
```

**MCP Tool Naming:**
MCP tools are prefixed `mcp__<server>__<tool>`. Permissions can be scoped:
```json
{
  "allow": ["mcp__supabase__*"],
  "deny": ["mcp__github__push *"]
}
```

**Best Practices (2026):**
- **Disable MCP servers you don't use** to reduce context overhead and startup time
- **Use `--read-only` mode for Supabase** to prevent accidental schema changes
- **Authenticate via shell environment**, not hardcoded in settings
- **Whitelist MCP servers in permissions** to prevent unauthorized access

**Sources:**
- [Model context protocol (MCP) - Supabase Docs](https://supabase.com/docs/guides/getting-started/mcp)
- [How to Set Up Supabase MCP in Claude Code in 3 Minutes](https://shinzo.ai/blog/how-to-set-up-supabase-mcp-in-claude-code)
- [Claude Code MCP Servers: How to Connect, Configure, and Use Them](https://www.builder.io/blog/claude-code-mcp-servers)

**What this means for greenfield Next.js/Supabase/Payload:**
- Create `.mcp.json` in project root:
  ```json
  {
    "mcpServers": {
      "supabase": {
        "type": "stdio",
        "command": "npx",
        "args": ["@supabase/mcp-server-supabase@latest"],
        "env": {
          "SUPABASE_ACCESS_TOKEN": "$SUPABASE_ACCESS_TOKEN",
          "SUPABASE_PROJECT_ID": "your-project-id"
        }
      },
      "memory": {
        "type": "stdio",
        "command": "memory-mcp"
      }
    }
  }
  ```
- Add to `.claude/settings.json`:
  ```json
  {
    "enabledMcpjsonServers": ["supabase", "memory"],
    "allowedMcpServers": [
      { "serverName": "supabase" },
      { "serverName": "memory" }
    ]
  }
  ```
- Store `SUPABASE_ACCESS_TOKEN` in shell environment or `.env.local` (gitignored)
- Optional: Add Playwright MCP for automated visual regression testing

---

## 9. Memory & Auto Memory

### Current State (April 2026)

Claude Code has two memory systems:
1. **CLAUDE.md files** — You write instructions that persist
2. **Auto memory** — Claude writes notes itself based on learnings

Both load at session start. Auto memory is enabled by default as of v2.1.59+.

**CLAUDE.md Loading Hierarchy:**
```
Managed policy CLAUDE.md (IT)
  ↓
~/.claude/CLAUDE.md (user, all projects)
  ↓
./CLAUDE.md or ./.claude/CLAUDE.md (project root)
  ↓
./CLAUDE.local.md (project local, gitignored)
  ↓
Nested: subdirectory CLAUDE.md files (on-demand)
```

Each level is concatenated; conflicts are resolved by lowest layer winning (local > project > user > managed, except managed cannot be overridden).

**Auto Memory Storage:**
```
~/.claude/projects/<project-hash>/memory/
├── MEMORY.md            # Index (first 200 lines or 25KB loaded per session)
├── debugging.md         # Topic files
├── patterns.md
├── api-decisions.md
└── ...
```

The `<project-hash>` is derived from git repository. All worktrees and subdirectories in the same repo share one auto memory directory.

**Auto Memory Control:**
```json
{
  "autoMemoryEnabled": true,
  "autoMemoryDirectory": "~/.claude/memory"  // Custom location
}
```

Or via environment variable:
```bash
CLAUDE_CODE_DISABLE_AUTO_MEMORY=1 claude  # Disable
```

**How Auto Memory Works:**
Claude saves notes when it discovers patterns, debugging insights, build commands, preferences, or code patterns you correct it on. Only the first 200 lines (or 25KB) of `MEMORY.md` load at startup; detailed topic files are read on-demand.

Claude keeps `MEMORY.md` concise by moving details to topic files and updating the index:
```markdown
# Memory Index

- **Build**: pnpm. See build.md
- **Testing**: Jest with @testing-library. See testing.md
- **API patterns**: REST with pagination. See api-conventions.md
```

**Viewing & Editing Memory:**
```bash
/memory  # Opens interactive memory browser
```

Lists all loaded CLAUDE.md, CLAUDE.local.md, and rules files. Shows auto memory toggle and folder link.

**Compaction & Memory Survival:**
After auto-compaction, project-root CLAUDE.md is re-read from disk and re-injected. Nested CLAUDE.md files reload when Claude works with matching directories. Auto memory persists; topic files are never auto-injected during compaction but remain available for on-demand reads.

**Exclude CLAUDE.md Files:**
For large monorepos, skip irrelevant ancestor CLAUDE.md:
```json
{
  "claudeMdExcludes": [
    "**/monorepo-root/CLAUDE.md",
    "**/other-team/.claude/rules/**"
  ]
}
```

**Sources:**
- [How Claude remembers your project - Claude Code Docs](https://code.claude.com/docs/en/memory)

**What this means for greenfield Next.js/Supabase/Payload:**
- Commit `./CLAUDE.md` with project-shared instructions
- Create `.claude/rules/` subdirectory for scope-specific rules:
  - `rules/frontend.md` — paths: `"app/**", "components/**"`
  - `rules/api.md` — paths: `"app/api/**"`
  - `rules/database.md` — paths: `"lib/db/**", "migrations/**"`
- Auto memory will accumulate build commands, testing patterns, and debugging notes across sessions without manual effort
- Run `/memory` weekly to review what Claude learned and adjust CLAUDE.md if needed
- Disable auto memory only in CI/automation environments where you don't want session-specific learnings

---

## 10. Output Styles

### Current State (April 2026)

Output styles control how Claude Code formats responses in the terminal. You can override the entire system prompt.

**Built-in Output Styles:**
- **Default/Concise** — Fast, direct, focuses on getting code done. No extra explanation.
- **Explanatory** — Includes reasoning, design trade-offs, and insights as it works
- **Learning** — Pair-programmer mode, steps through concepts so you learn alongside

**Creating Custom Output Styles:**
```bash
/output-style new
```

Claude scaffolds a markdown file where you describe your desired behavior. Example:
```markdown
# Caveman Mode
- Use short sentences (under 10 words)
- Skip explanations; just show code
- List steps as numbered bullets
- Always end with "done."
```

**Configuration:**
```json
{
  "outputStyle": "Explanatory",  // Built-in or custom name
  "showThinkingSummaries": true  // When thinking is used
}
```

Or set per-session:
```bash
claude --output-style "Caveman"
```

**Known Limitations (April 2026):**
Custom output style guidance on tone/style can be overridden by Claude's base training. Instructions about *what to do* (structure, content) are honored; instructions about *how to say it* (verbose, terse, celebratory) may not fully apply.

**Sources:**
- [Output styles - Claude Code Docs](https://code.claude.com/docs/en/output-styles)

**What this means for greenfield Next.js/Supabase/Payload:**
- Use **Explanatory** style during initial feature development to understand architectural decisions
- Switch to **Concise** for rapid iteration and bug fixes
- Create a custom style for your team if you have strong preferences (e.g., "API-first: explain endpoints, always show types")
- Set default in `.claude/settings.json`: `"outputStyle": "Explanatory"`

---

## 11. Fast Mode, Thinking, Extended Thinking

### Current State (April 2026)

Claude Code supports adaptive thinking (which replaced extended thinking's manual budget controls). Effort levels control thinking depth.

**Effort Levels:**
```bash
/effort                    # Interactive slider (new in April 2026)
/effort low               # Fast mode, minimal thinking
/effort medium            # Balanced (default)
/effort high              # Deep thinking
/effort xhigh             # Deeper (new, April 2026, Opus 4.7 only)
/effort max               # Maximum thinking (expensive)
```

**Behavior:**
Effort is a *suggestion*, not a command. If a problem is complex enough, Claude will think regardless of effort level.

**Adaptive Thinking:**
Claude automatically uses extended thinking when the request requires deep analysis. You don't set a budget; Claude decides internally whether to think and for how long.

**Trigger Keywords:**
Include phrases like:
- "think harder"
- "ultrathink"
- "think step by step"
- "analyze deeply"

These signal Claude to engage extended thinking for complex requests.

**In Skills:**
To enable extended thinking in a skill, include the word "ultrathink" anywhere in the skill content:
```yaml
---
name: deep-research
description: Ultrathink through complex problems
---

Analyze this ultrathink request thoroughly...
```

**Settings:**
```json
{
  "alwaysThinkingEnabled": true,
  "effortLevel": "high"
}
```

Or per-session:
```bash
claude --effort xhigh
```

**Sources:**
- [Building with extended thinking - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Extended thinking tips - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips)

**What this means for greenfield Next.js/Supabase/Payload:**
- Use `/effort low` for routine edits (rename variable, add log line, fix typo)
- Use `/effort medium` (default) for most feature work
- Use `/effort high` for complex architectural decisions, security reviews, optimization
- Create skills with "ultrathink" keyword for high-stakes workflows:
  - `.claude/skills/schema-audit.md` — "ultrathink through schema design"
  - `.claude/skills/security-review.md` — "ultrathink about security implications"

---

## 12. Worktrees & Parallel Agents

### Current State (April 2026)

Native git worktree support landed in Claude Code v2.1.49 (February 2026). Each worktree gets its own isolated branch and context.

**Worktree Creation:**
```bash
claude --worktree bugfix          # Create worktree, isolated session
claude --worktree feature-oauth   # Another parallel session
claude                            # Main session (main branch)
```

Worktrees are stored at `.claude/worktrees/<name>/`.

**Isolation Mode:**
Subagents can request isolation:
```bash
claude --use-worktree            # Force subagents into worktrees
```

When a subagent creates child agents, each gets its own worktree automatically.

**Worktree Configuration:**
```json
{
  "worktree": {
    "symlinkDirectories": ["node_modules", ".cache"],  // Share these (symlink)
    "sparsePaths": ["packages/my-app", "shared/"]      // Only checkout these paths
  }
}
```

**Auto-Cleanup:**
Worktrees with no changes are cleaned up automatically after the session ends. Worktrees with uncommitted changes persist for review.

**Parallel Session Pattern:**
Run multiple Claude sessions in parallel:
```bash
# Terminal 1: Bug fix
claude --worktree fix-auth

# Terminal 2: Feature development
claude --worktree feature-payment

# Terminal 3: Documentation
claude --worktree docs
```

Each session is independent; changes don't interfere.

**Best Practices:**
- Use worktrees for long-running independent tasks (features, bug fixes, documentation)
- Don't use for small one-off fixes (overhead not worth it)
- Commit frequently in each worktree to avoid large diffs to merge
- Use `/review` in main session to review worktree PRs before merging

**Sources:**
- [Claude Code Worktrees: Parallel Sessions Without Conflicts](https://claudefa.st/blog/guide/development/worktree-guide)
- [Claude Code Worktree Explained: Setup & Parallel Agents](https://www.verdent.ai/guides/claude-code-worktree-setup-guide)

**What this means for greenfield Next.js/Supabase/Payload:**
- Use worktrees for parallel development:
  - `claude --worktree schema-migration` — Supabase schema changes
  - `claude --worktree api-v2` — New API endpoints
  - `claude --worktree ui-redesign` — Frontend components
- Configure sparse checkout for monorepo efficiency: only checkout your package
- Commit changes in each worktree, then use main session to review and merge via `/review`

---

## 13. Tasks, Todos, Plans

### Current State (April 2026)

Claude Code has three task systems:
1. **In-conversation tasks** — Todo checklists that appear inline
2. **Plans** (Plan Mode) — Explicit design review before implementation
3. **Structured plans** (Ultraplan, early preview) — Cloud-based plan drafting and review

**In-Conversation Todos:**
Claude can create task checklists using the `TodoWrite` tool:
```
1. [ ] Read schema files
2. [ ] Design migration strategy
3. [ ] Write migration SQL
4. [ ] Test rollback
```

These appear in the terminal UI and update in real-time as Claude works.

**Plan Mode Workflow:**
```bash
/plan
# Claude reads files without making changes
# You ask: "Create a migration plan for adding OAuth"
# Claude outputs structured plan
# Press Ctrl+G to open plan in editor
# Edit, discuss, refine
# Approve with /exit-plan or Ctrl+E
```

**ExitPlanMode:**
When you approve a plan, `ExitPlanMode` is called. Claude switches to your `defaultMode` (usually `bypassPermissions`) and begins implementation.

A GitHub issue from Feb 2026 proposes converting approved plans into tasks so they participate in dependency chains and progress tracking.

**Ultraplan (Early Preview, March 31 2026):**
Draft plans in the cloud, review in a web editor, run remotely or pull back local:
```bash
/ultraplan
# Opens web interface to draft plan collaboratively
# Can comment, iterate, then execute
```

Ultraplan is available for Opus 4.7 users via `/ultraplan`.

**Sources:**
- [Claude Code overview - Claude Code Docs](https://code.claude.com/docs/en/overview)
- [Claude Code Ultraplan: Cloud Planning to Free Your Terminal](https://claudefa.st/blog/guide/mechanics/ultraplan)

**What this means for greenfield Next.js/Supabase/Payload:**
- Use **Plan Mode** for large architectural changes:
  - Schema redesign
  - API versioning
  - Major refactoring
- Use **in-conversation todos** for tracking steps within a feature
- Use **Ultraplan** for team-collaborative planning on complex migrations or launches
- Create a `/plan-schema-migration` skill to automate plan creation for database work

---

## 14. Permissions System

### Current State (April 2026)

Permissions control what tools Claude can access. Rules are flexible and composable.

**Permission Modes:**
- `default` — Prompt for each action (interactive)
- `acceptEdits` — Auto-approve edits, prompt others
- `plan` — Require plan approval before any changes
- `auto` — Classifier model decides (eliminates prompts, with fallback)
- `dontAsk` — Don't prompt for pre-approved actions
- `bypassPermissions` — Skip all checks (use in trusted environments)

**Rules Syntax:**
```json
{
  "allow": [
    "Bash(npm run *)",
    "Bash(pnpm *)",
    "Edit(./src/**)",
    "Read(.)",
    "WebFetch(domain:api.example.com)"
  ],
  "deny": [
    "Bash(curl *)",
    "Bash(rm -rf *)",
    "Read(.env*)",
    "Read(~/.ssh/**)"
  ],
  "ask": [
    "Bash(git push *)"
  ]
}
```

**Wildcard Patterns:**
- `Tool` — All operations
- `Tool(pattern)` — Pattern matching (supports `*`)
- `Tool(domain:example.com)` — Domain-scoped (WebFetch)

**Skill-Specific Permissions:**
A skill can pre-approve tools while active:
```yaml
---
name: test-runner
allowed-tools: Bash(npm test), Bash(npm run test:*)
---
```

**Sandboxing:**
Enable OS-level isolation:
```json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowWrite": ["/tmp", "./"],
      "denyRead": ["~/.aws/credentials"]
    },
    "network": {
      "allowedDomains": ["api.example.com"]
    }
  }
}
```

**Auto Mode (AI Classifier):**
```bash
claude --permission-mode auto -p "fix all lint errors"
```

A separate model reviews commands before execution. It blocks scope escalation, unknown infrastructure, and hostile patterns while allowing routine work.

**Fallback Behavior:**
If auto mode repeatedly blocks actions and there's no user interaction (non-interactive `-p` mode), it aborts.

**Sources:**
- [Claude Code Configuration Reference - Claude Code Docs](https://code.claude.com/docs/en/settings)

**What this means for greenfield Next.js/Supabase/Payload:**
- Set `.claude/settings.json`:
  ```json
  {
    "permissions": {
      "defaultMode": "acceptEdits",
      "allow": [
        "Bash(npm run *)",
        "Bash(pnpm *)",
        "Bash(git add *)",
        "Bash(git commit *)",
        "Edit(./)",
        "Read(.)"
      ],
      "deny": [
        "Bash(curl *)",
        "Bash(rm -rf *)",
        "Read(.env*)",
        "Read(~/.ssh/**)"
      ]
    }
  }
  ```
- Use `acceptEdits` mode to auto-approve file changes while still prompting for risky operations (git push, rm)
- Enable sandbox for automated CI environments
- Use auto mode for non-interactive runs: `claude -p "migrate schema" --permission-mode auto`

---

## 15. Project Structure Conventions

### Current State (April 2026)

The canonical Claude Code project anatomy combines CLAUDE.md hierarchy with `.claude/` configuration and nested structures for monorepos.

**Canonical Single-Package Layout:**
```
your-project/
├── CLAUDE.md                    # Project instructions (committed)
├── CLAUDE.local.md              # Personal overrides (gitignored)
├── README.md
├── package.json
├── src/
│   ├── index.ts
│   └── utils/
│       └── CLAUDE.md            # Utilities-specific instructions (on-demand)
├── tests/
├── .claude/
│   ├── settings.json            # Project settings (committed)
│   ├── settings.local.json      # Local overrides (gitignored)
│   ├── CLAUDE.md                # Alternative to root CLAUDE.md
│   ├── rules/
│   │   ├── code-style.md
│   │   ├── testing.md
│   │   └── api-design.md
│   ├── skills/
│   │   ├── deploy/SKILL.md
│   │   ├── test-components/SKILL.md
│   │   └── audit-schema/SKILL.md
│   ├── agents/
│   │   ├── security-reviewer.md
│   │   └── schema-auditor.md
│   ├── hooks/
│   │   ├── hooks.json
│   │   └── scripts/
│   │       └── validate-destructive.sh
│   └── output-styles/
│       └── my-style.md
├── .git/
└── .gitignore                   # Includes .claude/settings.local.json, CLAUDE.local.md
```

**Monorepo Layout:**
```
monorepo-root/
├── CLAUDE.md                    # Root: shared conventions
├── pnpm-workspace.yaml
├── packages/
│   ├── frontend/
│   │   ├── CLAUDE.md            # Frontend-specific (loaded on-demand)
│   │   ├── .claude/
│   │   │   ├── skills/
│   │   │   │   ├── component-gen/SKILL.md
│   │   │   │   └── storybook/SKILL.md
│   │   │   └── rules/
│   │   │       └── react.md
│   │   ├── components/
│   │   ├── pages/
│   │   └── package.json
│   ├── backend/
│   │   ├── CLAUDE.md            # Backend-specific
│   │   ├── .claude/
│   │   │   ├── skills/
│   │   │   │   ├── migrate/SKILL.md
│   │   │   │   └── endpoint/SKILL.md
│   │   │   └── rules/
│   │   │       └── api-design.md
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   └── middleware/
│   │   └── package.json
│   └── shared/
│       ├── CLAUDE.md            # Shared utilities
│       ├── src/
│       │   ├── types/
│       │   └── utils/
│       └── package.json
├── .claude/
│   ├── settings.json            # Workspace-level settings
│   ├── rules/
│   │   ├── git-workflow.md
│   │   └── monorepo-structure.md
│   └── skills/
│       ├── workspace-check/SKILL.md
│       └── monorepo-test/SKILL.md
└── .git/
```

**Best Practices:**
- **Root CLAUDE.md**: Monorepo structure, shared conventions, common build/test commands
- **Package CLAUDE.md**: Framework-specific rules, framework conventions, package-local workflows
- **.claude/rules/**: Scope rules to paths so instructions load only when relevant
- **.claude/skills/**: Shared skills at root; package-specific skills in packages/
- **Settings**: Store shared settings at `.claude/settings.json` (workspace root); local overrides in `.claude/settings.local.json`

**Sources:**
- [Best Practices for Claude Code - Claude Code Docs](https://code.claude.com/docs/en/best-practices)
- [Anatomy of the .claude Folder - Every File Explained (2026)](https://codewithmukesh.com/blog/anatomy-of-the-claude-folder/)

**What this means for greenfield Next.js/Supabase/Payload:**
```
sen-react/ (or your project name)
├── CLAUDE.md                        # "Next.js 16, Supabase, Payload CMS"
├── pnpm-workspace.yaml              # If monorepo structure
├── packages/
│   ├── web/                         # Next.js app
│   │   ├── CLAUDE.md                # Next.js + App Router specifics
│   │   ├── .claude/skills/
│   │   │   ├── page-gen/SKILL.md
│   │   │   └── component-gen/SKILL.md
│   │   ├── app/
│   │   ├── components/
│   │   └── package.json
│   ├── cms/                         # Payload admin
│   │   ├── CLAUDE.md                # Payload collection, field, hook patterns
│   │   ├── .claude/skills/
│   │   │   ├── collection-gen/SKILL.md
│   │   │   └── field-gen/SKILL.md
│   │   ├── src/collections/
│   │   ├── src/fields/
│   │   └── package.json
│   └── shared/                      # Types, utils
│       ├── CLAUDE.md
│       ├── src/types/
│       └── package.json
├── .claude/
│   ├── settings.json
│   ├── rules/
│   │   ├── monorepo.md              # "Use pnpm, workspace structure"
│   │   ├── database.md              # "Supabase migrations, RLS patterns"
│   │   └── api-endpoints.md         # "Next.js API route conventions"
│   └── skills/
│       ├── schema-migrate/SKILL.md
│       ├── seed-data/SKILL.md
│       └── type-gen/SKILL.md
└── .git/
```

---

## 16. Multi-Agent Dispatch & Orchestration

### Current State (April 2026)

Agent teams are an **experimental feature** (disabled by default) that coordinate multiple Claude Code sessions working on a shared codebase.

**Enabling Agent Teams:**
```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude
```

Or via settings:
```json
{
  "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
}
```

**Architecture:**
- **Team Lead**: One session that coordinates work, assigns tasks, synthesizes results
- **Teammates**: Independent sessions (each with own context window) working on assigned tasks
- **Communication**: Teammates message the lead automatically; system manages task dependencies

**Task Handoff Pattern:**
```
Lead: "I need three things done in parallel:
  1. Refactor authentication flow
  2. Add OAuth integration
  3. Write integration tests"

Agent Team automatically:
- Creates worktree for each task
- Assigns to available teammates
- Manages dependency ordering
- Synthesizes results back to lead
```

**Parallel Session Capabilities:**
The stress test: 16 agents built a 100,000-line Rust C compiler from scratch over ~2,000 sessions and $20k API cost. Demonstrated:
- Multi-file edits across layers (frontend, backend, tests)
- Competing hypotheses in parallel
- Cross-layer coordination
- Automatic dependency resolution

**Best Use Cases:**
- **Research & review**: Multiple teammates investigate different aspects, share findings
- **New modules**: Each teammate owns a separate piece without conflict
- **Competing hypotheses**: Test different theories in parallel, converge faster
- **Cross-layer**: Changes spanning frontend, backend, tests (each teammate owns one)

**Limitations (April 2026):**
- Experimental, API may change
- Not recommended for tightly-coupled work
- Works best with clear task boundaries

**Related Tool: TaskCreate / CronCreate:**
For simpler scheduling without agent teams:
```bash
claude --cron "0 0 * * *" -p "Run nightly tests"  # Cron expression
```

Underlying tools: `CronCreate`, `CronList`, `CronDelete`.

**Sources:**
- [Orchestrate teams of Claude Code sessions - Claude Code Docs](https://code.claude.com/docs/en/agent-teams)
- [Claude Code Agent Teams: Setup & Usage Guide 2026](https://claudefa.st/blog/guide/agents/agent-teams)
- [Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)

**What this means for greenfield Next.js/Supabase/Payload:**
- **Don't use agent teams initially** — stick to single-session or worktree patterns during MVP
- **Consider for large refactors** after MVP: "Refactor payment flow, auth, and tests in parallel"
- **TaskCreate / CronCreate** are more relevant for automation: nightly migrations, scheduled data backups
- When ready to scale: enable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` and run:
  ```
  I need three things done in parallel:
  1. Migrate user schema to support OAuth
  2. Implement OAuth endpoints
  3. Write OAuth integration tests
  ```

---

## 17. Background Agents / Daemons / Crons

### Current State (April 2026)

Three mechanisms enable background automation:

**1. `/loop` Command (Cron Scheduling):**
```bash
/loop 5m /skill-name         # Run skill every 5 minutes
/loop daily /seed-db         # Run daily
/loop "0 0 * * 0" /backup    # Cron expression (Sundays at midnight)
```

Underlying tools: `CronCreate`, `CronList`, `CronDelete`. Max 50 scheduled tasks per session.

**2. Remote Tasks (Cloud-Hosted, March 20 2026):**
Push a prompt to Anthropic cloud, run on schedule:
```bash
/remote-task
# Opens web UI
# Define repo, prompt, schedule
# Claude runs autonomously on cloud infrastructure
```

Remote tasks are part of the broader "Chyros" daemon architecture (code name for background worker system).

**3. TaskCreate Tool:**
For multi-agent orchestration, create structured tasks:
```
TaskCreate {
  name: "Migrate schema",
  description: "...",
  assignee: "teammate1",
  dueDate: "2026-05-01",
  dependencies: ["task2"]
}
```

**Daemon Architecture ("Chyros"):**
Leaked source code (March 31 2026) revealed Claude Code's planned persistent daemon. Not yet public-facing, but signals:
- Always-on background processes
- True asynchronous work (don't need human babysitting)
- GitHub Actions integration planned
- 44 feature flags in development

**Auto-Retry & Async Hooks:**
Hooks can be async with rewake:
```json
{
  "type": "command",
  "command": "long-running-task.sh",
  "async": true,
  "asyncRewake": true  // Wake Claude when done (exit code 2)
}
```

**Sources:**
- [Claude Code Scheduled Tasks: Complete Setup Guide (2026)](https://claudefa.st/blog/guide/development/scheduled-tasks)
- [Claude Code Remote Tasks: Run AI Agents 24/7](https://www.computeleap.com/blog/claude-code-remote-tasks-cloud-ai-agents-2026/)

**What this means for greenfield Next.js/Supabase/Payload:**
- **During development**: Use `/loop` for regular tasks:
  ```bash
  /loop 6h /test-suite        # Run tests every 6 hours
  /loop daily /seed-test-data # Reset test data nightly
  ```
- **For production**: Use Remote Tasks (when available):
  - Nightly schema backups
  - Weekly health checks
  - Monthly cleanup jobs
- **Avoid** daemon mode for MVP; keep critical work explicit and human-supervised
- **Create skills** for background work: `/backup-db`, `/health-check`, `/cleanup-stale-sessions`

---

## 18. Claude Agent SDK

### Current State (April 2026)

The Claude Agent SDK (TypeScript and Python) lets you programmatically build AI agents with Claude Code's capabilities, without needing the CLI.

**SDK Availability:**
- **TypeScript**: [@anthropic-ai/claude-agent-sdk](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)
- **Python**: [claude-agent-sdk](https://pypi.org/project/claude-agent-sdk/)

**Recent Updates (April 2026):**
- **SessionStore Support** (Python parity with TypeScript): Persist sessions across runs, resume agents
- **Distributed Tracing**: W3C trace context propagation to CLI subprocess (OpenTelemetry integration)
- **Auto Permission Mode**: PermissionMode type now includes "auto"

**Built-in Tools:**
```typescript
import { Agent } from "@anthropic-ai/claude-agent-sdk";

const agent = new Agent({
  tools: [
    "Read",      // File reading
    "Write",     // File creation
    "Edit",      // File modification
    "Bash",      // Shell execution
    "Glob",      // Pattern matching
    "Grep",      // Text search
    "WebSearch", // Search the web
    "WebFetch",  // Fetch URLs
    "Monitor",   // Stream events
    "Agent"      // Spawn subagents
  ]
});

await agent.run("your prompt");
```

**Session Management:**
```typescript
const sessionStore = new InMemorySessionStore();

const agent = new Agent({
  sessionStore,
  sessionId: "my-session"
});

// Persist and resume sessions across runs
const transcript = await sessionStore.load("my-session");
```

**MCP Integration:**
```typescript
const agent = new Agent({
  mcpServers: {
    supabase: {
      type: "stdio",
      command: "npx",
      args: ["@supabase/mcp-server-supabase@latest"]
    }
  }
});
```

**Differences from CLI:**
- Programmatic control: create agents, configure permissions, run non-interactively
- Session persistence: SessionStore protocols for custom storage
- Tracing: OpenTelemetry integration for observability
- No UI: output is JSON/text only, not interactive terminal

**Pricing:**
Free and open source. Uses your Claude API key (requires separate Claude Opus/Sonnet subscription).

**Sources:**
- [Agent SDK overview - Claude Code Docs](https://code.claude.com/docs/en/agent-sdk/overview)
- [@anthropic-ai/claude-agent-sdk - npm](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)

**What this means for greenfield Next.js/Supabase/Payload:**
- **Use Claude Code CLI during development** — interactive, visual, best for human-guided work
- **Use Agent SDK in CI/automation**:
  ```typescript
  // .github/workflows/test-migrations.ts
  import { Agent } from "@anthropic-ai/claude-agent-sdk";
  
  const agent = new Agent({
    tools: ["Bash", "Read", "Edit"]
  });
  
  await agent.run("Test all database migrations and report results");
  ```
- **Use SessionStore for persistent agents**:
  ```typescript
  const store = new DatabaseSessionStore();  // Custom implementation
  const agent = new Agent({ sessionStore: store });
  await agent.run("Continue previous work from session-123");
  ```
- **Build custom tooling** that orchestrates Claude agents programmatically

---

## 19. Session Management

### Current State (April 2026)

Claude Code sessions are persistent, resumable, and queryable.

**Session Basics:**
```bash
claude                     # Start new session
claude --continue          # Resume most recent
claude --resume            # Interactive picker
claude --resume auth       # Resume by name
claude -r <session-id>     # Resume by ID
```

**Session Naming:**
```bash
/rename oauth-integration  # During session
claude --resume oauth-integration  # Later
```

**Session Metadata:**
- **Session ID**: Unique identifier (saved locally)
- **Name**: Human-readable alias (set via `/rename`)
- **History**: Full message transcript + checkpoints
- **Code state**: All file changes tracked separately from conversation

**Resumable Workflows:**
Ideal for long-running projects:
```bash
# Session 1: Design phase
claude --worktree feature-payment
# (Work, commit, `/rename feature-payment`)

# Session 2: Implementation (weeks later)
claude --resume feature-payment
# (Full context restored, continue where you left off)
```

**Session Lifecycle:**
- **Auto-saved** locally at `~/.claude/projects/<project>/sessions/`
- **Checkpoints**: Every Claude action creates a checkpoint (rewindable)
- **Compaction**: Large sessions auto-summarize; important context survives (CLAUDE.md, latest code state)
- **Persistence**: Sessions survive terminal closure, machine restart

**Recap Feature (April 2026):**
```bash
/recap  # Summarize current session
```

Useful for returning to a long-running session to catch up quickly.

**Sources:**
- [Work with sessions - Claude Code Docs](https://code.claude.com/docs/en/agent-sdk/sessions)
- [Using Claude Code: session management and 1M context](https://claude.com/blog/using-claude-code-session-management-and-1m-context/)

**What this means for greenfield Next.js/Supabase/Payload:**
- **Name sessions by task**:
  ```bash
  /rename setup-payments
  /rename auth-refactor
  /rename mobile-responsive
  ```
- **Resume long-running work**:
  ```bash
  claude --resume setup-payments  # Pick up payment feature next day
  ```
- **Use `/recap`** to refresh memory after a break:
  ```bash
  /recap  # Understand where you left off
  ```
- **Leverage checkpoints** for experimentation:
  ```bash
  # Try an approach, rewind if it doesn't work
  /rewind  # Open menu, restore to previous checkpoint
  ```

---

## 20. Latest Changelog Highlights (Early-to-Mid 2026)

### What's New (Verified April 23, 2026)

**Model & Effort Updates:**
- **Opus 4.7** available with new `xhigh` effort level (between high and max)
- **Opus 4.6** 1M context window now available to Max, Team, Enterprise users
- **Sonnet 4.6** also supports 1M context
- **Adaptive thinking** replaces manual extended-thinking budgets (effort: low/medium/high/xhigh/max controls thinking depth)

**Interactive Features:**
- **`/effort` interactive slider** — Arrow keys to adjust, Enter to confirm (April 2026)
- **Voice STT expanded** — 10 new languages added (20 total: Russian, Polish, Turkish, Dutch, Ukrainian, Greek, Czech, Danish, Swedish, Norwegian)
- **Computer use in CLI** — Claude can open native apps, click UI, verify changes from terminal (research preview)

**Planning & Execution:**
- **Ultraplan early preview** (April 6–10 2026) — Draft plans in cloud, review/comment in web editor, execute remotely or pull back local
- **`/recap` command** — Summarize current session for quick context recovery
- **Skill tool** — Built-in slash commands (`/init`, `/review`, `/security-review`) now accessible via Skill tool for programmatic invocation

**Performance & Efficiency:**
- **1-hour and 5-minute prompt caching** — Faster repeated requests
- **MCP 500K upgrade** — Tool output character limit increased to 500,000 (from smaller limit)
- **Memory footprint optimization** — Language grammars loaded on-demand (faster startup)
- **Brief mode retry** — Retry once if Claude responds with plain text instead of structured message

**Worktrees & Parallel:**
- **Native git worktree support** — `.claude/worktrees/<name>/` auto-managed
- **Parallel agents in worktrees** — Each subagent gets own worktree automatically
- **Sparse checkout config** — `worktree.sparsePaths` to optimize monorepo checkouts

**Infrastructure:**
- **OS CA certificate trust** — Enterprise TLS proxies work out-of-box
- **Remote Tasks** (March 20) — Define repo + prompt, run on Anthropic cloud on schedule
- **Agent Teams** (experimental, flag-gated) — Multiple parallel sessions with auto-coordination

**CLI & UX:**
- **`/ultraplan` and remote sessions** — Auto-create default cloud environment (no web setup required)
- **Monitor tool** — Stream events from background scripts
- **Auto-deploy on `[deploy]` flag** — Structured commit flag for deployment control

**Sources:**
- [Claude Code Changelog: All Release Notes (2026)](https://claudefa.st/blog/guide/changelog)
- [What's new - Claude Code Docs](https://code.claude.com/docs/en/whats-new)
- [Claude Code by Anthropic - April 2026 Updates](https://releasebot.io/updates/anthropic/claude-code)

**What this means for greenfield Next.js/Supabase/Payload:**
- **Use Opus 4.7 with xhigh effort** for complex architectural decisions
- **Leverage `/effort` interactive slider** for quick mode switching without typing
- **Try Ultraplan** for collaborative schema/API design reviews with your team
- **Enable voice STT** if you prefer to prompt by voice (now supports your language)
- **Use `[deploy]` commit flag** in `.claude/settings.json`:
  ```json
  {
    "controlledDeploy": true
  }
  ```
- **Monitor background tasks** with the new Monitor tool for long-running migrations/backups
- **Plan to adopt Remote Tasks** for production nightly maintenance (when fully released)

---

## Synthesis: Canonical Claude Code Setup for Greenfield Next.js/Supabase/Payload

### Recommended Project Structure

```
sen-react/
├── CLAUDE.md                        # Root instructions: pnpm, Next.js 16 (app router), Payload CMS, Supabase
├── .claude/
│   ├── settings.json                # Shared project settings (committed)
│   ├── settings.local.json          # Personal overrides (gitignored)
│   ├── CLAUDE.md                    # Alternative to root CLAUDE.md (optional)
│   ├── rules/
│   │   ├── frontend.md              # paths: "app/**", "components/**"
│   │   ├── api.md                   # paths: "app/api/**"
│   │   └── database.md              # paths: "migrations/**"
│   ├── skills/
│   │   ├── deploy/SKILL.md          # Deploy to Vercel (disable-model-invocation: true)
│   │   ├── migrate-schema/SKILL.md  # Supabase migrations
│   │   ├── seed-data/SKILL.md       # Populate test data
│   │   ├── generate-types/SKILL.md  # TypeScript types from schema
│   │   └── api-endpoint/SKILL.md    # Bootstrap API routes
│   ├── agents/
│   │   ├── schema-auditor.md        # Review schema, RLS, indexes
│   │   ├── api-reviewer.md          # Auth, validation, errors
│   │   └── payload-validator.md     # Collection config, fields
│   ├── hooks/
│   │   ├── hooks.json               # PreToolUse (block destructive), PostToolUse (log)
│   │   └── scripts/
│   │       └── validate-migrations.sh
│   └── output-styles/
│       └── explanatory.md           # Default output style (multi-line, detailed)
├── .mcp.json                        # MCP servers (Supabase, Memory)
├── pnpm-workspace.yaml              # If using monorepo structure
├── packages/                        # Optional monorepo structure
│   ├── web/
│   │   ├── CLAUDE.md
│   │   ├── .claude/skills/
│   │   ├── app/
│   │   ├── components/
│   │   └── package.json
│   ├── cms/
│   │   ├── CLAUDE.md
│   │   ├── .claude/skills/
│   │   ├── src/collections/
│   │   └── package.json
│   └── shared/
│       ├── src/types/
│       └── package.json
├── migrations/
├── .git/
└── .gitignore                       # Include .claude/settings.local.json, CLAUDE.local.md
```

### Recommended Initial Commands

```bash
# 1. Initialize Claude Code
cd sen-react
claude /init                         # Auto-generate starter CLAUDE.md

# 2. Configure basic setup
/config                             # Open settings UI, adjust permissions
# Set: permissions.defaultMode = "acceptEdits"
# Set: permissions.allow = ["Bash(npm|pnpm|git)*", "Edit(./*)", "Read(.)"]
# Set: permissions.deny = ["Bash(curl|rm)*", "Read(.env*)"]

# 3. Create core skills
/skill-new migrate-schema           # Bootstrap schema migration skill
/skill-new deploy                   # Bootstrap deployment skill

# 4. Connect MCP servers
claude mcp add memory npx @anthropic/mcp-server-memory@latest
claude mcp add supabase npx @supabase/mcp-server-supabase@latest

# 5. Name and commit
/rename greenfield-setup
# (Commit CLAUDE.md, .claude/settings.json, skills)

# 6. Start building
# Use /plan for large features
# Use /effort medium for routine work
# Use worktrees for parallel features
```

### Leverage Points in Order of Importance

1. **CLAUDE.md** — Root instructions (150–200 lines). Top ROI: prevents repeated corrections.
2. **Skills** — `.claude/skills/` for repeatable workflows. Create `/deploy`, `/migrate-schema`, `/generate-types` early.
3. **Rules** — `.claude/rules/` scoped by path (frontend.md, api.md, database.md). Reduces noise, improves adherence.
4. **Settings** — `.claude/settings.json` with permission rules. Auto-approve safe operations.
5. **Hooks** — `.claude/hooks/` for deterministic enforcement (block destructive ops, validate migrations).
6. **MCP Servers** — Supabase MCP for direct schema queries, Memory MCP for persistent notes.
7. **Subagents** — Custom agents for isolated workflows (schema auditor, API reviewer).
8. **Worktrees** — Parallel development sessions once MVP stabilizes.
9. **Agent Teams** — Only for large refactors (experimental, not for initial setup).

### Token-Efficiency Recommendations

- Keep CLAUDE.md under 200 lines (each line is ~1 token).
- Use path-scoped rules to load instructions on-demand.
- Preload only 3–5 core skills; others load on invocation.
- Enable auto memory to accumulate learnings without manual updates.
- Use subagents for investigation to keep main context clean.
- Run `/clear` between unrelated tasks.
- Use `/compact` when context approaches limit.

### Security & Compliance

- Enable sandbox mode for CI/automation.
- Use auto mode (`--permission-mode auto`) for unattended runs.
- Block Bash(curl), Bash(rm), and reads of `.env*`, `~/.ssh/**` by default.
- Enable hooks to validate migrations, block production DB access, log changes.
- Store secrets in shell environment or `.env.local` (gitignored), never in settings.json.

---

## Summary: The State of Claude Code (April 2026)

Claude Code has evolved from a code-generation chatbot into a full **agentic coding platform**. The 2026 landscape emphasizes:

1. **Persistent Context** (CLAUDE.md, auto memory) — Claude learns project conventions and accumulates knowledge
2. **Composable Extensions** (skills, hooks, rules) — Layer automation deterministically
3. **Isolated Execution** (subagents, worktrees) — Parallel work without interference
4. **Programmatic Control** (Agent SDK, TaskCreate, CronCreate) — Integrate Claude into CI/infrastructure
5. **Scalable Orchestration** (agent teams, remote tasks) — Coordinate multi-session workflows

For a greenfield Next.js/Supabase/Payload project, the **canonical approach** combines:
- Focused CLAUDE.md + scoped `.claude/rules/`
- 5–7 domain-specific skills
- Selective hook enforcement
- MCP servers for external integrations
- Worktrees for parallel features
- Auto memory for learning accumulation

This setup requires ~2 hours of upfront configuration but compounds in value over months, reducing context pollution, enabling context-aware invocation, and automating routine verification.

---

**Report compiled:** April 23, 2026  
**Verification sources:** code.claude.com/docs, GitHub releases, April 2026 changelog, web search (2026 articles only)  
**Implementation scope:** Research only — no code changes

Sources:
- [Claude Code Documentation Map](https://code.claude.com/docs/en/claude_code_docs_map.md)
- [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Create custom subagents](https://code.claude.com/docs/en/agents)
- [Claude Code Hooks: Complete Reference](https://code.claude.com/docs/en/hooks)
- [Claude Code Configuration Reference](https://code.claude.com/docs/en/settings)
- [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [Discover and install prebuilt plugins](https://code.claude.com/docs/en/discover-plugins)
- [Model context protocol (MCP) - Supabase Docs](https://supabase.com/docs/guides/getting-started/mcp)
- [Claude Code Changelog: All Release Notes (2026)](https://claudefa.st/blog/guide/changelog)
- [Claude Code Agent Teams: Setup & Usage Guide 2026](https://claudefa.st/blog/guide/agents/agent-teams)
- [Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [Output styles - Claude Code Docs](https://code.claude.com/docs/en/output-styles)
- [Using Claude Code: session management and 1M context](https://claude.com/blog/using-claude-code-session-management-and-1m-context/)
- [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams)
- [Claude Code Ultraplan: Cloud Planning to Free Your Terminal](https://claudefa.st/blog/guide/mechanics/ultraplan)
- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)
- [Building with extended thinking - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)