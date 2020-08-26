const matter = require('gray-matter');
const chalk = require('chalk');
// Theme API.
module.exports = (options, ctx) => {
    console.log("options", options);
    console.log("ctx", ctx);
    return {
        ...ctx
    }
}