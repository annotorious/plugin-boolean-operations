import * as polyclip from 'polyclip-ts';
import type { Geom } from 'polyclip-ts';
import { toPolyclip, toSelector } from './utils';
import type { 
  ImageAnnotation, 
  ImageAnnotator
} from '@annotorious/annotorious';

export const mountPlugin = (anno: ImageAnnotator) => {

  const { store, selection } = anno.state;

  const getSelected = () => {
    const selectedIds = selection.selected.map(s => s.id);
    return selectedIds.map(id => store.getAnnotation(id)!).filter(Boolean);
  }

  const mergeSelected = () => {
    const [first, ...others] = getSelected();
    if (!first || others.length === 0) return;

    const input = [first, ...others].map(toPolyclip) as Geom;

    const merged = polyclip.union(input);
    const selector = toSelector(merged);

    const annotation: ImageAnnotation = {
      ...first,
      target: {
        ...first.target,
        selector
      }
    };

    // Update first annotation
    store.updateAnnotation(annotation);

    // Delete others
    store.bulkDeleteAnnotation(others);
  }

  const subtractSelected = () => {
    const [first, ...others] = getSelected();
    
    if (!first || others.length === 0) return;

    const input = [first, ...others].map(toPolyclip);
    
    const diff = polyclip.difference(input[0], input[1]);
    const selector = toSelector(diff);

    const annotation: ImageAnnotation = {
      ...first,
      target: {
        ...first.target,
        selector
      }
    };

    store.updateAnnotation(annotation);
    store.bulkDeleteAnnotation(others);
  }

  return {
    mergeSelected,
    subtractSelected
  }

}