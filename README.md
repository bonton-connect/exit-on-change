# exit-on-change

Kill your node process if any of the files that
you `require` changes.

## Installation

```bash
yarn add --dev @bonton/exit-on-change

# or
 
npm install --save-dev @bonton/exit-on-change
```

## Basic Usage

### Recommended: On The CLI

```bash
node -r @bonton/exit-on-change/dist/exit-on-change .
```

This imports `dist/exit-on-change.js` before importing
your own code and executing.

### Import in `index.js` & Pass Environment Variables

```javascript
import '@bonton/exit-on-change';

// OR

require('@bonton/exit-on-change');
```

Once this is added, pass an environment variable like

```bash
EXIT_ON_CHANGE=1 node .
```

### Imperative

```javascript
import {exitOnChange} from '@bonton/exit-on-change';
exitOnChange(true);

// OR

require('@bonton/exit-on-change').exitOnChange(true);
```

## How It Works
This package uses [`pirates`]() to hook into
node's module import system and then users [`chokidar`]()
to watch for changes in required files.

The process is not killed immediately but rather after
a `100ms` delay by default. See below on hwo to change
the delay.

This is done so that changes can accumulate so as not to
trigger too many restarts.

## Tracked Extensions

`.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.mjs`, `.cjs`

## Controlling Exit Timeout

Default Timeout: `100ms`

### CLI / Main File Import
Just set the `EXIT_ON_CHANGE_TIMEOUT` environment
variable to the amount of time in milliseconds.

```bash
# if CLI only
EXIT_ON_CHANGE_TIMEOUT=500 node -r @bonton/exit-on-change/dist/exit-on-change .

# if imported in main file
EXIT_ON_CHANGE_TIMEOUT=500 node .
```

### Imperative
The second argument takes the time
in milliseconds.

```javascript
import {exitOnChange} from '@bonton/exit-on-change';
exitOnChange(true, 500);

// OR

require('@bonton/exit-on-change').exitOnChange(true, 500);
```

## Restart The Process (like `nodemon`)

Please use your container orchestration tool's
native restart functionality.

### Example: Docker Compose
Add the following property to your service definition

```yaml
version: '3'

services:
    your-service:
        ...

        restart: unless-stopped # <-- this one
        
        ...

```

Setting `restart: always` is also valid, if your
use-case demands it.


## Why `exit-on-change`?

`nodemon` is great, but what if you are tired
of listing dependencies in `nodemon.json` because
your dependencies are in the parent folder and that
`node_modules` directory is shared among all the other
projects in your yarn workspace? That's why.

### Why Kill The Process? Why Not Just Restart?

Your container orchestration tool like `docker compose`
is more than capable of restarting services, and it
probably does it better and cleaner too.

## License

MIT
