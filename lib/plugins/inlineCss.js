var uncss = require('uncss');
var CleanCSS = require('clean-css');


module.exports = {
    beforeSend: function(req, res, next) {
        if(!req.prerender.documentHTML) {
            return next();
        }
        var matches = req.prerender.documentHTML.toString().match(/<link(?:.*?)rel="stylesheet"(?:.*?)>/gi);
        var styleSheets = [];
        for (var i = 0; matches && i < matches.length; i++) {
            var style= matches[i].replace(/<link(?:.*?)href=/gi,'').replace('>','');
            style=style.replace(/"/g,'');
            style=style.replace('//','http://');
            styleSheets.push(style);
        }
        uncss(req.prerender.documentHTML.toString(),{stylesheets:styleSheets},function(err,output){
            var minified = '<style>'+new CleanCSS().minify(output).styles+'</style>';
            req.prerender.documentHTML=req.prerender.documentHTML.toString().replace('</title>','</title>'+minified);
            next();
        });

    }
};