import * as migration_20260509_231412 from "./20260509_231412";
import * as migration_20260510_001212 from "./20260510_001212";

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
];
