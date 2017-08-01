var gr = require('cli-color').green;

module.exports = [
    ['-h', '--help', 'Helps'],
    ['-v', '--version', 'Version'],
    ['-l', '--list', 'List for donloading'],
    ['-c', '--cookie', 'Path to cookie (String)'],
].map(v => {
    let desc = v.pop();
    return v.map(item => gr(item)).join(' ') + '\t' + desc;
}).join("\n");

