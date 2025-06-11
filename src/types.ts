import type { AnnotationBody } from '@annotorious/annotorious';

export type MergeOptions =
  | { strategy: 'merge_bodies' | 'keep_first_bodies' }
  | { bodies: AnnotationBody[] };