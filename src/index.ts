import {addHook} from 'pirates';
import {watch} from 'chokidar';

let revert: (() => void) | null = null;

export function exitOnChange(
    shouldExitOnChange: boolean = true,
    exitTimeout = 100,
) {
    if (!shouldExitOnChange) {
        revert?.();
        return;
    }

    let exitTimeoutRegistration = setTimeout(() => {}, 0);
    const changedPaths = new Set();

    function exit() {
        console.info('EXITING DUE TO CHANGES IN', changedPaths);
        process.exit(128 + 3);
    }

    function scheduleExit(path: string) {
        changedPaths.add(path);

        clearTimeout(exitTimeoutRegistration);
        exitTimeoutRegistration = setTimeout(exit, exitTimeout);
    }

    function watchFile(path: string) {
        watch(path).on('change', (path) => scheduleExit(path));
    }

    revert = addHook((code) => code, {
        exts: ['.js', '.jsx', '.tsx', '.ts', '.json', '.mjs', '.cjs'],
        matcher: (path) => {
            watchFile(path);
            return true;
        },
    });
}

export let timeout = 100;
const ENV_TIMEOUT = parseInt(`${process.env.EXIT_ON_CHANGE_TIMEOUT}`);

if (ENV_TIMEOUT > 0 || ENV_TIMEOUT <= 0) {
    timeout = ENV_TIMEOUT;
}

const shouldInit = `${process.env.EXIT_ON_CHANGE}`.toUpperCase();

if (shouldInit === 'TRUE' || shouldInit === '1') {
    exitOnChange(true, timeout);
}
