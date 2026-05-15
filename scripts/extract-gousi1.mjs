import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pdfPath = path.join(root, "public", "构思1.pdf");

let raw = fs.readFileSync(pdfPath, "utf8");
raw = raw.replace(/\r\n/g, "\n");
raw = raw.replace(/--\s*\d+\s+of\s+\d+\s*--/g, "\n");

function normalize(t) {
    let prev;
    let out = t;
    do {
        prev = out;
        out = out.replace(
            /([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]) ([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])/g,
            "$1$2"
        );
    } while (out !== prev);
    return out.replace(/\n{3,}/g, "\n\n").trim();
}

const markers = [
    {
        id: "jinbang",
        key: "II. 金榜未题名之后，大学生出路分化之谜",
        title: "金榜未题名之后，大学生出路分化之谜",
        roman: "II",
    },
    {
        id: "wodi",
        key: "III. 我在考研机构的“卧底经历”",
        title: "我在考研机构的“卧底经历”",
        roman: "III",
    },
    {
        id: "teachers",
        key: "IV. 我的大学的老师们",
        title: "我的大学的老师们",
        roman: "IV",
    },
    {
        id: "huashi",
        key: "V. 大学的活化石",
        title: "大学的活化石",
        roman: "V",
    },
    {
        id: "wangzengqi",
        key: "VI. 我与汪曾祺先生",
        title: "我与汪曾祺先生",
        roman: "VI",
    },
    {
        id: "ai-junzi",
        key: "VII. AI 时代，是对人的主体性的回归，君子不器",
        title: "AI 时代，是对人的主体性的回归，君子不器",
        roman: "VII",
    },
    {
        id: "attention",
        key: "VIII. 像训练 AI 模型一样训练自己 Attention is all",
        title: "像训练 AI 模型一样训练自己 Attention is all my power",
        roman: "VIII",
    },
    { id: "xuanwumen", key: "IX. 玄武门", title: "玄武门", roman: "IX" },
];

const endKey = "ACKNOWLEDGEMENT";
let body = raw;
const idxBody = raw.indexOf("II. 金榜");
if (idxBody >= 0) body = raw.slice(idxBody);

const chunks = {};
for (let i = 0; i < markers.length; i++) {
    const m = markers[i];
    const start = body.indexOf(m.key);
    if (start === -1) {
        console.error("missing marker:", m.key);
        process.exit(1);
    }
    const nextStart =
        i + 1 < markers.length
            ? body.indexOf(markers[i + 1].key, start + 5)
            : body.indexOf(endKey, start + 5);
    let text = nextStart > start ? body.slice(start, nextStart) : body.slice(start);
    const nl = text.indexOf("\n");
    if (nl >= 0) text = text.slice(nl + 1);
    chunks[m.id] = normalize(text);
}

const sections = [
    {
        id: "zhao",
        title: "朝花朝拾",
        articleIds: ["jinbang", "wodi", "teachers", "huashi", "wangzengqi"],
    },
    { id: "ai", title: "AI 时代的思考", articleIds: ["ai-junzi", "attention"] },
    { id: "zawen", title: "杂文", articleIds: ["xuanwumen"] },
];

const out = {
    pdfHref: "/构思1.pdf",
    sections: sections.map((sec) => ({
        id: sec.id,
        title: sec.title,
        articles: sec.articleIds.map((id) => {
            const m = markers.find((x) => x.id === id);
            return {
                id: m.id,
                title: m.title,
                roman: m.roman,
                body: chunks[m.id],
            };
        }),
    })),
};

const outDir = path.join(root, "src", "data");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "gousi1-collection.json");
fs.writeFileSync(outPath, JSON.stringify(out), "utf8");
console.log("wrote", outPath, "bytes", fs.statSync(outPath).size);
