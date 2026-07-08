export type ThoughtsCollectionTocItem = {
	id: string;
	title: string;
	date: string;
	roman: string;
};

export type ThoughtsCollectionTocSection = {
	category: string;
	items: ThoughtsCollectionTocItem[];
};

/** 合辑目录：标题与日期来自 LaTeX 的 section 信息。 */
export const thoughtsCollectionToc: ThoughtsCollectionTocSection[] = [
	{
		category: "朝花朝拾",
		items: [
			{ id: "youji", title: "我的优绩主义死在了初升高的那个夏天", date: "2026.05.17", roman: "I" },
			{ id: "baoli", title: "大学课堂上老师一直在被冷暴力", date: "2026.06.13", roman: "II" },
			{ id: "lezi", title: "高中乐子三则", date: "2026.06.03", roman: "III" },
			{ id: "jingbang", title: "金榜未题名之后，大学生出路分化之谜", date: "2026.04.25", roman: "IV" },
			{ id: "wodi", title: "我在考研机构的“卧底经历”", date: "2026.04.18", roman: "V" },
			{ id: "laoshi", title: "我的大学的老师们", date: "2026.04.14", roman: "VI" },
			{ id: "huashi", title: "大学的活化石", date: "2026.04.25", roman: "VII" },
			{ id: "wangzengqi", title: "我与汪曾祺先生", date: "2026.05.05", roman: "VIII" },
		],
	},
	{
		category: "AI时代的思考",
		items: [
			{ id: "zhinan", title: "AI时代，是对人的主体性的回归，君子不器", date: "2026.04.23", roman: "IX" },
			{ id: "AImoxing", title: "像训练AI模型一样训练自己 Attention is all my power", date: "2026.04.30", roman: "X" },
		],
	},
	{
		category: "杂文",
		items: [
			{ id: "xuanwu", title: "玄武门", date: "2026.04.21", roman: "XI" },
			{ id: "kugu", title: "枯骨与悲鸣", date: "2026.05.26", roman: "XII" },
			{ id: "zasui", title: "杂碎", date: "2026.05.22", roman: "XIII" },
			{ id: "amo", title: "《给阿麽的情书》不像是在看一部电影", date: "2026.05.18", roman: "XIV" },
			{ id: "zuohao", title: "坐好", date: "2026.06.06", roman: "XV" },
		],
	},
];
