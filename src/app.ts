import bodyParser from '@koa/bodyparser'
import Router from '@koa/router'
import Koa from 'koa'
import helmet from 'koa-helmet'
import { solidAuth } from './middlewares/solidAuth'

const app = new Koa()
const router = new Router()

router
  .get('/', (ctx, next) => {
    ctx.response.body =
      'Hello world! This is a Solid email notifier. Read more at https://github.com/openHospitalityNetwork/solid-email-notifications'
  })
  .post('/inbox', solidAuth, async (ctx, next) => {
    console.log(ctx.state.user, ctx.state.client)
    // we should receive info about webId and email address

    // perhaps webId should be the one of authenticated user

    // search for webId's inbox

    // try to subscribe to the inbox

    // send verification email to provided email address
    ctx.response.body = 'not implemented'
  })
  .get('/verify-email', async (ctx, next) => {
    ctx.response.body = 'not implemented'
  })
  .post('/webhook-receiver', async ctx => {
    console.log(ctx.headers)
    console.log(ctx.request.rawBody)
    ctx.response.status = 202
    ctx.response.body = 'Accepted'
  })

app
  .use(helmet())
  .use(
    bodyParser({
      enableTypes: ['text', 'json'],
      extendTypes: { json: ['application/ld+json'], text: ['text/turtle'] },
    }),
  )
  .use(router.routes())
  .use(router.allowedMethods())

export default app
