const sortArray = (arr) => [
  ...arr
    .map((item) => (typeof item === "number" ? item.toString() : item))
    .filter((item) => typeof item === "string")
    .sort(),
  ...arr.filter(Array.isArray).map(sortArray),
  ...arr.filter((i) => typeof i === "object" && !Array.isArray(i)),
];

const compareJSON = (obj1, obj2, path = "") => {
  const result = {
    deleted: [],
    updated: [],
    added: [],
  };

  if (Array.isArray(obj1) && !Array.isArray(obj2)) {
    console.log(obj2);
    return {
      deleted: [],
      added: [],
      updated: [`${path || "ROOT"}: obj1 is array and obj2 is not`],
    };
  }
  if (!Array.isArray(obj1) && Array.isArray(obj2))
    return {
      deleted: [],
      added: [],
      updated: [`${path || "ROOT"}: obj2 is array and obj1 is not`],
    };

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const json1 = sortArray(obj1);
    const json2 = sortArray(obj2);
    if (json1.length > json2.length)
      json1
        .slice(json2.length, json1.length)
        .forEach((item, index) =>
          result.deleted.push(
            `${path || "ROOT"}.${index + json2.length}: "${
              typeof item === "object" ? JSON.stringify(item) : item
            }"`
          )
        );
    if (json2.length > json1.length)
      json2
        .slice(json1.length, json2.length)
        .forEach((item, index) =>
          result.added.push(
            `${path || "ROOT"}.${index + json1.length}: "${
              typeof item === "object" ? JSON.stringify(item) : item
            }"`
          )
        );
    json1
      .slice(0, Math.min(json1.length, json2.length))
      .forEach((item, index) => {
        const currentPath = path ? `${path}[${index}]` : `[${index}]`;
        if (typeof item === "object" && typeof json2[index] === "object") {
          const subResult = compareJSON(item, json2[index], currentPath);
          result.deleted.push(...subResult.deleted);
          result.updated.push(...subResult.updated);
          result.added.push(...subResult.added);
        } else if (
          typeof item === "object" &&
          typeof json2[index] !== "object"
        ) {
          result.updated.push(
            `${currentPath}: "${JSON.stringify(item)}" to "${json2[index]}"`
          );
        } else if (
          typeof item !== "object" &&
          typeof json2[index] === "object"
        ) {
          result.updated.push(
            `${currentPath}: "${item}" to "${JSON.stringify(json2[index])}"`
          );
        } else if (item !== json2[index]) {
          result.updated.push(`${currentPath}: "${item}" to "${json2[index]}"`);
        }
      });
    return result;
  }

  Object.keys(obj1).forEach((key) => {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in obj2)) {
      result.deleted.push(currentPath);
    } else if (
      typeof obj1[key] === "object" &&
      obj1[key] !== null &&
      typeof obj2[key] === "object" &&
      obj2[key] !== null
    ) {
      const subResult = compareJSON(obj1[key], obj2[key], currentPath);
      result.deleted.push(...subResult.deleted);
      result.updated.push(...subResult.updated);
      result.added.push(...subResult.added);
    } else if (obj1[key] !== obj2[key]) {
      result.updated.push(`${currentPath}: "${obj1[key]}" to "${obj2[key]}"`);
    }
  });

  Object.keys(obj2).forEach((key) => {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in obj1)) {
      result.added.push(
        `${currentPath}: "${
          typeof obj2[key] === "object" ? JSON.stringify(obj2[key]) : obj2[key]
        }"`
      );
    }
  });

  return result;
};

module.exports = compareJSON;
