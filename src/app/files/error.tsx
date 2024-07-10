'use client'

import React from 'react'
import { Error } from '@/components/error'
import Footer from '@/layouts/footer'
import Header from '@/layouts/Header'

function FilesError(props: { error: { message: string } }) {
    return (
        <>
            < Header />

            <Error />
            < Footer />

        </>
    )
}

export default FilesError

