// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

function karmaConfig(config) {
    const mainConfig = require('../karma.conf').mainKarmaConfig(config)

    mainConfig.basePath = '../';
    mainConfig.plugins.push('karma-coverage-istanbul-reporter');
    mainConfig.webpack.module.rules.push({
        test: /\.tsx?$/,
        exclude: /(node_modules|test)/,
        enforce: 'post',
        use: {
            loader: 'istanbul-instrumenter-loader',
            options: { esModules: true }
        },
    });
    mainConfig.coverageIstanbulReporter = {
        dir: './coverage',
        reports: ['html', 'lcovonly', 'text-summary'],
        fixWebpackSourcePaths: true,
        thresholds: {
            statements: 100,
            lines: 100,
            branches: 100,
            functions: 100
        }
    };
    mainConfig.reporters.push('coverage-istanbul');

    return mainConfig;
}

module.exports = function (config) {
    config.set(karmaConfig(config));
};
