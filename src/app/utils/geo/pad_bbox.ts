

/**
 * Add padding to the outside of a bounding box
 * 
 * @param bbox [south, west, north, east]
 * @param paddingFactor Additional padding to add to x and y, as a percent of total width (0.1 = 10% on each side)
 * @returns 
 */
export default function padBbox(bbox: number[], paddingFactor: number): number[] {
  const scalarY = (bbox[2] - bbox[0]) * paddingFactor;
  const scalarX = (bbox[3] - bbox[1]) * paddingFactor;
  return [
    bbox[0] - scalarY,
    bbox[1] - scalarX,
    bbox[2] + scalarY,
    bbox[3] + scalarX,
  ];
}