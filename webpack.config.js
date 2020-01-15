const path = require('path');
const nodeExternals = require('webpack-node-externals');

const umdConfig = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'dexieEncryptionAddon',
        umdNamedDefine: true
    },
    mode: 'production',
    target: 'node',
    externals: [nodeExternals({
        importType: 'amd'
    })],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                configFile: '../src/tsconfig.json'
            }
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    devtool: 'source-map'
};

const bundleConfig = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'dexie-encrypted-addon.min.js',
        libraryTarget: 'window',
        library: 'DexieEncryptionAddon',
        umdNamedDefine: true
    },
    mode: 'development',
    target: 'web',
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                configFile: '../src/tsconfig.json'
            }
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    devtool: 'none'
};

module.exports = [umdConfig, bundleConfig];
