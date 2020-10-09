import React, { useState, useRef, MutableRefObject } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import { Button, UrlFileToggle } from './'

export type FileOrUrlInputSubmitType = {
  file?: File
  url?: string
  type: 'url' | 'file'
}

export const FileOrUrlInput = ({
  onSubmit,
}: {
  onSubmit: (data: FileOrUrlInputSubmitType) => void
}) => {
  const inputRef = useRef()
  const [type, setType] = useState('file')
  const [url, setUrl] = useState('')
  return (
    <div>
      <UrlFileToggle type={type} setType={setType} />
      <div className={css(tw`flex`)}>
        {type === 'url' ? (
          <input
            className={css(
              tw`flex flex-wrap bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal m-3 w-64`
            )}
            type="text"
            id="input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        ) : (
          <input
            className={css(
              tw`flex flex-wrap bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal m-3 w-64`
            )}
            type="file"
            id="input"
            accept="audio/*, video/*"
            ref={inputRef as MutableRefObject<any>}
          />
        )}
        <Button
          onClick={() => {
            onSubmit({
              type: type as 'file' | 'url',
              url,
              file: (inputRef as any)?.current?.files[0],
            })
          }}
        >
          {`Submit ${type === 'file' ? 'File' : 'Url'} for processing`}
        </Button>
      </div>
    </div>
  )
}
