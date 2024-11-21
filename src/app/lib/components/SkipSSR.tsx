import dynamic from 'next/dynamic'
import React from 'react'

const SkipSSR = (props: any) => (
    <React.Fragment>{props.children}</React.Fragment>
)

export default dynamic(() => Promise.resolve(SkipSSR), {
    ssr: false
})
