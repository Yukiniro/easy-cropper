export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface RelativeRect extends Rect {}

export type TrackPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
