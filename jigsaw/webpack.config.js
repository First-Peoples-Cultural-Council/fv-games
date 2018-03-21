const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteWebpackPlugin = require('write-file-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

const publicPath = path.resolve(__dirname, 'www');
const assetsPath = path.resolve(__dirname,'assets');

module.exports = {
    entry:{
        app:"./entry.js",
        vendor:['pixi', 'p2', 'phaser']
    },
    output:{
        path: publicPath,
        filename:"scripts/[name].[hash].js"
    },
    plugins: [
        new CleanWebpackPlugin([publicPath]),
        new CopyWebpackPlugin([{
            from: assetsPath,
            to: publicPath
        }]),
        new WriteWebpackPlugin()
    ],
    module:{
        rules:[
            {
                test: /\.js$/, exclude: /node_modules/, use: ['babel-loader']
            },
            {
                test:/\.css$/,
                use:['style-loader', 'css-loader']
            },
            {
                test:/pixi\.js/,
                use:{
                    loader:'expose-loader',
                    query:'PIXI'
                }
            },
            {
                test:/phaser-split\.js$/,
                use:{
                    loader:'expose-loader',
                    query:'Phaser'
                }
            },
            {
                test:/p2\.js/,
                use:{
                    loader:'expose-loader',
                    query:'p2'
                }
            }
        ]
    },
    resolve:{
        alias:{
            phaser:phaser,
            pixi:pixi,
            p2:p2
        }
    }
}