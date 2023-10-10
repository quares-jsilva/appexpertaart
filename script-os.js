const { spawn } = require('child_process');

const scripts = require('./script-os.json');

const { platform } = process;

const { ANDROID_HOME, npm_lifecycle_event } = process.env;

const os = platform === 'win32' ? platform : 'default';

const scriptCmd = npm_lifecycle_event;
const script = scripts[`${scriptCmd}:${os}`] || scripts[`${scriptCmd}:default`];
const cmd = script.replace(/\$ANDROID_HOME/g, ANDROID_HOME);

spawn(cmd, { shell: true, stdio: 'inherit' });