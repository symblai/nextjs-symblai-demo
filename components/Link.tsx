import React from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'

export const Link: React.FC<{ href: string }> = ({ href, children }) => (
  <div className={css(tw`text-gray-400`)}>
    {children}
    <span> </span>
    <a className={css(tw`text-blue-400`)} href={href}>
      here
    </a>
  </div>
)
