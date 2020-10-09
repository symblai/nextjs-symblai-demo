import React from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import { Button } from './Button'
import { useAuth } from '../hooks'

export const ProtectedPage: React.FC = ({ children }) => {
  const { token, setToken } = useAuth()

  async function loginToSymbl() {
    const response = await fetch('https://api.symbl.ai/oauth2/token:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        type: 'application',
        appId: process.env.APP_ID,
        appSecret: process.env.APP_SECRET,
      }),
    })
    const json = await response.json()
    console.log('Access Token is: ', json)
    setToken(json.accessToken)
  }

  if (!token) {
    return (
      <div className={css(tw`h-screen mt-6`)}>
        <div className={css(tw`text-gray-100`)}>
          Credentials are within next-config.js file. Log in to generate access
          token
        </div>
        <Button onClick={() => loginToSymbl()}>Log In</Button>
      </div>
    )
  }
  return <>{children}</>
}
