export const arrayRandomiser = <T>(array: T[]) =>
  array.sort(() => 0.5 - Math.random());
