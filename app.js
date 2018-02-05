const juicer = require('juicer');
const fp = require('fastify-plugin');
const readFile = require('fs').readFile;
const join = require('path').join;
const resolve = require('path').resolve;

function View (fastify, opts, next) {
    if (!juicer) {
      next(new Error('Missing engine'));
      return
    }
    const templatesDir = resolve(opts.templates || './');
    const includeViewExtension=opts.includeViewExtension||false;
  
    fastify.decorateReply('view',view);
 
    function view (page, data) {
      if (!page || !data) {
        this.send(new Error('Missing data'))
        return
      }
      if(includeViewExtension){
        page=page+"."+includeViewExtension
      }else{
        page=page+".html"
      }
      readFile(join(templatesDir,page), 'utf8', readCallback(this, page, data))
    }
  
    function readCallback (that, page, data) {
      return function _readCallback (err, html) {
        if (err) {
          that.send(err)
          return
        }
        html = juicer(html,data)
        that.header('Content-Type', 'text/html').send(html)
      }
    }
      next()
    }
  
  module.exports = fp(View, { fastify: '>=0.13.1' })