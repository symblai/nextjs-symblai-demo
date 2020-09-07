import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'

const Button = ({ className, children, ...props }: any) => (
  <button
    {...props}
    className={css(
      tw`relative w-24 flex justify-center py-2 m-4 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus[outline-none border-indigo-700 shadow-outline-indigo active:bg-indigo-700] transition duration-150 ease-in-out`
    )}
  >
    {children}
  </button>
)

export default Button
