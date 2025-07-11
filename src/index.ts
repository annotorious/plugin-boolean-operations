import * as polyclip from 'polyclip-ts';
import type { Geom } from 'polyclip-ts';
import type { AnnotationBody, ImageAnnotation, ImageAnnotator } from '@annotorious/annotorious';
import { toPolyclip, toSelector } from './utils';
import type { MergeOptions } from './types';

export const mountPlugin = (anno: ImageAnnotator) => {

  const { store, selection } = anno.state;

  const getSelected = () => {
    const selectedIds = selection.selected.map(s => s.id);
    return selectedIds.map(id => store.getAnnotation(id)!).filter(Boolean);
  }

  const mergeSelected = (options: MergeOptions = { strategy: 'merge_bodies' }) => {
    const selected = getSelected();

    const [first, ...others] = selected;
    if (!first || others.length === 0) return;

    const inputGeoms = selected.map(toPolyclip) as Geom[];
    const [firstInputGeom, ...otherInputGeoms] = inputGeoms;
    const mergedGeom = polyclip.union(firstInputGeom, ...otherInputGeoms);
    
    const selector = toSelector(mergedGeom);

    let bodies: AnnotationBody[];

    if ('bodies' in options) {
      if (typeof options.bodies === 'function')
        bodies = options.bodies(selected);
      else 
        bodies = [...options.bodies];
    } else {
      if (options.strategy === 'keep_first_bodies')
        bodies = [...first.bodies]
      else 
        bodies = [first, ...others].flatMap(a => a.bodies);
    } 

    const annotation: ImageAnnotation = {
      ...first,
      bodies,
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

  const subtract = (annotations: ImageAnnotation[]) => {
    const [first, ...others] = annotations;
    const input =  [first, ...others].map(toPolyclip) as Geom[];
    const [firstInput, ...otherInput] = input;
    return polyclip.difference(firstInput, ...otherInput);
  }

  const canSubtractSelected = () => {
    const selected = getSelected();
    
    // Less than 2 shapes selected
    if ((selected || []).length < 2) return false;

    const diff = subtract(selected);
    return diff.length > 0;
  }

  const subtractSelected = () => {
    const selected = getSelected();
    
    if ((selected || []).length < 2) return;

    const diff = subtract(selected);

    if (diff.length === 0) {
      console.warn('Cannot subtract: result empty');
      return;
    }

    const selector = toSelector(diff);
    
    const [first, ...others] = selected;

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
    canSubtractSelected,
    mergeSelected,
    subtractSelected
  }

}