import type { ThemeRegistrationRaw } from "shiki";

/**
 * Beforth dark code theme — deep-navy background with a light, blueprint-style
 * syntax palette. Used by rehype-pretty-code for code blocks only.
 *
 * `settings` drives shiki v4 tokenization; `tokenColors` mirrors it so
 * rehype-pretty-code (which detects JSON themes by the `tokenColors` key)
 * classifies this as a single inline theme rather than a multi-theme map.
 */
const settings: NonNullable<ThemeRegistrationRaw["settings"]> = [
  {
    scope: ["comment"],
    settings: { foreground: "#8B97AC", fontStyle: "italic" },
  },
  {
    scope: ["string", "string.quoted", "string.regexp"],
    settings: { foreground: "#A5C9FF" },
  },
  {
    scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
    settings: { foreground: "#FF8A9B" },
  },
  {
    scope: ["constant", "constant.numeric", "constant.language", "constant.other"],
    settings: { foreground: "#F2CC60" },
  },
  {
    scope: ["variable", "variable.other", "variable.parameter"],
    settings: { foreground: "#E6EDF3" },
  },
  {
    scope: ["entity.name.function", "support.function", "support.macro"],
    settings: { foreground: "#7EE0C3" },
  },
  {
    scope: ["entity.name.tag", "tag"],
    settings: { foreground: "#7EE0C3" },
  },
  {
    scope: ["entity.name.class", "entity.name.type.class", "support.class", "entity.name.type"],
    settings: { foreground: "#F2CC60" },
  },
  {
    scope: ["entity.other.attribute-name", "attribute.name"],
    settings: { foreground: "#A5C9FF" },
  },
  {
    scope: ["punctuation", "punctuation.definition", "meta.brace", "punctuation.separator"],
    settings: { foreground: "#9AA7BD" },
  },
  {
    scope: ["meta.property-name", "support.type.property-name"],
    settings: { foreground: "#7EE0C3" },
  },
  {
    scope: ["constant.character.escape"],
    settings: { foreground: "#F2CC60" },
  },
  {
    scope: ["markup.heading", "markup.bold"],
    settings: { foreground: "#FFFFFF", fontStyle: "bold" },
  },
  {
    scope: ["markup.italic"],
    settings: { fontStyle: "italic" },
  },
  {
    scope: ["markup.link", "markup.link.url"],
    settings: { foreground: "#A5C9FF" },
  },
  {
    scope: ["invalid", "invalid.illegal", "markup.deleted"],
    settings: { foreground: "#FF8A9B" },
  },
];

export const beforthCodeTheme: ThemeRegistrationRaw = {
  name: "beforth-dark",
  type: "dark",
  bg: "#1C2333",
  fg: "#E6EDF3",
  colors: {
    "editor.background": "#1C2333",
    "editor.foreground": "#E6EDF3",
    "editorLineNumber.foreground": "#3D4A63",
  },
  settings,
  tokenColors: settings,
};
