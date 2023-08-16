const HtmlWebpackPlugin = require("safe-require")("html-webpack-plugin");

class InlineChunkWebpackPlugin {
	constructor(tests) {
		// 获取需要设置为行内js的文件名称数组
		this.tests = tests;
	}

	apply(compiler) {
		// 注册compilation hooks
		compiler.hooks.compilation.tap("InlineChunkWebpackPlugin", (compilation) => {
			const hooks = HtmlWebpackPlugin.getHooks(compilation); // 获取HtmlWebpackPlugin的hooks

			// 注册 alterAssetTagGroups hooks
			hooks.alterAssetTagGroups.tap("InlineChunkWebpackPlugin", (assets) => {
				// 处理headTags和bodyTags
				assets.headTags = this.getInlineTag(assets.headTags, compilation.assets);
				assets.bodyTags = this.getInlineTag(assets.bodyTags, compilation.assets);
			});

			// 注册 afterEmit hooks
			// 等HtmlWebpackPlugin处理完成之后，从compilation.assets中删除原有的runtime内容
			hooks.afterEmit.tap("InlineChunkHtmlPlugin", () => {
				Object.keys(compilation.assets).forEach((assetName) => {
					if (this.tests.some((test) => assetName.match(test))) {
						delete compilation.assets[assetName];
					}
				});
			});
		});
	}

	getInlineTag(tags, assets) {
		/**
				原先的headTags
			[
				{
					tagName: 'script',
					voidTag: false,
					meta: { plugin: 'html-webpack-plugin' },
					attributes: { defer: true, type: undefined, src: 'js/main.js' }
				},
				{
					tagName: 'script',
					voidTag: false,
					meta: { plugin: 'html-webpack-plugin' },
					attributes: { defer: true, type: undefined, src: 'js/runtime~main.js' }
				},
			]

			修改为：
			[
				{
					tagName: 'script',
					voidTag: false,
					meta: { plugin: 'html-webpack-plugin' },
					attributes: { defer: true, type: undefined, src: 'js/main.js' }
				},
				{
					tagName: 'script',
					innerHTML: runtime文件的内容,
					closeTag: true
				}
			]
		 */
		return tags.map((tag) => {
			// 这里只处理js文件，其他的css的，需要过滤掉
			if (tag.tagName !== "script") {
				return tag
			};

			// 获取文件名称
			const scriptName = tag.attributes.src;

			// 判断是否符合设置的条件
			if (!this.tests.some((test) => scriptName.match(test))) {
				return tag
			};

			return { tagName: "script", innerHTML: assets[scriptName].source(), closeTag: true };
		});
	}
}

module.exports = InlineChunkWebpackPlugin;
