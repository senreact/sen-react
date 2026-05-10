import * as migration_20260509_231412 from "./20260509_231412";
import * as migration_20260510_001212 from "./20260510_001212";
import * as migration_20260510_094016 from "./20260510_094016";
import * as migration_20260510_100445 from "./20260510_100445";
import * as migration_20260510_102115 from "./20260510_102115";
import * as migration_20260510_103224 from "./20260510_103224";
import * as migration_20260510_104343 from "./20260510_104343";
import * as migration_20260510_111509 from "./20260510_111509";
import * as migration_20260510_115803 from "./20260510_115803";

export const migrations = [
  {
    up: migration_20260509_231412.up,
    down: migration_20260509_231412.down,
    name: "20260509_231412",
  },
  {
    up: migration_20260510_001212.up,
    down: migration_20260510_001212.down,
    name: "20260510_001212",
  },
  {
    up: migration_20260510_094016.up,
    down: migration_20260510_094016.down,
    name: "20260510_094016",
  },
  {
    up: migration_20260510_100445.up,
    down: migration_20260510_100445.down,
    name: "20260510_100445",
  },
  {
    up: migration_20260510_102115.up,
    down: migration_20260510_102115.down,
    name: "20260510_102115",
  },
  {
    up: migration_20260510_103224.up,
    down: migration_20260510_103224.down,
    name: "20260510_103224",
  },
  {
    up: migration_20260510_104343.up,
    down: migration_20260510_104343.down,
    name: "20260510_104343",
  },
  {
    up: migration_20260510_111509.up,
    down: migration_20260510_111509.down,
    name: "20260510_111509",
  },
  {
    up: migration_20260510_115803.up,
    down: migration_20260510_115803.down,
    name: "20260510_115803",
  },
];
