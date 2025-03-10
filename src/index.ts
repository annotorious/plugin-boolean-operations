import * as polyclip from 'polyclip-ts';
import { v4 as uuidv4 } from 'uuid';
import { boundsFromPoints, ShapeType } from '@annotorious/annotorious';
import { ellipseToPolygon, rectToPolygon } from './utils';
import type { 
  EllipseGeometry, 
  ImageAnnotation, 
  ImageAnnotator, 
  MultiPolygonElement, 
  MultiPolygonGeometry, 
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

    const polygons = polyclip.union(input)
      .map(poly => poly.map(ring => ring.map(pt => pt.map(str => parseFloat(str.toString()))))) as [number, number][][][];

    const outerPoints = polygons.reduce<[number, number][]>((all, element) => {
      return [...all, ...element[0]]
    }, []);

    console.log({outerPoints});

    all.forEach(a => anno.removeAnnotation(a.id));
    const annotation = {
      ...all[0],
      target: {
        ...all[0].target,
        selector: {
          ...all[0].target.selector,
          type: ShapeType.MULTIPOLYGLON,
          geometry: {
            polygons: polygons.map(polygon => ({
              rings: polygon.map(points => ({
                points
              })),              
              // Outer ring points
              bounds: boundsFromPoints(polygon[0])
            } as MultiPolygonElement)),
            bounds: boundsFromPoints(outerPoints)
          } as MultiPolygonGeometry
        }
      }
    } as ImageAnnotation;

    console.log('adding', annotation);

    anno.addAnnotation(annotation);
  }

  const subtract = () => {
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

    const polygons = polyclip.difference(input[0], input[1])
      .map(poly => poly.map(ring => ring.map(pt => pt.map(str => parseFloat(str.toString()))))) as [number, number][][][];

    const outerPoints = polygons.reduce<[number, number][]>((all, element) => {
      return [...all, ...element[0]]
    }, []);

    console.log({outerPoints});

    all.forEach(a => anno.removeAnnotation(a.id));
    const annotation = {
      ...all[0],
      target: {
        ...all[0].target,
        selector: {
          ...all[0].target.selector,
          type: ShapeType.MULTIPOLYGLON,
          geometry: {
            polygons: polygons.map(polygon => ({
              rings: polygon.map(points => ({
                points
              })),              
              // Outer ring points
              bounds: boundsFromPoints(polygon[0])
            } as MultiPolygonElement)),
            bounds: boundsFromPoints(outerPoints)
          } as MultiPolygonGeometry
        }
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