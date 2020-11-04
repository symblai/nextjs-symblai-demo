import React, { useState } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'

export const ParamsToggle = ({ children }: any) => {
  const [isShown, setIsShown] = useState(false)
  return (
    <div className={css(tw`text-gray-300 my-8 mx-4`)}>
      <div
        className={css(
          tw`text-gray-300 hover:font-bold cursor-pointer border-b-2 border-indigo-900 p-2`
        )}
        onClick={() => setIsShown(!isShown)}
      >
        Advanced Params
      </div>
      <div className={css(tw`bg-gray-900 p-5`)}>{isShown && children}</div>
    </div>
  )
}
