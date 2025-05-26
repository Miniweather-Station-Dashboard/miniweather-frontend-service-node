
export const toSnakeCase = (str) =>
  str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_");