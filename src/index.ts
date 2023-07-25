import {
  buildAuthenticatedFetch,
  createDpopHeader,
  generateDpopKeyPair,
} from '@inrupt/solid-client-authn-core'
import { config } from 'dotenv'
import http from 'http'

const server = http.createServer((req, res) => {
  let requestBody = ''

  req.on('data', chunk => {
    requestBody += chunk
  })

  req.on('end', () => {
    console.log('Received request body:', requestBody)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello, world!')
  })
})

server.listen(4000, () => {
  console.log('Server started and listening on port 4000')
})

config()
;(async () => {
  const response = await fetch('http://localhost:3000/idp/credentials/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    // The email/password fields are those of your account.
    // The name field will be used when generating the ID of your token.
    body: JSON.stringify({
      email: 'bot@example',
      password: 'password',
      name: 'bot-token',
    }),
  })

  const { id, secret } = await response.json()

  const dpopKey = await generateDpopKeyPair()

  // These are the ID and secret generated in the previous step.
  // Both the ID and the secret need to be form-encoded.
  const authString = `${encodeURIComponent(id)}:${encodeURIComponent(secret)}`
  // This URL can be found by looking at the "token_endpoint" field at
  // http://localhost:3000/.well-known/openid-configuration
  // if your server is hosted at http://localhost:3000/.
  const tokenUrl = 'http://localhost:3000/.oidc/token'
  const response2 = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      // The header needs to be in base64 encoding.
      authorization: `Basic ${Buffer.from(authString).toString('base64')}`,
      'content-type': 'application/x-www-form-urlencoded',
      dpop: await createDpopHeader(tokenUrl, 'POST', dpopKey),
    },
    body: 'grant_type=client_credentials&scope=webid',
  })

  // This is the Access token that will be used to do an authenticated request to the server.
  // The JSON also contains an "expires_in" field in seconds,
  // which you can use to know when you need request a new Access token.
  const { access_token: accessToken } = await response2.json()

  // The DPoP key needs to be the same key as the one used in the previous step.
  // The Access token is the one generated in the previous step.
  const authFetch = await buildAuthenticatedFetch(fetch, accessToken, {
    dpopKey,
  })
  // authFetch can now be used as a standard fetch function that will authenticate as your WebID.
  // This request will do a simple GET for example.
  const response3 = await authFetch(
    'http://localhost:3000/.notifications/WebhookChannel2023/',
    {
      method: 'POST',
      body: JSON.stringify({
        '@context': ['https://www.w3.org/ns/solid/notification/v1'],
        type: 'http://www.w3.org/ns/solid/notifications#WebhookChannel2023',
        topic: 'http://localhost:3000/person/profile/card',
        sendTo: 'http://localhost:4000',
      }),
      headers: { 'content-type': 'application/ld+json' },
    },
  )

  console.log(response.status, await response3.text())
})()
