import * as migration_20260310_151132 from './20260310_151132';
import * as migration_20260316_130809 from './20260316_130809';

export const migrations = [
  {
    up: migration_20260310_151132.up,
    down: migration_20260310_151132.down,
    name: '20260310_151132',
  },
  {
    up: migration_20260316_130809.up,
    down: migration_20260316_130809.down,
    name: '20260316_130809'
  },
];
