export const parseBoolean = (value) => {
  if (value === null || value === undefined) return undefined;

  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;

  return value;
};
