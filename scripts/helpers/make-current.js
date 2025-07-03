const { addDays, differenceInDays, formatISO } = require("date-fns");
const { flow, map, sortBy, first } = require("lodash/fp");

const makeDate = (str) => new Date(str);
const getDaysDiff = (date) => differenceInDays(new Date(), date) - 1;

const daysDiff = flow(
  require,
  map("finishedOn"),
  map(makeDate),
  sortBy((d) => -d),
  first,
  getDaysDiff
)("../import-data/_activities.json");

const makeCurrent = (date, dateOnly) =>
  flow(
    () => addDays(date, daysDiff),
    (d) => formatISO(d, { representation: !dateOnly ? "complete" : "date" })
  )();

const addPropWithCurrentDate = (propName, date, dateOnly) =>
  !date ? {} : { [propName]: makeCurrent(date, dateOnly) };

module.exports = {
  addPropWithCurrentDate,
  makeCurrent,
};
