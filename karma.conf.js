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
        files: ['./test/**/*.ts'],
        frameworks: ['jasmine', 'detectBrowsers'],
        plugins: [
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-coverage-istanbul-reporter',
            'karma-webpack',
            'karma-chrome-launcher',
            'karma-edge-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-safari-launcher',
            'karma-safaritechpreview-launcher',
            'karma-opera-launcher',
            'karma-phantomjs-launcher',
            'karma-detect-browsers'
        ],
        preprocessors: {
            "**/*.ts": ['webpack']
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
                    },
                    {
                        test: /\.tsx?$/,
                        exclude: /(node_modules|test)/,
                        loader: 'istanbul-instrumenter-loader',
                        enforce: 'post',
                        options: {
                            esModules: true
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['.tsx', '.ts', '.js'],
            },
            plugins: [
                new angularWebpack.AngularCompilerPlugin({
                    tsConfigPath: './test/tsconfig.json'
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
        detectBrowsers: {
            preferHeadless: true,
            postDetection: function (availableBrowsers) {
                console.log('Available browser: ' + availableBrowsers);
                const browsersToUse = availableBrowsers
                    .filter(x => !(
                        x.startsWith('PhantomJS') ||
                        x.startsWith('IE')
                    ));
                return browsersToUse;
            }
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, './coverage'),
            reports: ['html', 'lcovonly', 'text-summary'],
            fixWebpackSourcePaths: true
        },
        reporters: ['progress', 'kjhtml', 'coverage-istanbul'],
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
