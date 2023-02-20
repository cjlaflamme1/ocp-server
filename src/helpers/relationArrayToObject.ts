export const returnRelationsObject = (arr: string[]) => {
  const res = arr.reduce((acc, curr) => ((acc[curr] = true), acc), {});
  return res;
};
