/**
 * 将 src/content/collection-raw 下的 UTF-8 正文打包为
 * public/thoughts-collection/<id>.json，供 /thoughts 合辑正文按需 fetch。
 *
 * 用法：node scripts/pack-thoughts-collection.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const rawDir = path.join(root, "src", "content", "collection-raw");
const outDir = path.join(root, "public", "thoughts-collection");

const titles = {
	youji: "我的优绩主义死在了初升高的那个夏天",
	baoli: "大学课堂上老师一直在被冷暴力",
	lezi: "高中乐子三则",
	jingbang: "金榜未题名之后，大学生出路分化之谜",
	wodi: "我在考研机构的“卧底经历”",
	laoshi: "我的大学的老师们",
	huashi: "大学的活化石",
	wangzengqi: "我与汪曾祺先生",
	zhinan: "AI时代，是对人的主体性的回归，君子不器",
	AImoxing: "像训练AI模型一样训练自己 Attention is all my power",
	xuanwu: "玄武门",
	kugu: "枯骨与悲鸣",
	zasui: "杂碎",
	amo: "《给阿麽的情书》不像是在看一部电影",
	zuohao: "坐好",
};

/** zhinan：在原文中插入 HTML 表格块（占位符行） */
const zhinanTableHtml = `<div class="collection-table-wrap overflow-x-auto my-8 border border-[#002FA7]/20 rounded-lg bg-white/80">
<table class="w-full min-w-[36rem] text-left text-sm border-collapse">
<thead>
<tr class="bg-[#002FA7]/10 text-[#002FA7]">
<th class="p-3 border border-gray-200 font-semibold w-32">类别</th>
<th class="p-3 border border-gray-200 font-semibold">问题示例</th>
</tr>
</thead>
<tbody class="text-gray-800">
<tr><td class="p-3 border border-gray-200 align-top font-medium">字词/概念类</td><td class="p-3 border border-gray-200">长袖善舞形容什么样的人；修罗场是什么意思；兼祧、宗祧是什么意思</td></tr>
<tr><td class="p-3 border border-gray-200 align-top font-medium">历史/思想类</td><td class="p-3 border border-gray-200">玄武门之变中李世民和李建成的关系；中庸之道怎么理解；袒肚弥勒与怒目金刚的含义</td></tr>
<tr><td class="p-3 border border-gray-200 align-top font-medium">专业/学业类</td><td class="p-3 border border-gray-200">通信工程相关的数字信号处理、硬件知识；SolidWorks（SW）建模；逻辑电路；考研复试、院校选择、考研机构体验分析</td></tr>
<tr><td class="p-3 border border-gray-200 align-top font-medium">自我/处世类</td><td class="p-3 border border-gray-200">为了好的目的「长袖善舞」算什么；外圆内方、手段与目的；用 MBTI、星座、哲学理论梳理自我认知</td></tr>
<tr><td class="p-3 border border-gray-200 align-top font-medium">健康/生活类</td><td class="p-3 border border-gray-200">腱鞘炎、头皮出油、头发细软塌、湿气重；运动健身、体态、腰部安全锻炼；跑步会不会粗腿</td></tr>
<tr><td class="p-3 border border-gray-200 align-top font-medium">兴趣文化类</td><td class="p-3 border border-gray-200">《魔兽世界》古尔丹相关台词出处；游戏、影视角色与经典台词查询</td></tr>
</tbody>
</table>
</div>`;

function readRaw(id) {
	const mergedPath = path.join(rawDir, `${id}.merged.txt`);
	if (fs.existsSync(mergedPath)) {
		return fs.readFileSync(mergedPath, "utf8");
	}
	const exactPath = path.join(rawDir, `${id}.txt`);
	if (fs.existsSync(exactPath)) {
		return fs.readFileSync(exactPath, "utf8");
	}
	const parts = [];
	for (let i = 0; i < 20; i++) {
		const p = path.join(rawDir, `${id}-part${i}.txt`);
		if (fs.existsSync(p)) parts.push(fs.readFileSync(p, "utf8"));
	}
	if (parts.length) return parts.join("\n\n");
	throw new Error(`Missing article source: ${id}`);
}

function toParagraphBlocks(text) {
	const paragraphs = text
		.split(/\n\s*\n+/)
		.map((s) => s.trim())
		.filter(Boolean);
	return paragraphs.map((text) => ({ type: "p", text }));
}

function writeJson(id, blocks) {
	const out = { title: titles[id], blocks };
	fs.mkdirSync(outDir, { recursive: true });
	fs.writeFileSync(path.join(outDir, `${id}.json`), JSON.stringify(out), "utf8");
	console.log("wrote", id, "blocks", blocks.length);
}

for (const id of Object.keys(titles)) {
	if (id === "zhinan") {
		const raw = readRaw("zhinan");
		const marker = "<<<TABLE>>>";
		const idx = raw.indexOf(marker);
		let blocks;
		if (idx === -1) {
			blocks = toParagraphBlocks(raw);
		} else {
			const before = raw.slice(0, idx).trim();
			const after = raw.slice(idx + marker.length).trim();
			blocks = [...toParagraphBlocks(before), { type: "html", html: zhinanTableHtml }, ...toParagraphBlocks(after)];
		}
		writeJson("zhinan", blocks);
		continue;
	}
	const raw = readRaw(id);
	writeJson(id, toParagraphBlocks(raw));
}
