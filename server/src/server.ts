// Back-end API RESTful
import Fastify from "fastify"
import Cors from "@fastify/cors"
import {appRoutes} from "./routes"
import { notificationRoutes } from "./notifications-routes"
import {prisma} from './lib/prisma'
const app = Fastify()

app.register(Cors)
app.register(appRoutes)
app.register(notificationRoutes)



app
  .listen({
    port: 3333,
    host:'0.0.0.0',
     
  })
  .then(() => {
    console.log("HTTP Server running!")
  })
