var fs = require('fs');
var path = require('path');

let buildNumber = process.argv[2];

if(!buildNumber) {
    buildNumber = '-1';
}

let versionFile = `export const version: { buildNumber: number } = {\r\n  buildNumber: ${buildNumber},\r\n};\r\n`;

const fileName = path.join(__dirname, '../src/version.ts');
fs.writeFileSync(fileName, versionFile);
console.log(versionFile);