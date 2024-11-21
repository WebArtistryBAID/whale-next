'use client'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import {useTranslation} from 'react-i18next'
import {type ReactNode} from 'react'
import {useRouter} from 'nextjs-toploader/app'

export default function FullScreenDetail({title, children}: { title: string, children: ReactNode }): JSX.Element {
    const router = useRouter()
    const {t} = useTranslation()

    return <div className="flex justify-center items-center w-screen h-screen bg-gray-50 bg-cover bg-center"
                style={{backgroundImage: 'url(/assets/login-bg.webp)'}}>
        <div className="p-8 w-full h-full lg:w-1/2 xl:w-1/3 2xl:w-1/4 lg:h-auto bg-white rounded-3xl">
            <div className="flex items-center mb-16">
                <a className="skip-to-main" href="#main">{t('a11y.skipToMain')}</a>
                <button onClick={() => {
                    router.push('/')
                }} className="rounded-full p-1 hover:bg-gray-200 transition-colors duration-100 w-8 h-8 mr-3"
                        aria-label={t('a11y.back')}>
                    <FontAwesomeIcon icon={faArrowLeft} className="text-gray-800 text-lg"/>
                </button>
                <p className="font-display">{t('name')}</p>
            </div>

            <div id="main" className="h-full">
                <h1 className="font-display text-3xl font-bold mb-1">{title}</h1>
                <div className="mb-5">
                    {children}
                </div>

                <button
                    className="w-full rounded-full bg-blue-500 hover:bg-blue-600 hover:shadow-lg
                     transition-colors duration-100 p-2 text-white mb-8"
                    onClick={() => {
                        router.push('/')
                    }}>
                    {t('order.back')}
                </button>
            </div>
        </div>
    </div>
}
