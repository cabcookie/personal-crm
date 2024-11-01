import { a } from "@aws-amplify/backend";

export const tablesWithDeleteProtection = [] as string[];

const prayerSchema = {
  PrayerStatus: a.enum(["NONE", "PRAYING", "ANSWERED", "NOTANSWERED"]),
};

export default prayerSchema;
