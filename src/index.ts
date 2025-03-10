import * as polyclip from 'polyclip-ts';
import { v4 as uuidv4 } from 'uuid';
import { boundsFromPoints, ShapeType } from '@annotorious/annotorious';
import { ellipseToPolygon, rectToPolygon } from './utils';
import type { 
  EllipseGeometry, 
  ImageAnnotation, 
  ImageAnnotator, 
  PolygonGeometry, 
  RectangleGeometry 
} from '@annotorious/annotorious';

export const mountPlugin = (anno: ImageAnnotator) => {

  // Just for testing
  const merge = () => {
    const all = anno.getAnnotations();

    const input: [number, number][][][] = all.map(a => {
      const { selector } = a.target;
      if (selector.type === ShapeType.POLYGON) {
        return [(selector.geometry as PolygonGeometry).points as [number, number][]];
      } else if (selector.type === ShapeType.RECTANGLE) {
        return rectToPolygon(selector.geometry as RectangleGeometry);
      } else if (selector.type === ShapeType.ELLIPSE) {
        return ellipseToPolygon(selector.geometry as EllipseGeometry);
      }
    });

    const result= polyclip.union(input)
      .map(poly => poly.map(ring => ring.map(pt => pt.map(str => parseFloat(str.toString())))))[0] as [number, number][][];

    all.forEach(a => anno.removeAnnotation(a.id));
    const annotation = {
      ...all[0],
      target: {
        ...all[0].target,
        selector: {
          ...all[0].target.selector,
          type: ShapeType.POLYGON,
          geometry: {
            bounds: boundsFromPoints(result[0]),
            points: result[0]
          }
        }
      }
    } as ImageAnnotation;

    anno.addAnnotation(annotation);
  }

  return {
    merge
  }

}