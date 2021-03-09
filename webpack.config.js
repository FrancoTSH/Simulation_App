module.exports = {
    mode: "production",
    devtool: 'source-map',
    entry: './src/scripts/app.ts',
    module: {
        rules:[
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    output:{
        filename: 'app.js',
        path: __dirname + '/dist/js'
    }
}