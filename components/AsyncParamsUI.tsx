import React from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'

export const AsyncParamsUI = ({
  enableSpeakerDiarization,
  setEnableSpeakerDiarization,
  diarizationSpeakerCount,
  setDiarizationSpeakerCount,
  customVocabulary,
  setCustomVocabulary,
  detectActionPhraseForMessages,
  setDetectActionPhraseForMessages,
}: any) => {
  return (
    <div className={css(tw`p-2`)}>
      <input
        type="checkbox"
        id="enableSpeakerDiarization"
        name="enableSpeakerDiarization"
        checked={enableSpeakerDiarization}
        onClick={(e) => {
          setEnableSpeakerDiarization(!enableSpeakerDiarization)
        }}
      />
      <label
        className={css(tw`text-gray-400 p-2`)}
        htmlFor="enableSpeakerDiarization"
      >
        enableSpeakerDiarization
      </label>
      {enableSpeakerDiarization && (
        <div>
          <label
            className={css(tw`text-gray-400 p-2 `)}
            htmlFor="diarizationSpeakerCount"
          >
            DiarizationSpeakerCount
          </label>
          <input
            className={css(
              tw`inline-block bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal m-3 w-64`
            )}
            type="number"
            id="diarizationSpeakerCount"
            name="diarizationSpeakerCount"
            value={diarizationSpeakerCount}
            onChange={(e) => {
              setDiarizationSpeakerCount(+e.target.value)
            }}
          />
        </div>
      )}
      <div>
        <label className={css(tw`text-gray-400 p-2`)}>
          custom vocabulary array in json format
        </label>
        <input
          type="text"
          value={customVocabulary}
          className={css(
            tw`inline-block bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal m-3 w-64`
          )}
          name="customVocabulary"
          onChange={(e) => {
            setCustomVocabulary(e.target.value)
          }}
        />
      </div>
      <div>
        <input
          type="checkbox"
          id="detectActionPhraseForMessages"
          name="detectActionPhraseForMessages"
          checked={detectActionPhraseForMessages}
          onClick={(e) => {
            setDetectActionPhraseForMessages(!detectActionPhraseForMessages)
          }}
        />
        <label
          className={css(tw`text-gray-400 p-2`)}
          htmlFor="detectActionPhraseForMessages"
        >
          detectActionPhraseForMessages
        </label>
      </div>
    </div>
  )
}
