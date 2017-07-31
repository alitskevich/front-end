import ScriptEngine from '../ScriptEngine.es6';
import HelloWorld from './samples/Hello.js';

const Global = { console };
import { DeviceFactory } from '../../device';
import OS from '../../os/OS.js';

export const device = DeviceFactory.build().installOs(OS).launch();

device.exec(new ScriptEngine({

  This: Global,

  Code: HelloWorld
}))
