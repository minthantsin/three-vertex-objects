/**
 * Represents a 2D axis aligned boundary box.
 */
export class AABB2 {
  left: number;
  top: number;
  width: number;
  height: number;

  constructor(left = 0, top = 0, width = 0, height = 0) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }

  set(left: number, top: number, width: number, height: number) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    return this;
  }

  static from(
    {
      top,
      left,
      width,
      height,
    }: {
      top: number;
      left: number;
      width: number;
      height: number;
    },
    target?: AABB2,
  ): AABB2 {
    return target ? target.set(left, top, width, height) : new AABB2(left, top, width, height);
  }

  clone() {
    return new AABB2(this.left, this.top, this.width, this.height);
  }

  copy(aabb: AABB2) {
    this.top = aabb.top;
    this.left = aabb.left;
    this.width = aabb.width;
    this.height = aabb.height;
    return this;
  }

  get right() {
    return this.left + this.width;
  }
  get bottom() {
    return this.top + this.height;
  }

  get centerX() {
    return this.left + this.width / 2;
  }
  get centerY() {
    return this.top + this.height / 2;
  }

  is(left: number, top: number, width: number, height: number) {
    return this.top === top && this.left === left && this.width === width && this.height === height;
  }

  isEqual(aabb: AABB2) {
    return (
      this.top === aabb.top &&
      this.left === aabb.left &&
      this.width === aabb.width &&
      this.height === aabb.height
    );
  }

  /**
   * @returns `true` if point is within
   */
  isInside(x: number, y: number) {
    return this.left <= x && x < this.right && this.top <= y && y < this.bottom;
  }

  /**
   * @returns `true` if the two overlap
   */
  isIntersecting(aabb: AABB2) {
    return !(
      aabb.right <= this.left ||
      aabb.left >= this.right ||
      aabb.bottom <= this.top ||
      aabb.top >= this.bottom
    );
  }

  isNorthWest(x: number, y: number) {
    return (this.right <= x || this.left < x) && (this.top < y || this.bottom <= y);
  }

  isNorthEast(x: number, y: number) {
    return (this.right > x || this.left >= x) && (this.top < y || this.bottom <= y);
  }

  isSouthEast(x: number, y: number) {
    return (this.right > x || this.left >= x) && (this.top >= y || this.bottom > y);
  }

  isSouthWest(x: number, y: number) {
    return (this.right <= x || this.left < x) && (this.top >= y || this.bottom > y);
  }
}