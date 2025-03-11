import * as polyclip from 'polyclip-ts';
import { v4 as uuidv4 } from 'uuid';
import { toPolyclip, toSelector } from './utils';
import type { 
  ImageAnnotation, 
  ImageAnnotator
} from '@annotorious/annotorious';

export const mountPlugin = (anno: ImageAnnotator) => {

  // Just for testing
  const merge = () => {
    const all = anno.getAnnotations();

    const input: [number, number][][][] = all.map(toPolyclip);
    const merged = polyclip.union(input);
    const selector = toSelector(merged);

    all.forEach(a => anno.removeAnnotation(a.id));

    const annotation = {
      ...all[0],
      target: {
        ...all[0].target,
        selector
      }
    } as ImageAnnotation;

    console.log('adding', annotation);

    anno.addAnnotation(annotation);
  }

  const subtract = () => {
    const all = anno.getAnnotations();

    const input = all.map(toPolyclip);
    const diff = polyclip.difference(input[0], input[1]);
    const selector = toSelector(diff);

    all.forEach(a => anno.removeAnnotation(a.id));

    const annotation = {
      ...all[0],
      target: {
        ...all[0].target,
        selector
      }
    } as ImageAnnotation;

    console.log('adding', annotation);

    anno.addAnnotation(annotation);
  }

  return {
    merge,
    subtract
  }

}