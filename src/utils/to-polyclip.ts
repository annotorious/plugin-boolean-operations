import type { Geom } from 'polyclip-ts';
import { ShapeType } from '@annotorious/annotorious';
import type { 
  EllipseGeometry, 
  ImageAnnotation, 
  MultiPolygonGeometry, 
  PolygonGeometry, 
  RectangleGeometry 
} from '@annotorious/annotorious';

const ellipseToPolygon = (
  ellipse: EllipseGeometry, 
  numPoints = 1000
): [number, number][][]  => {
  const { cx, cy, rx, ry } = ellipse;

  const points: [number, number][] = [];
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    
    points.push([x, y]);
  }
  
  return [[...points, points[0]]];
}

const rectToPolygon = (
  rect: RectangleGeometry
): [number, number][][] => ([[
  [rect.x, rect.y],
  [rect.x + rect.w, rect.y],
  [rect.x + rect.w, rect.y + rect.h],
  [rect.x, rect.y + rect.h],
  [rect.x, rect.y]
]]);

const multiPolygonToPolygon = (
  multi: MultiPolygonGeometry
): [number, number][][][] =>
  multi.polygons.map(element => 
    element.rings.map(ring => ring.points)
  );

/** Returns a polyclip polygon or multipolygon **/
export const toPolyclip = (annotation: ImageAnnotation): Geom => {
  const { selector } = annotation.target;
  if (selector.type === ShapeType.RECTANGLE) {
    return rectToPolygon(selector.geometry as RectangleGeometry);
  } else if (selector.type === ShapeType.POLYGON) {
    return [(selector.geometry as PolygonGeometry).points as [number, number][]];
  } else if (selector.type === ShapeType.ELLIPSE) {
    return ellipseToPolygon(selector.geometry as EllipseGeometry);
  } else if (selector.type === ShapeType.MULTIPOLYGLON) {
    return multiPolygonToPolygon(selector.geometry as MultiPolygonGeometry);
  }
}