const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanCSSPlugin = require("less-plugin-clean-css");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const extractLess = new ExtractTextPlugin({
	filename: "app.css",
	disable: process.env.NODE_ENV === "development"
});

const copyFiles = new CopyWebpackPlugin([
	{from: 'src/manifest.json'},
	{from: 'src/gfx'},
	{from: 'src/html'},
]);

const manifest = fs.readFileSync('./src/manifest.json');
const version = JSON.parse(manifest).version;
const zipFiles = new ZipPlugin({
	path: '..',
	filename: version + '.zip'
});

module.exports = {
	entry: './src/js/app.js',

	output: {
		path: path.resolve(__dirname, 'dist/chrome-extension'),
		filename: "app.js"
	},

	module: {
		rules: [

			/* LESS */
			{
				test: /\.less$/,
				use: extractLess.extract({
					use: [{
						loader: "css-loader"
					}, {
						loader: "less-loader", options: {
							plugins: [new CleanCSSPlugin({ advanced: true })]
						}
					}],
				})
			},

			/* Javascript */
			{
	      test: /\.js$/,
	      exclude: /(node_modules)/,
	      use: {
	        loader: 'babel-loader',
	        options: {
	          presets: ['react', 'es2015']
	        }
	      }
	    },
		]
	},

	plugins: [
		extractLess,
		copyFiles,
		zipFiles
	]
}
