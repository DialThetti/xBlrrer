export type FrameAnimation = (distance: number) => string;

export function createAnim(frames: string[], frameLen: number, loop: boolean): FrameAnimation {
  return (distance): string => {
    const timeStamp = Math.abs(distance) / frameLen;
    let index;
    if (loop) {
      index = Math.floor(timeStamp % frames.length);
    } else {
      index = Math.floor(Math.min(timeStamp, frames.length - 1));
    }
    return frames[index];
  };
}
