const { faker } = require("@faker-js/faker");
const { addMonths } = require("date-fns");

const generateStartEndDate = () => {
  const today = new Date();
  const rand = Math.random();
  const startDate =
    rand < 0.2
      ? faker.date.between({ from: today, to: addMonths(today, 12) })
      : rand < 0.4
      ? faker.date.between({ from: addMonths(today, -3), to: today })
      : faker.date.between({ from: addMonths(today, -24), to: today });
  const endDateRand = Math.random();
  const endDate =
    endDateRand < 0.3
      ? null
      : endDateRand < 0.8
      ? faker.date.between({
          from: addMonths(today, 2),
          to: addMonths(today, 12),
        })
      : faker.date.between({ from: addMonths(today, -2), to: today });
  return {
    startDate: { S: startDate.toISOString() },
    ...(!endDate ? {} : { endDate: { S: endDate.toISOString() } }),
  };
};

module.exports = {
  generateStartEndDate,
};
