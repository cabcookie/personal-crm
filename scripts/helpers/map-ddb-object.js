const mapObjectToDdb = (object) =>
  Object.keys(object).reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        typeof object[key] === "number"
          ? { N: object[key].toString() }
          : typeof object[key] === "boolean"
          ? { BOOL: object[key] }
          : { S: object[key] },
    }),
    {}
  );

const mapDdbToObject = (ddbObject) =>
  Object.keys(ddbObject).reduce(
    (acc, key) => ({
      ...acc,
      ...(key === "__typename" || key === "owner"
        ? {}
        : {
            [key]:
              Object.keys(ddbObject[key])[0] === "N"
                ? parseInt(ddbObject[key][Object.keys(ddbObject[key])[0]])
                : ddbObject[key][Object.keys(ddbObject[key])[0]],
          }),
    }),
    {}
  );

module.exports = { mapDdbToObject, mapObjectToDdb };
