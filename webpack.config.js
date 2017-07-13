const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanCSSPlugin = require("less-plugin-clean-css");

const extractLess = new ExtractTextPlugin({
    filename: "app.css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
	entry: './src/js/app.js',
	output: {
		path: __dirname + "/dist",
		filename: "app.js"
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: extractLess.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "less-loader", options: {
                    plugins: [
                        new CleanCSSPlugin({ advanced: true })
                    ]
                }
            }],
            // use style-loader in development
            fallback: "style-loader"
        })
			}
		]
	},
	plugins: [
  	extractLess
  ]
}
