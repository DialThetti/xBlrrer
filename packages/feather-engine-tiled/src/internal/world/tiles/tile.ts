export default class Tile {
  constructor(
    public name: string,
    public types: string[],
    public collider?: { x: number; y: number; width: number; height: number }
  ) {}
}
