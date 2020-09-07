import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'

const Divider = () => (
  <hr className={css(tw`border-b-2 border-gray-600 my-8 mx-4`)}></hr>
)

export default Divider
