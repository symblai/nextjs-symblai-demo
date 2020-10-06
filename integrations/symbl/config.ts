export const apiBase = 'https://api.symbl.ai'
export const appId = process.env.APP_ID as string
export const appSecret = process.env.APP_SECRET as string
export const intents = [
  { intent: 'answering_machine' },
  { intent: 'interested' },
  { intent: 'not_interested' },
  { intent: 'do_not_call' },
]
