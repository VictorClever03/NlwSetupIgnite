
import webPush from 'web-push'
import { FastifyInstance } from "fastify"


// console.log(webPush.generateVAPIDKeys())

const publicKey = 'BPZUIbXsFbYWzWRFWiPgYA-pcYTS8GjWegIVaOUJsFjdxjucULzNpFRfOqrLzcg-dvHbX-KEwQRqgcxFW86xzrw';
const privateKey = 'qMDkh82PbTxdZiYFIaomJN7zM4Og4a9JR2b7rqqC0mI';

// webPush.setVapidDetails(
// 'http://localhost:3333',
// publicKey,
// privateKey
// )

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public-key', () => {
    return (
      publicKey
    )
  })

  app.post('/push/register', (request, reply) => {
    console.log(request.body);
    return reply.status(201).send()

  })

  app.post('/push/send', async (request, reply) => {
    console.log(request.body)
    return reply.status(201).send()
  })
}

