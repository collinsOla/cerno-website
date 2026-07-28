// A tiny mutable store shared between the Lenis scroll loop (writer) and the
// react-three-fiber render loop (reader). Deliberately not React state — it
// updates every frame and must never trigger re-renders.
export const scrollStore = {
  progress: 0, // 0..1 through the whole document
  velocity: 0, // smoothed scroll velocity
  px: 0, // pointer x, -1..1
  py: 0, // pointer y, -1..1
};

export type ScrollStore = typeof scrollStore;
