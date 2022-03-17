export function randomInteger(min : number, max : number) {
  // Force Min and Max to be Integers
  min = Math.ceil(min);
  max = Math.floor(max);

  // Generate Random Seed
  const seed : number = Math.random();
  return Math.floor(seed * (max - min) + min);
}

export function randomBoolean() {
  return Math.random() >= 0.5
}