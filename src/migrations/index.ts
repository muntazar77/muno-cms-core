import * as migration_20260310_151132 from './20260310_151132';
import * as migration_20260316_130809 from './20260316_130809';
import * as migration_20260322_132422 from './20260322_132422';
import * as migration_20260322_143852 from './20260322_143852';
import * as migration_20260323_230524 from './20260323_230524';

export const migrations = [
  {
    up: migration_20260310_151132.up,
    down: migration_20260310_151132.down,
    name: '20260310_151132',
  },
  {
    up: migration_20260316_130809.up,
    down: migration_20260316_130809.down,
    name: '20260316_130809',
  },
  {
    up: migration_20260322_132422.up,
    down: migration_20260322_132422.down,
    name: '20260322_132422',
  },
  {
    up: migration_20260322_143852.up,
    down: migration_20260322_143852.down,
    name: '20260322_143852',
  },
  {
    up: migration_20260323_230524.up,
    down: migration_20260323_230524.down,
    name: '20260323_230524'
  },
];
