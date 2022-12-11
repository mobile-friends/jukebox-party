import * as fc from 'fast-check';
import { Duration } from '../../lib/duration';

export const arbDuration = fc
  .integer({ min: 0, max: 100 })
  .map(Duration.makeFromSeconds);
