# GitHub Actions notifications for Slack

This is a simple Action to send a notification about the workflow status.

![Sample message](/docs/sample-message.png)

This action is intended to be simple and is considered feature-complete. Bug
fixes are welcome but no new features would be accepted. You can extend this
Actions for your needs by using `custom_fields` (see below).

## Usage

```yaml
jobs:
  send-message:
    steps:
    # ...
    - name: Send message
      uses: eugene-babichenko/slack-notifier@v1
      with:
        webhook: ${{ secrets.SLACK_WEBHOOK }}
        text: "Hello, world!"
```

### Inputs

- `webhook` (**required**). URL of Slack [incoming webhook][webhooks].

- `status` (**optional**). The status to be used for the notification. A status
  of a step can be used. Must be on of:
  - `success`
  - `failure`
  - `cancelled`
  The statuses are usually produced by jobs (you can add
  `status: ${{ jobs.status }}` to outputs of your job)


- `text` (**optional**). The text of the notification. You can use Slack
  message markup.

  By default this is set based on the provided `status`.

- `color` (**optional**). The color this message will be highlighted with. You
  can use Slack message markup.

  By default this is set based on the provided `status`.

- `username` (**optional**). Change the displayed name of the app for this
  message.

  This requires your app to have [`chat:write.customize`][write-customize]
  scope enabled. Otherwise this field will not have any effect. See
  [Slack API docs][impersonation] for more details.

- `icon_url` (**optional**). Display an emoji as the app icon.

  This requires your app to have [`chat:write.customize`][write-customize]
  scope enabled. Otherwise this field will not have any effect. See
  [Slack API docs][impersonation] for more details.

- `custom_fields` (**Optional**). A JSON array of additional fields to be
  displayed along with the default ones.

  See [Field objects][field-objects] documentation for the details.

[webhooks]: https://api.slack.com/messaging/webhooks
[write-customize]: https://api.slack.com/scopes/chat:write.customize
[impersonation]: https://api.slack.com/messaging/sending#impersonation
[field-objects]: https://api.slack.com/reference/messaging/attachments#field_objects
