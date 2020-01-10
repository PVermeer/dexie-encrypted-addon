// @ts-check
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const angularWebpack = require('@ngtools/webpack');

// @ts-ignore
process.on('infrastructure_error', (error) => {
    console.error('infrastructure_error', error);
});

function karmaConfig(config) {
    return {
        basePath: '',
        files: ['./test/**/*.spec.ts'],
        frameworks: ['jasmine'],
        plugins: [
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-webpack',
            'karma-chrome-launcher'
        ],
        preprocessors: {
            "**/*.ts": ['webpack'],
        },
        webpack: {
            mode: 'development',
            performance: { hints: false },
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: '@ngtools/webpack',
                        exclude: /node_modules/,
                    }
                ]
            },
            resolve: {
                extensions: ['.tsx', '.ts', '.js', '.json']
            },
            plugins: [
                new angularWebpack.AngularCompilerPlugin({
                    tsConfigPath: './test/tsconfig.test.json'
                })
            ],
            devtool: 'inline-source-map'
        },
        webpackMiddleware: {
            stats: 'errors-only'
        },
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        browsers: ['ChromeHeadless'],
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: true,
        restartOnFileChange: true
    };
}

module.exports = function (config) {
    config.set(karmaConfig(config));
};
module.exports.mainKarmaConfig = karmaConfig;
