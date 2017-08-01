module.exports = function () {
    const arg = process.argv.slice(2);

    let k, v, params = {};

    for (let i = 0; i < arg.length; i++) {
        k = arg[i];
        v = (arg[i + 1] && arg[i + 1][0] !== '-' && arg[i + 1]) || '';

        if (k[0] === '-') {
            if (k[1] === '-') {
                params[k.substring(2)] = v;
            } else {
                params[k.substring(1)] = v;
            }
        }
    }



    if (params.v !== undefined || params.version !== undefined) {
        var package = require('../package');
        console.log(`Version: ${package.version}`);
        process.exit(0);
    }

    if (params.h !== undefined || params.help !== undefined) {
        let help = require('./help');
        console.log(help);
        process.exit(0);
    }


    // 
    return params;
};
