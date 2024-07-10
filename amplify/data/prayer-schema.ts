import { a } from "@aws-amplify/backend";

const prayerSchema = {
  PrayerStatus: a.enum(["NONE", "PRAYING", "ANSWERED", "NOTANSWERED"]),
};

export default prayerSchema;
