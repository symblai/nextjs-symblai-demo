import React from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'

export const JsonPayloadCard = ({
  title,
  children,
  json,
}: {
  title: string
  children: JSX.Element
  json?: Record<string, unknown> | null
}) => (
  <div className={css(tw`w-full md:w-1/2 xl:w-1/2 p-3`)}>
    <div
      className={css(tw`bg-gray-900 border border-gray-800 rounded shadow p-2`)}
    >
      <div className={css(tw`flex flex-row items-center`)}>
        <div className={css(tw`flex-1 text-right md:text-center`)}>
          <h5 className={css(tw`font-bold uppercase text-gray-400`)}>
            {title}
          </h5>
        </div>
      </div>
      <div className={css(tw`text-gray-400`)}>
        <div>
          <textarea
            className={css(tw`h-32 w-full bg-black p-4 mt-4`)}
            value={JSON.stringify(json, null, 2)}
          />
          {children}
        </div>
      </div>
    </div>
  </div>
)
