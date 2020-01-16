// @ts-check

/** @type import('type-fest').PackageJson */
// @ts-ignore
const packageJson = require('./package.json');

const umdName = (packageName) => {
    const onlyName = packageJson.name.includes('@') ?
        packageJson.name.split('/')[1] :
        packageJson.name;

    const pascalCaseName = onlyName.split('-')
        .map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
    return pascalCaseName;
}

const configLib = {
    packageName: packageJson.name,
    umdName: umdName(packageJson.name)
};

module.exports = configLib;
