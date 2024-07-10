'use client'

import React from 'react'

function Error(props: {error:{message:string}}) {
    const errorMessage = props?.error?.message
    return (
        <div>{errorMessage ?? "Oops There was an Error occred "}</div>
    )
}

export default Error