import type { AnnotationBody, ImageAnnotation } from '@annotorious/annotorious';

export type MergeOptions =
  | { strategy: 'merge_bodies' | 'keep_first_bodies' }
  | { bodies: AnnotationBody[] | ((selected: ImageAnnotation[]) => AnnotationBody[]) };