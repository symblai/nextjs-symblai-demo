import React from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import Typist from 'react-typist'

export const TypingIntro: React.FC = ({ children }) => (
  <div className={css(tw`hidden md:inline-block text-gray-100 my-5`)}>
    <Typist>{children}</Typist>
  </div>
)
