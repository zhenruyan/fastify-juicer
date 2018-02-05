#  fastify-juicer

##  Benchmarks

```
ab -n 10000 -c 100 http://127.0.0.1:3000/
```

point-of-view: 15.6k req/sec

fastify-juicer: 18.8k req/sec

##  Install


```
npm install fastify-juicer --save

```

##  Usage

```
const fastify = require('fastify')()

fastify.register(require('fastify-juicer'))

fastify.get('/', (req, reply) => {
  reply.view('/templates/index.ejs', { text: 'text' })
})

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

If you want to set a fixed templates folder, or pass some options to the template engines:

```
fastify.register(require('point-of-view'), {
  templates: 'templates',
  includeViewExtension:"html"
})

```