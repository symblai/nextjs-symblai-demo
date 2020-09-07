import React from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'

export const Container = ({ children }: any) => (
  <div className={css(tw`container w-full mx-auto pt-20`)}>
    <div
      className={css(
        tw`w-full px-4 md:px-0 md:mt-8 mb-16 text-gray-800 leading-normal`
      )}
    >
      {children}
    </div>
  </div>
)
