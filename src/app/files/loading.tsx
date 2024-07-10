import { Loading } from '@/components/loading'
import Footer from '@/layouts/footer'
import Header from '@/layouts/Header'
import React from 'react'

function FilesLoading() {
    return <>
        <Header />
        <Loading />
        <Footer />
    </>
}

export default FilesLoading