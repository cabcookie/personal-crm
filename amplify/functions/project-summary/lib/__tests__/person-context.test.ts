import { describe, expect, it } from "vitest";
import {
  hasActivity,
  hashContext,
  relationFor,
  renderPersonContext,
  type PersonContext,
} from "../person-context";

const base: PersonContext = {
  name: "Mark Hübner",
  employments: [],
  relationships: [],
  learnings: [],
  meetings: [],
  mentions: [],
};

describe("relationFor", () => {
  it("keeps the type for the from-direction (B is A's T)", () => {
    expect(relationFor("from", "child")).toBe("child");
    expect(relationFor("from", "manager")).toBe("manager");
  });

  it("flips asymmetric types for the to-direction", () => {
    expect(relationFor("to", "child")).toBe("parent");
    expect(relationFor("to", "parent")).toBe("child");
    expect(relationFor("to", "manager")).toBe("employer");
  });

  it("keeps symmetric types and falls back to contact", () => {
    expect(relationFor("to", "spouse")).toBe("spouse");
    expect(relationFor("to", null)).toBe("contact");
  });
});

describe("hasActivity", () => {
  it("is false with only static facts", () => {
    expect(
      hasActivity({
        ...base,
        employments: [{ accountName: "ALDI" }],
        relationships: [{ otherName: "Anna", relation: "spouse" }],
      })
    ).toBe(false);
  });

  it("is true with a learning, a meeting or a mention", () => {
    expect(hasActivity({ ...base, learnings: [{ text: "x" }] })).toBe(true);
    expect(hasActivity({ ...base, meetings: ["# m"] })).toBe(true);
    expect(
      hasActivity({ ...base, mentions: [{ header: "h", body: "b" }] })
    ).toBe(true);
  });
});

describe("renderPersonContext", () => {
  const full: PersonContext = {
    name: "Mark Hübner",
    howToSay: "Hue-bner",
    birthday: "1980-05-01",
    employments: [
      {
        accountName: "ALDI E-Commerce",
        position: "CEO",
        startDate: "2024-01-01",
      },
      { accountName: "Lidl", position: null, endDate: "2023-12-31" },
    ],
    relationships: [{ otherName: "Anna Hübner", relation: "spouse" }],
    learnings: [
      { learnedOn: "2026-09-01", text: "Loves\n\ncycling", prayer: "PRAYING" },
    ],
    meetings: [
      "# 18.10.2026, Meeting: Weekly\n\n## Topic: Shop\n\n- [ ] Send deck",
    ],
    mentions: [{ header: "17.10.2026", body: "# Idea\n\nAsk Mark" }],
  };

  it("renders all sections in order with nested headings", () => {
    const md = renderPersonContext(full);
    expect(md).toContain("# Person: Mark Hübner");
    expect(md).toContain("- Pronunciation: Hue-bner");
    expect(md).toContain("- Birthday: 1980-05-01");
    expect(md).toContain("- CEO at ALDI E-Commerce (2024-01-01 to today)");
    expect(md).toContain("- Lidl (? to 2023-12-31)");
    expect(md).toContain("- Anna Hübner is their spouse");
    expect(md).toContain("- 2026-09-01: Loves cycling (prayer: PRAYING)");
    // Meeting headings are bumped below the "## Recent meetings" section.
    expect(md).toContain("### 18.10.2026, Meeting: Weekly");
    expect(md).toContain("#### Topic: Shop");
    expect(md).toContain("### 17.10.2026");
    expect(md).toContain("### Idea");

    const order = [
      "## Employments",
      "## Relationships",
      "## Learnings about them",
      "## Recent meetings with them",
      "## Recent notes mentioning them",
    ].map((h) => md.indexOf(h));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("omits empty sections", () => {
    const md = renderPersonContext(base);
    expect(md).toBe("# Person: Mark Hübner");
  });

  it("is deterministic, so the hash only changes with the content", () => {
    const a = hashContext(renderPersonContext(full));
    const b = hashContext(renderPersonContext({ ...full }));
    const c = hashContext(
      renderPersonContext({
        ...full,
        learnings: [...full.learnings, { text: "New learning" }],
      })
    );
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });
});
