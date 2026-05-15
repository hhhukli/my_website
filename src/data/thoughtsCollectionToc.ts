export type ThoughtsCollectionTocItem = {
	id: string;
	title: string;
	roman: string;
};

export type ThoughtsCollectionTocSection = {
	category: string;
	items: ThoughtsCollectionTocItem[];
};

/** 合辑目录：与 LaTeX 目录对应，罗马字 II–IX */
export const thoughtsCollectionToc: ThoughtsCollectionTocSection[] = [
	{
		category: "朝花朝拾",
		items: [
			{ id: "jingbang", title: "金榜未题名之后，大学生出路分化之谜", roman: "II" },
			{ id: "wodi", title: "我在考研机构的“卧底经历”", roman: "III" },
			{ id: "laoshi", title: "我的大学的老师们", roman: "IV" },
			{ id: "huashi", title: "大学的活化石", roman: "V" },
			{ id: "wangzengqi", title: "我与汪曾祺先生", roman: "VI" },
		],
	},
	{
		category: "AI时代的思考",
		items: [
			{ id: "zhinan", title: "AI时代，是对人的主体性的回归，君子不器", roman: "VII" },
			{
				id: "AImoxing",
				title: "像训练AI模型一样训练自己 Attention is all my power",
				roman: "VIII",
			},
		],
	},
	{
		category: "杂文",
		items: [{ id: "xuanwu", title: "玄武门", roman: "IX" }],
	},
];
