# create-react-app-8738-repro

This is a repro for[ `facebook/create-react-app`](https://github.com/facebook/create-react-app/issues/8738) issue [#8736 Minified React error #130 - 'this' in JSX arrow function (06/2020)](https://github.com/facebook/create-react-app/issues/8738)

`create-react-app` had been ejected and reduced to the absolute minimum.

## Steps to reproduce

- checkout the repo. within the repo:
- `yarn install`
- `yarn run build`
- `npx serve -s build`

Open <http://localhost:5000> in your browser.

## Expected outcome

1. devtools console: `Success (PojoTest)`
2. rendered component: `SUCCESS (ComponentWithoutJsx)` and
3. rendered component `SUCCESS (ComponentWithJsx)`

## Actual results

1. devtools console: `Success (PojoTest)` (ok)
2. rendered component: `SUCCESS (ComponentWithoutJsx)` (ok) but
3. **no** rendered component `SUCCESS (ComponentWithJsx)`, instead:
4. **error** in devtools console like:

```
Warning: React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
    in Unknown (created by ComponentWithJsx)
    in ComponentWithJsx
```
