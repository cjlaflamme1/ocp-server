const filterAndUniqueIdArray = (
  originalArray: string[],
  idsToFilter: string[],
): string[] => {
  const newFilteredArray = originalArray.filter(
    (i) => !idsToFilter.includes(i),
  );
  const uniqueIds = [...new Set(newFilteredArray)];
  return uniqueIds || [];
};

export default filterAndUniqueIdArray;
