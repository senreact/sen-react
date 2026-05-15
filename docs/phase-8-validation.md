# Phase 8 — Community Features: Validation Artefact

**Locked:** 2026-05-15  
**Branch base:** main @ `8dd2e96`

## Scope

Phase 8 delivers the full community layer on top of the Sen React platform. Eight sub-phases shipped as discrete PRs, each with CI + Chrome MCP verification before merge.

---

## Delivered

### 8a — Moderated Comments (`PR-8a` / `5d043c7`)
- `article_comments` Supabase table with RLS (approved-only SELECT for others, own-row SELECT/INSERT/UPDATE for author)
- Server action `submitCommentAction` with auth gate + Zod validation
- Admin moderation queue at `/admin/commentaires` — approve / reject
- Comments section on `/actualites/[slug]` (only when `commentsEnabled = true`)

### 8b — Events Calendar (`PR-8b` / `187b9ce`)
- Payload `Events` collection: title, slug, summary, body, startsAt, endsAt, location, eventType, sector, registrationUrl, image
- Payload migration `20260515_050000`
- `listEvents` / `getEventBySlug` CMS fetchers
- `/evenements` — upcoming/past split listing
- `/evenements/[slug]` — detail page with registration CTA

### 8c — REACT Announcements (`PR-8c` / `d8dc29d`)
- Payload `Announcements` collection: title, slug, category (general/urgent/platform-update/partnership), body, publishedAt
- Payload migration `20260515_060000`
- `listAnnouncements` / `getAnnouncementBySlug` CMS fetchers
- `/annonces` — listing with 4-colour category badges
- `/annonces/[slug]` — detail page

### 8d — Mentor-Mentee Matching (`PR-8d` / `c28804e`)
- `mentor_profiles` Supabase table — unique per user, RLS (authenticated SELECT for active profiles, own-row INSERT/UPDATE)
- `listActiveMentors`, `getOwnMentorProfile`, `upsertMentorProfile` in `lib/mentors.ts`
- `/mentorat` — authenticated grid listing with sector tags, expertise chips, email/WhatsApp/LinkedIn links
- `/mentorat/devenir-mentor` — authenticated registration form, Zod-validated server action

### 8e — Forums by Sector (`PR-8e` / `9696045`)
- `forum_threads` + `forum_replies` Supabase tables with RLS
- `reply_count` trigger maintained via PostgreSQL function
- `/forum` — authenticated sector overview with thread counts
- `/forum/[sector]` — thread list (pinned first, then by updated_at)
- `/forum/[sector]/[threadId]` — thread detail with replies + reply form; locked threads disable replies
- `/forum/creer` — create thread with sector selector
- Author names resolved from mentor profile or email prefix

### 8f — Community Groups (`PR-8f` / `c85d109`)
- `community_groups` + `group_members` Supabase tables with RLS
- `member_count` maintained via PostgreSQL insert/delete triggers
- `/groupes` — authenticated group listing by type (region/sector/theme)
- `/groupes/creer` — create group with name, description, type, tag
- `/groupes/[groupId]` — group detail, member list, join/leave button (client component)
- Creator automatically joined as admin on group creation
- `GROUP_TYPES` extracted to `groups-constants.ts` to prevent server-module import in Client Components

### 8g — Community Polls (`PR-8g` / `8dd2e96`)
- `community_polls` + `poll_votes` Supabase tables with RLS
- One-vote-per-user enforced by unique constraint (returns friendly error on duplicate)
- `/sondages` — authenticated poll listing with close date
- `/sondages/creer` — create poll with title, question, newline-separated options, optional close date
- `/sondages/[pollId]` — vote form (radio); shows percentage bar chart results after voting or when closed

---

## Navigation

All 8 community routes added to `DEFAULT_SITE_HEADER.navItems` in `packages/shared/src/cms-globals.ts`:
`Forum`, `Groupes`, `Mentorat`, `Sondages`, `Événements`, `Annonces` (in addition to pre-existing items).

---

## Database Migrations Applied to Production

| Migration | Table(s) | Applied |
|---|---|---|
| `20260515_040000_article_comments.sql` | `article_comments` | ✓ |
| `20260515_070000_mentor_profiles.sql` | `mentor_profiles` | ✓ |
| `20260515_080000_forum.sql` | `forum_threads`, `forum_replies` | ✓ |
| `20260515_090000_groups.sql` | `community_groups`, `group_members` | ✓ |
| `20260515_100000_polls.sql` | `community_polls`, `poll_votes` | ✓ |

Events and Announcements use Payload CMS (no direct Supabase migration needed).

---

## Validation

Each PR validated with:
1. `pnpm lint` — ESLint 0 errors/warnings
2. `pnpm --filter web typecheck` — TypeScript strict, 0 errors
3. `pnpm test` — 31/31 tests pass
4. `pnpm --filter web build` — Turbopack build succeeds (required for typed route regeneration)
5. GitHub Actions CI — "Lint, format, typecheck, build" ✓ on each PR
6. Chrome MCP — auth gates redirect to `/connexion`, homepage no regression

All 7 PRs (8a–8g) squash-merged to `main`.
