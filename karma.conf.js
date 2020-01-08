// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.on('infrastructure_error', (error) => {
  console.error('infrastructure_error', error);
});

module.exports = function (config) {
  config.set({
    basePath: '',
    files: ['./tests/**/*.ts', './src/**/*.ts'],
    frameworks: ['jasmine', 'karma-typescript'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-typescript')
    ],
    preprocessors: {
      "**/*.ts": "karma-typescript"
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      compilerOptions: {
        module: "commonjs",
        sourceMap: true,
        // Debug convenience, f^%&% karma-typescript crashes on compilation errors...
        strict: false,
        strictPropertyInitialization: false,
        noUnusedLocals: false,
        noUnusedParameters: false
        // ==========
      },
      include: ['src', 'tests'],
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
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [
      'ChromeDebugging'
    ],
    singleRun: false,
    restartOnFileChange: true
  });
};
