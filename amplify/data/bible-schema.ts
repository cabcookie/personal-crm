import { a } from "@aws-amplify/backend";

const bibleSchema = {
  Section: a.enum(["OLD", "NEW"]),
  BookOfBible: a
    .model({
      notionId: a.integer(),
      book: a.string().required(),
      chapters: a
        .hasMany("NotesBibleChapter", "bookId")
        .authorization((allow) => [allow.owner()]),
      alias: a.string().required(),
      section: a.ref("Section").required(),
      noOfChapters: a.integer(),
    })
    .authorization((allow) => [allow.authenticated().to(["read"])]),
  NotesBibleChapter: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      bookId: a.id().required(),
      chapter: a.integer().required(),
      book: a.belongsTo("BookOfBible", "bookId"),
      note: a.string(),
      formatVersion: a.integer().default(1),
      noteJson: a.json(),
    })
    .authorization((allow) => [allow.owner()]),
};

export default bibleSchema;
