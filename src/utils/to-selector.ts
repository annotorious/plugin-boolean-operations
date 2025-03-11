import { boundsFromPoints, ShapeType, type MultiPolygon, type Polygon } from '@annotorious/annotorious';

/** Tests if the given MultiPolygon is actually a simple **/
const isSimplePolygon = (polygon: MultiPolygon) =>
  polygon.geometry.polygons.length === 1 && polygon.geometry.polygons[0].rings.length === 1;

export const toSimplePolygon = (polygon: MultiPolygon): Polygon | MultiPolygon => {
  if (isSimplePolygon(polygon)) {
    const { rings, bounds } = polygon.geometry.polygons[0];

    return {
      type: ShapeType.POLYGON,
      geometry: {
        bounds,
        points: rings[0].points
      }
    }
  } else {
    return polygon;
  }
}

export const toSelector = (multipoly: [number, number][][][]) => {
  // For each multipoly element, get the points from the first (=outer) ring
  const outerPoints = multipoly.reduce<[number, number][]>((points, element) => {
    return [...points, ...element[0]]
  }, []);

  const multi = {
    type: ShapeType.MULTIPOLYGLON,
    geometry: {
      polygons: multipoly.map(polygon => ({
        rings: polygon.map(points => ({ points })),   
        // Outer ring bounds           
        bounds: boundsFromPoints(polygon[0])
      })),
      bounds: boundsFromPoints(outerPoints)
    }
  };

  return toSimplePolygon(multi);
}
