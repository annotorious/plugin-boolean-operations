# Annotorious Boolean Operations

Adds functionality to merge and subtract annotation shapes.

![Demo](/screencast.gif "Demo screenshot")

> **Important:** this plugin only supports `@annotorious/openseadragon` at this time. Support for 
> plain (JPEG, PNG,...) images is not yet implemented. [Get in touch via the forum](https://github.com/orgs/annotorious/discussions) if you are interested in 
> using this with the `@annotorious/annotorious` or `@annotorious/react` packages.

## Using with OpenSeadragon

```
npm install @annotorious/plugin-boolean-operations
```

```ts
import OpenSeadragon from 'openseadragon';
import { createOSDAnnotator } from '@annotorious/openseadragon';
import { mountPlugin as mountBooleanPlugin  } from '@annotorious/plugin-boolean-operations';

import '@annotorious/openseadragon/annotorious-openseadragon.css';

/**
 * Important: the plugin requires the multi-select option
 * to be enabled!
 */
const viewer = OpenSeadragon({
  /** init your viewer **/
  multiSelect: true
});

const anno = createOSDAnnotator(viewer, { /* options */ });

// Initialize the plugin
const plugin = mountBooleanPlugin(anno);

// The plugin has two functions: `mergeSelected` and `subtractSelected`
// - More than one shape must be selected.
// - `mergeSelected` will create a multipolygon union shape of all 
//   selected shapes
// - `subtractSelelected` will remove all other shapes from the first 
//   selected shap.
// - Selection order is important! Only data associated with the first 
//   selected shape is preserved. Data from other selections is lost.
document.getElementById('merge').addEventListener('click', () => {
  plugin.mergeSelected();
});

document.getElementById('subtract').addEventListener('click', () => {
  plugin.subtractSelected();
});
```
