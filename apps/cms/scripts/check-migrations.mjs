#!/usr/bin/env node
/**
 * Deterministic guard: Payload migrations MUST be produced by the generator
 * (`pnpm --filter @sen-react/cms exec payload migrate:create <name>`), never
 * hand-written.
 *
 * Why this exists: a hand-written migration (20260515_130000) created array
 * sub-tables with `parent_id`/serial ids instead of Payload's `_parent_id`/
 * varchar convention, silently breaking FormalisationSteps CRUD in production,
 * and shipped without the `.json` schema snapshot — which froze the generator's
 * baseline and made every later `migrate:create` produce a garbage diff.
 *
 * The invariant a hand-written migration violates: the generator always emits
 * BOTH a `<name>.ts` and a `<name>.json` (a ~270 KB drizzle schema snapshot
 * nobody writes by hand). So we enforce:
 *   1. every migration `.ts` (except index.ts) has a sibling `.json`
 *   2. every `.json` is a real drizzle snapshot (parses; has version + tables)
 *   3. no orphan `.json` without a `.ts`
 *   4. index.ts registers exactly the set of migration `.ts` files
 *
 * Exit non-zero on any violation. Wired into the pre-commit hook and CI.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "migrations");

const entries = readdirSync(migrationsDir);
const tsFiles = entries
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => f.replace(/\.ts$/, ""));
const jsonFiles = entries.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));

const tsSet = new Set(tsFiles);
const jsonSet = new Set(jsonFiles);
const errors = [];

// 1. every migration .ts has a sibling .json snapshot
for (const name of tsFiles) {
  if (!jsonSet.has(name)) {
    errors.push(
      `Migration "${name}.ts" has no "${name}.json" snapshot — it was hand-written. ` +
        `Regenerate it with: pnpm --filter @sen-react/cms exec payload migrate:create`,
    );
  }
}

// 2. every .json is a real drizzle snapshot
for (const name of jsonFiles) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(join(migrationsDir, `${name}.json`), "utf8"));
  } catch (err) {
    errors.push(`Snapshot "${name}.json" is not valid JSON: ${err.message}`);
    continue;
  }
  if (parsed == null || parsed.version === undefined || parsed.tables === undefined) {
    errors.push(
      `Snapshot "${name}.json" is missing drizzle markers (version/tables) — not a real generated snapshot.`,
    );
  }
  // 3. no orphan .json without a .ts
  if (!tsSet.has(name)) {
    errors.push(`Snapshot "${name}.json" has no matching "${name}.ts" migration.`);
  }
}

// 4. index.ts registers exactly the migration .ts files
const indexSrc = readFileSync(join(migrationsDir, "index.ts"), "utf8");
const registered = new Set([...indexSrc.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]));
for (const name of tsFiles) {
  if (!registered.has(name)) {
    errors.push(`Migration "${name}.ts" exists but is NOT registered in index.ts.`);
  }
}
for (const name of registered) {
  if (!tsSet.has(name)) {
    errors.push(`index.ts references "${name}" but no "${name}.ts" file exists.`);
  }
}

if (errors.length) {
  console.error("\n✗ Migration guard failed — hand-written or inconsistent migrations detected:\n");
  for (const e of errors) console.error("  • " + e);
  console.error(
    "\nMigrations must be produced by Payload's generator, never hand-written.\n" +
      "See apps/cms/scripts/check-migrations.mjs for the rule.\n",
  );
  process.exit(1);
}

console.log(`✓ Migration guard passed — ${tsFiles.length} migration(s), all generator-produced.`);
