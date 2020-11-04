import { useState } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import PhoneNumber from 'awesome-phonenumber'
import { Button, ParamsToggle } from '../components'
import { useConnection, useConversation, useAuth } from '../hooks'

export const PhoneConfigurations = ({
  insightTypes,
  clientOnly,
  connectionResponseHandler,
}: {
  insightTypes: string[]
  clientOnly?: boolean
  connectionResponseHandler?: (data: any) => void
}) => {
  const { token } = useAuth()
  const [phone, setPhone] = useState('')
  const [connectionId, setConnectionId] = useConnection()
  const { setConversationData } = useConversation()
  const [phoneError, setPhoneError] = useState('')
  const [dtmf, setDtmf] = useState('')
  const [type, setType] = useState('pstn')
  const [summaryEmails, setSummaryEmails] = useState('')
  const [calling, setCalling] = useState(false)
  async function startCall() {
    if (!phone) {
      setPhoneError('Cannot be empty')
    }
    const pn = new PhoneNumber(phone)

    let _phoneNumber = phone
    if (pn.isValid()) {
      _phoneNumber = pn.getNumber('e164')
    } else {
      setPhoneError('Invalid Number')
      return
    }

    setPhoneError('')
    console.log(`call: ${phone}`)
    setCalling(true)
    if (!clientOnly) {
      const res = await fetch('/api/call', {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber: _phoneNumber,
          dtmf: dtmf,
          type,
          insightTypes,
          summaryEmails,
          start: true,
        }),
      })

      const json = await res.json()
      setConnectionId(json.connectionId)
    } else {
      const phoneNumberOrUri =
        type === 'sip' ? { uri: _phoneNumber } : { phoneNumber: _phoneNumber }
      const res = await fetch('https://api.symbl.ai/v1/endpoint:connect', {
        method: 'POST',
        headers: {
          'x-api-key': token as string,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          operation: 'start',
          endpoint: {
            type,
            ...phoneNumberOrUri,
            dtmf,
          },
          insightTypes,
          actions: [
            {
              invokeOn: 'stop',
              name: 'sendSummaryEmail',
              parameters: {
                emails: summaryEmails.split(','),
              },
            },
          ],
          data: {
            session: {
              name: 'Call from nextjs Phone(Client only)',
            },
          },
        }),
      })

      const json = await res.json()
      connectionResponseHandler && connectionResponseHandler(json)
    }
    setCalling(false)
  }

  async function endCall() {
    console.log('Stoping the call')
    if (!clientOnly) {
      const response = await fetch('/api/call', {
        method: 'POST',
        body: JSON.stringify({
          connectionId,
          start: false,
        }),
      })
      const json = await response.json()
      setConversationData(json)
    }
    setConnectionId(null)
  }

  return (
    <div>
      <div>
        <label className={css(tw`m-3 text-gray-400`)}>Phone number</label>
        <div className={css(tw`flex ml-4`)}>
          <span className={css(tw`flex text-gray-400 items-center`)}>
            Type:
          </span>
          <select
            className={css(
              tw`flex flex-wrap bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2  appearance-none leading-normal m-3 w-14`
            )}
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="pstn">
              PSTN (Public Switched Telephone Networks)
            </option>
            <option value="sip">SIP (Session Initiation Protocol)</option>
          </select>
          <input
            disabled={!!connectionId || calling}
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            value={phone}
            placeholder={
              type === 'pstn' ? 'Enter US phone number' : 'Enter SIP uri'
            }
            className={css(
              tw`flex flex-wrap bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2  appearance-none leading-normal m-3 w-64`
            )}
          />
          <Button
            disabled={calling}
            onClick={() => {
              connectionId ? endCall() : startCall()
            }}
          >
            {connectionId ? 'End Call' : 'Call'}
          </Button>
        </div>
        <ParamsToggle>
          <>
            <label className={css(tw`m-3 text-gray-400`)}>Params</label>

            <input
              disabled={!!connectionId || calling}
              onChange={(e) => setDtmf(e.target.value)}
              type="text"
              value={dtmf}
              placeholder="DTMF (Joining code)"
              className={css(
                tw`flex flex-wrap bg-gray-900 text-sm text-gray-400 placeholder-gray-600 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 appearance-none leading-normal m-3 w-40`
              )}
            />
            <input
              disabled={!!connectionId || calling}
              onChange={(e) => setSummaryEmails(e.target.value)}
              type="text"
              value={summaryEmails}
              placeholder="Summary Emails list (comma separated)"
              className={css(
                tw`flex flex-wrap bg-gray-900 text-sm text-gray-400  placeholder-gray-600 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 appearance-none leading-normal m-3 w-80`
              )}
            />
          </>
        </ParamsToggle>
        {phoneError !== '' ? (
          <label className={css(tw`text-red-300`)}>{phoneError}</label>
        ) : null}
      </div>
    </div>
  )
}
