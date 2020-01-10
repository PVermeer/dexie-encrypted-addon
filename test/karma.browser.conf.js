// @ts-check
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

function karmaConfig(config) {
    const mainConfig = require('../karma.conf').mainKarmaConfig(config)

    mainConfig.basePath = '../';
    mainConfig.frameworks.push('detectBrowsers');
    ['karma-edge-launcher',
        'karma-firefox-launcher',
        'karma-ie-launcher',
        'karma-safari-launcher',
        'karma-safaritechpreview-launcher',
        'karma-opera-launcher',
        'karma-phantomjs-launcher',
        'karma-detect-browsers'
    ].forEach(plugin => mainConfig.plugins.push(plugin));
    delete mainConfig.browsers;
    mainConfig.detectBrowsers = {
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
    }
    mainConfig.singleRun = true;

    return mainConfig;
}

module.exports = function (config) {
    config.set(karmaConfig(config));
};
