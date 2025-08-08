# Annotorious Boolean Operations

Adds functionality to **merge** and **subtract** annotation shapes.

![Demo](/screencast.gif "Demo screenshot")

> **Important:** This plugin currently only supports `@annotorious/openseadragon`.
> Support for plain (JPEG, PNG,...) images is not yet implemented. 
> [Join the discussion](https://github.com/orgs/annotorious/discussions) if you'd 
> like to use this with `@annotorious/annotorious` or `@annotorious/react`.

## Installation

```sh
npm install @annotorious/plugin-boolean-operations
```

## Usage with OpenSeadragon

```ts
import OpenSeadragon from 'openseadragon';
import { createOSDAnnotator } from '@annotorious/openseadragon';
import { mountPlugin as mountBooleanPlugin  } from '@annotorious/plugin-boolean-operations';

import '@annotorious/openseadragon/annotorious-openseadragon.css';

/**
 * Important: the plugin requires multi-select to be enabled!
 */
const viewer = OpenSeadragon({
  /** Your viewer config **/
  multiSelect: true
});

const anno = createOSDAnnotator(viewer, { /* options */ });

// Initialize the plugin
const plugin = mountBooleanPlugin(anno);

// Merge example
document.getElementById('merge').addEventListener('click', () => {
  plugin.mergeSelected();
});

// Subtract example
document.getElementById('subtract').addEventListener('click', () => {
  plugin.subtractSelected();
});
```

## API

| Method | Description |
|--------|-------------|
| canSubtractSelected() | Checks if the current selection allows subtraction (without producing an empty shape). |
| mergeSelected(opts?: MergeOptions) | Merges all currently selected annotations. Accepts [MergeOptions](#mergeoptions) to control how annotation bodies are handled. |
| subtractSelected() | Keeps the first selected annotation, clipping its geometry by subtracting all others. **All other selected annotations are deleted.** Selection order matters. |

### MergeOptions

`mergeSelected` can be customized with a `MergeOptions` object that controls **how annotation bodies** are preserved in the merged shape.

You can either choose one of the built-in **strategies** or provide your own explicit override.

#### Built-in Strategies
- `{ strategy: 'merge_bodies' }` _(default)_. Combine bodies from all selected shapes into the merged annotation, in the order of selection.
- `{ strategy: 'keep_first_bodies' }`. Keep only the bodies from the first selected annotation, discard all others.

#### Custom Merge

You can override the merge behavior by passing:
- An explicit array of `AnnotationBody` objects to keep.
- A function that receives the selected annotations and returns the bodies to keep.

```ts
// Keep specific bodies
plugin.mergeSelected({
  bodies: [myBody1, myBody2]
});

// Decide dynamically from the selection
plugin.mergeSelected({
  bodies: selected => selected.flatMap(a => a.bodies.filter(b => b.purpose === 'tagging'))
});
```
