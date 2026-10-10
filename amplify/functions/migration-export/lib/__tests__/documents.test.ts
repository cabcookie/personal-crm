import { describe, expect, it } from "vitest";
import {
  applyFileHashes,
  blocksToDoc,
  collectMentionIds,
  collectS3Keys,
  jsonFieldToDoc,
  textToDoc,
  type DocSource,
} from "../documents";

const source = (): DocSource => ({
  entity: "activities.json",
  id: "a1",
  warnings: [],
});

const para = (text: string) => ({
  type: "paragraph",
  content: [{ type: "text", text }],
});

describe("textToDoc (format v1)", () => {
  it("turns every line into a paragraph, empty lines into empty paragraphs", () => {
    expect(textToDoc("one\n\ntwo")).toEqual({
      type: "doc",
      content: [para("one"), { type: "paragraph" }, para("two")],
    });
  });

  it("yields one empty paragraph for missing text", () => {
    expect(textToDoc(null)).toEqual({
      type: "doc",
      content: [{ type: "paragraph" }],
    });
  });
});

describe("jsonFieldToDoc (format v2, learnings, introduction)", () => {
  it("parses AWSJSON strings and strips editor-internal attributes", () => {
    const src = source();
    const stored = JSON.stringify({
      type: "doc",
      attrs: { projects: ["p1"] },
      content: [
        {
          type: "paragraph",
          attrs: { blockId: "b1" },
          content: [
            { type: "text", text: "Hi " },
            {
              type: "mention",
              attrs: { id: "person-1", label: "Ada", recordId: "r1" },
            },
          ],
        },
      ],
    });
    expect(jsonFieldToDoc(stored, src)).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Hi " },
            { type: "mention", attrs: { id: "person-1", label: "Ada" } },
          ],
        },
      ],
    });
    expect(src.warnings).toEqual([]);
  });

  it("renames s3image to image and keeps only the s3Key", () => {
    const doc = jsonFieldToDoc(
      {
        type: "doc",
        content: [
          {
            type: "s3image",
            attrs: {
              s3Key: "user-files/id/x.png",
              src: "https://signed",
              expiresAt: "2026-01-01",
              fileKey: "x.png",
              blockId: "b",
            },
          },
        ],
      },
      source()
    );
    expect(doc.content).toEqual([
      {
        type: "image",
        attrs: { fileHash: null, s3Key: "user-files/id/x.png" },
      },
    ]);
  });

  it("keeps marks and drops their null attributes", () => {
    const doc = jsonFieldToDoc(
      {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "link",
                marks: [
                  { type: "bold" },
                  { type: "link", attrs: { href: "https://x", target: null } },
                ],
              },
            ],
          },
        ],
      },
      source()
    );
    expect(doc.content[0].content?.[0].marks).toEqual([
      { type: "bold" },
      { type: "link", attrs: { href: "https://x" } },
    ]);
  });

  it("reports unknown node types and keeps them verbatim", () => {
    const src = source();
    const doc = jsonFieldToDoc(
      { type: "doc", content: [{ type: "table", attrs: { x: 1 } }] },
      src
    );
    expect(doc.content).toEqual([{ type: "table", attrs: { x: 1 } }]);
    expect(src.warnings).toEqual([
      {
        code: "UNKNOWN_NODE_TYPE",
        entity: "activities.json",
        id: "a1",
        detail: "table",
      },
    ]);
  });

  it("reports unparseable content and returns an empty document", () => {
    const src = source();
    expect(jsonFieldToDoc("{not json", src)).toEqual({
      type: "doc",
      content: [],
    });
    expect(src.warnings[0].code).toBe("UNPARSEABLE_CONTENT");
  });

  it("returns an empty document for missing content", () => {
    expect(jsonFieldToDoc(null, source())).toEqual({
      type: "doc",
      content: [],
    });
  });
});

describe("blocksToDoc (format v3)", () => {
  const block = (id: string, content: object) => ({
    id,
    type: (content as { type: string }).type,
    content: JSON.stringify(content),
  });
  const listItem = (type: string, text: string) => ({
    type,
    attrs: { blockId: "x" },
    content: [para(text)],
  });

  it("follows noteBlockIds order and skips unknown ids", () => {
    const doc = blocksToDoc(
      ["b2", "missing", "b1"],
      [block("b1", para("first")), block("b2", para("second"))],
      [],
      source()
    );
    expect(doc.content).toEqual([para("second"), para("first")]);
  });

  it("wraps consecutive list blocks into their list container", () => {
    const doc = blocksToDoc(
      ["b1", "b2", "b3", "b4"],
      [
        block("b1", listItem("listItem", "a")),
        block("b2", listItem("listItem", "b")),
        block("b3", listItem("listItemOrdered", "c")),
        block("b4", para("after")),
      ],
      [],
      source()
    );
    expect(doc.content).toEqual([
      {
        type: "bulletList",
        content: [
          { type: "listItem", content: [para("a")] },
          { type: "listItem", content: [para("b")] },
        ],
      },
      {
        type: "orderedList",
        attrs: { start: 1 },
        content: [{ type: "listItem", content: [para("c")] }],
      },
      para("after"),
    ]);
  });

  it("takes task content and state from the linked todo", () => {
    const doc = blocksToDoc(
      ["t1", "t2"],
      [
        { id: "t1", type: "taskItem", content: null, todoId: "todo-1" },
        { id: "t2", type: "taskItem", content: null, todoId: "todo-2" },
      ],
      [
        {
          id: "todo-1",
          todo: JSON.stringify(listItem("taskItem", "call Ada")),
          status: "DONE",
          doneOn: "2026-03-01",
        },
        {
          id: "todo-2",
          todo: JSON.stringify(listItem("taskItem", "write")),
          status: "OPEN",
          doneOn: null,
        },
      ],
      source()
    );
    expect(doc.content).toEqual([
      {
        type: "taskList",
        content: [
          {
            type: "taskItem",
            attrs: { todoId: "todo-1", checked: true, doneOn: "2026-03-01" },
            content: [para("call Ada")],
          },
          {
            type: "taskItem",
            attrs: { todoId: "todo-2", checked: false, doneOn: null },
            content: [para("write")],
          },
        ],
      },
    ]);
  });

  it("skips task blocks whose todo is missing", () => {
    const doc = blocksToDoc(
      ["t1"],
      [{ id: "t1", type: "taskItem", content: null, todoId: "gone" }],
      [],
      source()
    );
    expect(doc.content).toEqual([]);
  });
});

describe("collectors and file hashes", () => {
  const doc = jsonFieldToDoc(
    {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "mention", attrs: { id: "p1" } },
            { type: "mention", attrs: { id: "p2" } },
            { type: "mention", attrs: { id: "p1" } },
          ],
        },
        { type: "s3image", attrs: { s3Key: "k1" } },
        { type: "s3image", attrs: { s3Key: "k2" } },
      ],
    },
    source()
  );

  it("collects distinct mention ids in document order", () => {
    expect(collectMentionIds(doc)).toEqual(["p1", "p2"]);
  });

  it("collects distinct s3 keys and applies hashes", () => {
    expect(collectS3Keys(doc)).toEqual(["k1", "k2"]);
    applyFileHashes(
      doc,
      new Map([
        ["k1", "hash-1"],
        ["k2", null],
      ])
    );
    expect(doc.content.slice(1)).toEqual([
      { type: "image", attrs: { fileHash: "hash-1", s3Key: "k1" } },
      { type: "image", attrs: { fileHash: null, s3Key: "k2" } },
    ]);
  });
});
