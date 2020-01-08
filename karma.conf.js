// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const angularWebpack = require('@ngtools/webpack');

process.on('infrastructure_error', (error) => {
  console.error('infrastructure_error', error);
});

module.exports = function (config) {
  config.set({
    basePath: '',
    files: ['./tests/**/*.ts'],
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-webpack')
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
        ]
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
      plugins: [
        new angularWebpack.AngularCompilerPlugin({
          tsConfigPath: 'tests/tsconfig.json'
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
