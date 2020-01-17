// @ts-check

/** @type import('type-fest').PackageJson */
// @ts-ignore
const packageJson = require('./package.json');

const umdName = (packageName) => {
    const onlyName = packageJson.name.includes('@') ?
        packageName.split('/')[1] :
        packageName;

    const pascalCaseName = onlyName.split('-')
        .map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
    return pascalCaseName;
}
function mapPeerDependencies() {
    return Object.keys(packageJson.peerDependencies).reduce((obj, key) => {
        let value;
        switch (key) {
            case 'dexie': { value = 'Dexie'; break; }
            default: { value = key; }
        }
        return { ...obj, [key]: value };
    }, {});
}

const configLib = {

    packageName: packageJson.name,

    umdName: umdName(packageJson.name),

    peerDependencies: Object.keys(packageJson.peerDependencies),

    peerDependenciesMapped: mapPeerDependencies()

};

console.log(configLib, '\n');

module.exports = configLib;
