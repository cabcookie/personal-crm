const { generateStartEndDate } = require("../helpers/create-dates");
const { createTableItem } = require("../helpers/create-table-item");
const { getTableItems } = require("../helpers/valid-table-fields");
const { faker } = require("@faker-js/faker");

const createTerritories = async (ownerId) => {
  const existing = await getTableItems("Territory", ownerId);
  if (existing.length) return existing;
  return await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const territory = await createTableItem(
        "Territory",
        {
          name: { S: faker.git.commitSha() },
        },
        ownerId
      );
      const dates = generateStartEndDate();
      await createTableItem(
        "TerritoryResponsibility",
        {
          territoryId: territory.id,
          ...dates,
        },
        ownerId
      );
      return {
        id: territory.id,
        name: territory.name,
        ...dates,
      };
    })
  );
};

module.exports = { createTerritories };
