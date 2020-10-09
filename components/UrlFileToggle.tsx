import React from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'

type UrlFileToggle = {
  type: string
  setType: (type: string) => void
}

export const UrlFileToggle: React.FC<UrlFileToggle> = ({ type, setType }) => {
  return (
    <label
      htmlFor="toogleA"
      className={css(tw`p-4 flex items-center cursor-pointer`)}
    >
      <div className={css(tw`relative`)}>
        <input
          id="toogleA"
          type="checkbox"
          className={css(tw`hidden`)}
          onChange={() => (type === 'url' ? setType('file') : setType('url'))}
        />
        <div
          className={css(tw`w-10 h-4 bg-gray-400 rounded-full shadow-inner`)}
        ></div>
        <div
          className={css(
            tw`absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0`,
            `top: -.25rem;
            left: -.25rem;
            transition: all 0.3s ease-in-out;`,
            type === 'file'
              ? ``
              : `  transform: translateX(100%);
            background-color: #48bb78;`
          )}
        ></div>
      </div>
      <div className={css(tw`ml-3 text-blue-400 font-medium`)}>Url</div>
    </label>
  )
}
