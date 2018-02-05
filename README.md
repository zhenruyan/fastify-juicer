#  fastify-juicer


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