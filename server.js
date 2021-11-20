// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

if (fastify.websocketServer === undefined) {
    fastify.register(require('fastify-websocket'), {
        options: {
            maxPayload: 1048576,
        }
    })
}
fastify.register(require('fastify-cors'), {
    origin: ['http://localhost:3000/']
})
// Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})
fastify.get('/damir', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    console.log('start');
    connection.socket.on('message', message => {
        console.log('message.toString() ', message.toString())

        // setInterval(() => {
        connection.socket.send('hi from server')
        // }, 500)
    })

})

// Run the server!
const start = async () => {
    try {
        await fastify.listen(8080)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()