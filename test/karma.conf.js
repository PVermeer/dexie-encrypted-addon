// @ts-check
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

function karmaConfig(config) {
    const mainConfig = require('../karma.conf').mainKarmaConfig(config)

    mainConfig.basePath = '../';
    mainConfig.frameworks = mainConfig.frameworks.filter(x => x !== 'detectBrowsers');
    delete mainConfig.detectBrowsers;
    mainConfig.customLaunchers = {
        ChromeDebugging: {
            base: 'Chrome',
            flags: ['--remote-debugging-port=9333']
        }
    };
    mainConfig.browsers = ['ChromeDebugging'];
    mainConfig.singleRun = false;

    return mainConfig;
}

module.exports = function (config) {
    config.set(karmaConfig(config));
};
