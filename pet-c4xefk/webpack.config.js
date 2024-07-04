const path = require('path');

module.exports = {
    entry: './src/main.ts',
    stats: { warnings: false },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    externals: {
        indesign: 'commonjs2 photoshop', 
        uxp: 'commonjs2 uxp',
        os: 'commonjs2 os',
        fs: 'commonjs2 fs',
        path: 'commonjs2 path',
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
