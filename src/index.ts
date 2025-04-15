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

    const input = [first, ...others].map(toPolyclip) as Geom[];
    const [firstInput, ...otherInput] = input;
    const merged = polyclip.union(firstInput, ...otherInput);
    
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
    store.bulkDeleteAnnotations(others);
  }

  const subtractSelected = () => {
    const selected = getSelected();
    
    if ((selected || []).length < 2) return;
    
    const [first, ...others] = selected;
    const input =  [first, ...others].map(toPolyclip) as Geom[];
    const [firstInput, ...otherInput] = input;
    const diff = polyclip.difference(firstInput, ...otherInput);

    const selector = toSelector(diff);

    const annotation: ImageAnnotation = {
      ...first,
      target: {
        ...first.target,
        selector
      }
    };

    store.updateAnnotation(annotation);
    store.bulkDeleteAnnotations(others);
  }

  return {
    mergeSelected,
    subtractSelected
  }

}