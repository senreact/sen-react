import * as migration_20260602_121833_baseline_squash from "./20260602_121833_baseline_squash";
import * as migration_20260608_101723_publications_web_body from "./20260608_101723_publications_web_body";
import * as migration_20260608_103407_page_heroes_global from "./20260608_103407_page_heroes_global";
import * as migration_20260615_131006_add_opportunity_rolling from "./20260615_131006_add_opportunity_rolling";

export const migrations = [
  {
    up: migration_20260602_121833_baseline_squash.up,
    down: migration_20260602_121833_baseline_squash.down,
    name: "20260602_121833_baseline_squash",
  },
  {
    up: migration_20260608_101723_publications_web_body.up,
    down: migration_20260608_101723_publications_web_body.down,
    name: "20260608_101723_publications_web_body",
  },
  {
    up: migration_20260608_103407_page_heroes_global.up,
    down: migration_20260608_103407_page_heroes_global.down,
    name: "20260608_103407_page_heroes_global",
  },
  {
    up: migration_20260615_131006_add_opportunity_rolling.up,
    down: migration_20260615_131006_add_opportunity_rolling.down,
    name: "20260615_131006_add_opportunity_rolling",
  },
];
