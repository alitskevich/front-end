import { DeviceFactory } from '../../device';
import OS from '../../os/OS.js';

export const device = DeviceFactory.build().installOs(OS).launch();
