import { DeviceFactory } from './Device.js';
import OPS from './CpuOpSet.js';
import OS from './OS.js';

const device = DeviceFactory.build({
    MEMORY_SIZE: 24 * 1024 * 1024,
    OPS
});

device.install(OS);

device.launch();