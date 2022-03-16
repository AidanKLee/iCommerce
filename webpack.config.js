const path = require('path');
module.exports = {
    mode: `development`,
    entry: `./frontend/src/index.js`,
    output: {
        path: path.join(__dirname, `frontend/public`),
        filename: `bundle.js`
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            @babel
                        ],
                        "comments": false
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ]
    }
}