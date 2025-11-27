const fs = require("fs");
const path = require("path");

const FOLDER = path.resolve(__dirname, "../assets/icons/");
const OUT_FILE = path.resolve(__dirname, "../types/generated-icons.d.ts");

const files = fs.readdirSync(FOLDER)
  .filter((f) => f.endsWith("-icon.png") || f.endsWith("-icon.svg"))
  .map((f) => `"${f.replace(/\-icon.(png|svg)$/, "")}"`);

const content = `
declare module "generated-icons" {
  export type IconName = ${files.join(" | ")};
}
`;

fs.writeFileSync(OUT_FILE, content);
