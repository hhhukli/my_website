import fs from "node:fs";
import path from "node:path";

const source = process.argv[2];
if (!source) throw new Error("Usage: node scripts/import-thoughts-latex.mjs <latex-file>");

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "src", "content", "collection-raw");
const latex = fs.readFileSync(source, "utf8").replace(/\r\n/g, "\n");
const sections = [...latex.matchAll(/\\section\{(.+?)(\d{2}\/\d{1,2}\/\d{1,2})\\label\{([^}]+)\}\}/g)];

function cleanBody(body, id) {
  if (id === "zhinan") body = body.replace(/\\begin\{table\}[\s\S]*?\\end\{table\}/, "\n\n<<<TABLE>>>\n\n");
  return body
    .replace(/\\newpage/g, "")
    .replace(/\\newline\s*\\newline/g, "\n\n")
    .replace(/\\newline/g, "\n")
    .replace(/\\textbf\{([^{}]*)\}/g, "$1")
    .replace(/\\textit\{([^{}]*)\}/g, "$1")
    .replace(/\\%/g, "%")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

fs.mkdirSync(outDir, { recursive: true });
for (let i = 0; i < sections.length; i++) {
  const [, title, shortDate, id] = sections[i];
  const start = sections[i].index + sections[i][0].length;
  const end = sections[i + 1]?.index ?? latex.indexOf("\\end{document}", start);
  const body = cleanBody(latex.slice(start, end), id);
  fs.writeFileSync(path.join(outDir, `${id}.txt`), `${body}\n`, "utf8");
  console.log(`${id}\t20${shortDate}\t${title}`);
}
