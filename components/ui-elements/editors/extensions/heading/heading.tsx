import Heading from "@tiptap/extension-heading";

const HeadingCustom = Heading.configure({
  levels: [1, 2, 3, 4],
}).extend({
  renderHTML: ({ node, HTMLAttributes }) => {
    const level = node.attrs.level;
    return [
      `h${level}`,
      HTMLAttributes,
      ["span", 0],
      [
        "span",
        {
          class: "ml-2 inline-block text-muted-foreground font-normal text-sm",
        },
        "#".repeat(level),
      ],
    ];
  },
});

export default HeadingCustom;
