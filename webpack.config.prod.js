const path =require('path');
const webpack =require('webpack');
const autoPrefixer=require('autoprefixer');
const HtmlWebpackPlugin=require('html-webpack-plugin');

const b=require('babel-loader'); 
module.exports={
    mode:'development',
    entry:`${__dirname}/src/index.js`,
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js',
        publicPath:''
    },
    devtool:'none',
    module:{
        rules:[
            {
                test: /\.js$/,
                loader:'babel-loader',
                exclude:[path.resolve(__dirname,'node_modules'),path.resolve(__dirname,'assets'),path.resolve(__dirname,'controllers'),path.resolve(__dirname,'graphQl'),path.resolve(__dirname,'models'),path.resolve(__dirname,'routes'),path.resolve(__dirname,'uploads'),path.resolve(__dirname,'views'),path.resolve(__dirname,'index.js'),path.resolve(__dirname,'.vscode')],
               

            },
            {
                test: /\.css$/,
                
                exclude:[path.resolve(__dirname,'node_modules'),path.resolve(__dirname,'assets'),path.resolve(__dirname,'controllers'),path.resolve(__dirname,'graphQl'),path.resolve(__dirname,'models'),path.resolve(__dirname,'routes'),path.resolve(__dirname,'uploads'),path.resolve(__dirname,'views'),path.resolve(__dirname,'index.js'),path.resolve(__dirname,'.vscode')],
                use:[
                    {loader:'style-loader'
                    },
                    {
                        loader:'css-loader',
                        options:{
                            importLoader: 1,
                            modules:{
                                localIdentName:'[name]__[local]__[hash:base64:5]'
                            }
                        }
                    },
                    {
                        loader:'pastcss-loader',
                        options:{
                            ident:'postcss',
                            plugins:()=>[autoPrefixer()]
                        }
                    }
                ]

            },
            {
                test: /\.(png|jp?g|gif)$/,
                
                exclude:[path.resolve(__dirname,'node_modules'),path.resolve(__dirname,'assets'),path.resolve(__dirname,'controllers'),path.resolve(__dirname,'graphQl'),path.resolve(__dirname,'models'),path.resolve(__dirname,'routes'),path.resolve(__dirname,'uploads'),path.resolve(__dirname,'views'),path.resolve(__dirname,'index.js'),path.resolve(__dirname,'.vscode')],
                loader:'url-loader?limit=8000&name=images/[name].[ext]'
            }

        ]
    },
    
        plugins:[
            
            new HtmlWebpackPlugin({
                template:__dirname + '/dist/index.html',
                
                inject:'body'
            })
        ]
    
};