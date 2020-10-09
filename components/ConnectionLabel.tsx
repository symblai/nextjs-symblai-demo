import React from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'

import { useConnection } from '../hooks'

export const ConnectionLabel = () => {
  const { connectionId } = useConnection()
  return connectionId ? (
    <label
      className={css(tw`text-indigo-300`)}
    >{`connectionId ${connectionId}`}</label>
  ) : null
}
