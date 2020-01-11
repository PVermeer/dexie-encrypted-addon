/*
 * Require all test files in uni-tests for webpack compilation.
 */
const testsContext = (require as any).context('./unit-tests', true, /\.spec\.tsx?$/);
testsContext.keys().forEach(testsContext);
