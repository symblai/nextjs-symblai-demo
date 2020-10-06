import { useState } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import Button from '../components/Button'

export const AudioComponent = ({
  insightTypes,
}: {
  insightTypes: string[]
}) => {
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')

  return (
    <div>
      <div>
        <label className={css(tw`m-3 text-gray-400`)}>Phone number</label>
        <div className={css(tw`flex`)}>
          <input
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            value={phone}
            placeholder="Enter US phone number"
            className={css(
              tw`flex flex-wrap bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal m-3 w-64`
            )}
          />
          <Button
            onClick={() => {
              startCall()
            }}
          >
            Call
          </Button>
        </div>
        {phoneError !== '' ? (
          <label className={css(tw`text-red-300`)}>{phoneError}</label>
        ) : null}
      </div>
    </div>
  )
}
