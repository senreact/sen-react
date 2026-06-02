import * as migration_20260602_121833_baseline_squash from "./20260602_121833_baseline_squash";

export const migrations = [
  {
    up: migration_20260602_121833_baseline_squash.up,
    down: migration_20260602_121833_baseline_squash.down,
    name: "20260602_121833_baseline_squash",
  },
];
