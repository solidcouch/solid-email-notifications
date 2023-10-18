# Solid email notifications

This service sends you an email when a new notification arrives to your Solid Pod inbox

## How it works

- It's a bot agent with its own identity, which must be provided by arbitrary CommunitySolidServer pod
- It runs on a server
- At the beginning of the integration, the bot's webId must be given Read access to your inbox (frontend app can take care of this by editing inbox's .acl (access control list))
- You have to prove that the inbox belongs to you (how to prove that? not implemented, yet)
- You have to tell the service where to send you emails
  - in the future, the email address might be stored in your pod; for now we keep it in internal database
- You receive email with verification link and follow the link
- The service then subscribes to Solid [webhook](https://solid.github.io/notifications/webhook-channel-2023) [notifications](https://solidproject.org/TR/notifications-protocol) of your inbox
- When a notification arrives to your inbox, this agent gets notified by the webhook and sends you email via a configured email service. In the future it will also check whether it's a notification about something specific (in the context of sleepy.bike e.g. message or contact request), it'll compose the message and send it to you
- It will regularly re-subscribe to your inbox because some Solid pods drop the subscription regularly (not implemented, yet)
- If your pod doesn't support webhook notifications, maybe this bot will check your inbox regularly (a few times per day) and send you a notification when it finds something new there (not implemented, yet)

## Usage

### Configure

To authenticate itself, the mailer needs to have its own identity, it can be identity hosted on some Community Solid Server

Copy `.env.sample` to `.env` and edit the latter according to your needs

Alternatively, you may provide the configuration as environment variables

You can find full list of config options in [.env.sample](./.env.sample)

### Run

```sh
yarn start
```

### Use

## Tests

Run `yarn test`

Tests are placed in [src/test/](./src/test/)

## License

MIT
