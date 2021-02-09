# Symbl.ai Next.js Demo

[![telephony](https://img.shields.io/badge/symbl-telephony-blue)](https://docs.symbl.ai/docs/telephony/overview/post-api)
[![async-text](https://img.shields.io/badge/symbl-async--text-9cf)](https://docs.symbl.ai/docs/async-api/overview/text/post-text)
[![async-video](https://img.shields.io/badge/symbl-async--video-%231F618D)](https://docs.symbl.ai/docs/async-api/overview/video/post-video)
[![async-audio](https://img.shields.io/badge/symbl-async--audio-%2358D68D)](https://docs.symbl.ai/docs/async-api/overview/audio/post-audio)
[![symbl-react-elements](https://img.shields.io/badge/symbl-react--elements-yellow)](https://docs.symbl.ai/docs/symbl-elements)
[![sdk](https://img.shields.io/badge/symbl-sdk-blueviolet)](https://docs.symbl.ai/docs/javascript-sdk/overview/introduction)


Symbl's APIs empower developers to enable: 
- **Real-time** analysis of free-flowing discussions to automatically surface highly relevant summary discussion topics, contextual insights, suggestive action items, follow-ups, decisions, and questions.
- **Voice APIs** that makes it easy to add AI-powered conversational intelligence to either [telephony][telephony] or [WebSocket][websocket] interfaces.
- **Conversation APIs** that provide a REST interface for managing and processing your conversation data.
- **Summary UI** with a fully customizable and editable reference experience that indexes a searchable transcript and shows generated actionable insights, topics, timecodes, and speaker information.

<hr />

## This is a Demo app showcasing Symbl.ai capabilities using [ReactJS](https://reactjs.org/), [Typescript](https://www.typescriptlang.org/), and [NextJS](https://nextjs.org/)

<hr />

 * [Setup](#setup)
 * [Integration](#integration) 
 * [Conclusion](#conclusion)
 * [Community](#community)
 
## Setup 
The first step to getting setup is to [sign up][signup] with Symbl.ai. 

### Authorization

1. Create a .env file in the root directory using the [.env.sample](./.env.sample) as an example.
2. Update the .env file with the following:
    * Your App Id that you can get from [Platform](https://platform.symbl.ai)
    * Your App Secret that you can get from [Platform](https://platform.symbl.ai)

### Install & Deploy

1. Run `yarn install` or `npm install`.
2. To run the app use `yarn dev`.
3. Navigate to `localhost:3000` to view the app.


## Integration 

### Project Structure

* `pages` In Next.js, a page is a React Component exported from a `.js`, `.jsx`, `.ts`, or `.tsx` file in the pages directory. Each page is associated with a route based on its file name. You can read more about how works with [pages](https://nextjs.org/docs/basic-features/pages).  Each tab in the application corresponds to the following pages subdirectories
    * `pages/api` => Phone Call
    * `pages/audio` => Phone(Client Only)
    * `pages/conversations` => Conversation data
    * `pages/text` => Text
    * `pages/audio` => Audio
    * `pages/video` => Video

## Conclusion 

When implemented this application offers options to explore the following Symbl.ai features accessible via tabs at the top of the page. 

1. PSTN call implemented with the [NodeSDK] featuring real time transcription and insights.
2. PSTN call implemented with the [Telephony API][telephony] featuring real time transcription, insights, and [Symbl React Elements][reactelements].
3. Processed conversation data accessed from the [Conversation API](https://docs.symbl.ai/docs/conversation-api/overview/introduction) featuring participants and insights.
4. [Async Text API](https://docs.symbl.ai/docs/async-api/overview/text/post-text) featuring [Symbl React Elements][reactelements], transcription, and insights.
5. [Async Audio API](https://docs.symbl.ai/docs/async-api/overview/audio/post-audio) featuring [Symbl React Elements][reactelements], transcription, and insights.
6. [Async Video API](https://docs.symbl.ai/docs/async-api/overview/video/post-video) featuring [Symbl React Elements][reactelements], transcription, and insights.

## Community 

If you have any questions, feel free to reach out to us at devrelations@symbl.ai, through our Community [Slack][slack], or [developer community][developer_community]

This guide is actively developed, and we love to hear from you! Please feel free to [create an issue][issues] or [open a pull request][pulls] with your questions, comments, suggestions and feedback.  If you liked our integration guide, please star our repo!

This library is released under the [MIT License][license]

[license]: LICENSE.txt
[telephony]: https://docs.symbl.ai/docs/telephony/overview/post-api
[websocket]: https://docs.symbl.ai/docs/streamingapi/overview/introduction
[developer_community]: https://community.symbl.ai/?_ga=2.134156042.526040298.1609788827-1505817196.1609788827
[signup]: https://platform.symbl.ai/?_ga=2.63499307.526040298.1609788827-1505817196.1609788827
[issues]: https://github.com/symblai/symbl-for-zoom/issues
[pulls]: https://github.com/symblai/symbl-for-zoom/pulls
[slack]: https://join.slack.com/t/symbldotai/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA
[NodeSDK]: https://docs.symbl.ai/docs/javascript-sdk/overview/introduction
[reactelements]: https://docs.symbl.ai/docs/symbl-elements
