// @ts-check
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

/*
 * Using webpack for much better debug experience with tests.
 */

function karmaConfig(config) {
    const angularWebpack = require('@ngtools/webpack');

    return {
        basePath: '../',
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
        customLaunchers: {
            ChromeDebugging: {
                base: 'Chrome',
                flags: ['--remote-debugging-port=9333']
            }
        },
        browsers: ['ChromeDebugging'],
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: false,
        restartOnFileChange: true
    }
}

module.exports = function (config) {
    config.set(karmaConfig(config));
};
