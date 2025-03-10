import type { EllipseGeometry, RectangleGeometry } from '@annotorious/annotorious';

export const ellipseToPolygon = (ellipse: EllipseGeometry): [number, number][][]  => {
  // Make this high-res – the result shape will be simplified, anyway
  const numPoints = 1000;

  const { cx, cy, rx, ry } = ellipse;

  const points: [number, number][] = [];
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    
    points.push([x, y]);
  }
  
  return [points];
}

export const rectToPolygon = (rect: RectangleGeometry): [number, number][][] => ([[
  [rect.x, rect.y],
  [rect.x + rect.w, rect.y],
  [rect.x + rect.w, rect.y + rect.h],
  [rect.x, rect.y + rect.h],
  [rect.x, rect.y]
]])