import addFormats from 'ajv-formats'
import Ajv2020 from 'ajv/dist/2020'
import type { Middleware } from 'koa'

const ajv = new Ajv2020({ allErrors: true })
addFormats(ajv)

export const validateBody =
  (schema: Parameters<typeof ajv.compile>[0]): Middleware =>
  async (ctx, next) => {
    const validate = ajv.compile(schema)
    const isValid = validate(ctx.request.body)

    if (isValid) return await next()
    else {
      ctx.response.status = 400
      ctx.response.type = 'json'
      ctx.response.body = validate.errors
    }
  }
