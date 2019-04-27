
## Notes
Design idea taken from [Dribble](https://dribbble.com/shots/6140371-Dashboard-for-schedule-and-monitoring-platform-version-4/attachments/1316926).

App is guaranteed to be working only on Chrome browser as no polyfills/post-css prefixes were not shipped for sake of simplicity.

## Scripts

### `npm run build`

Creates a produciont build with prerendering and css inlining. Also server a service worker.

### `npm run test`
### `npm run test:w`

Runs jest to execute unit and enzyme tests.

### `npm run start`

Runs dev server in watch mode with module replacement.


### `npm run tslint`
### `npm run tslint:fix`

Runs linting

### `npm run ci`
Simple CI pipeline script
