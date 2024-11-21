'use client'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import {useTranslationClient} from '@/app/i18n/client'
import {useRouter} from 'nextjs-toploader/app'

export default function TopBar(): JSX.Element {
    const router = useRouter()
    const {t} = useTranslationClient('home')

    return (
        <div
            className="p-2 lg:p-4 bg-accent-brown text-white border-b border-gray-900 border-solid flex w-full items-center">
            <div className="flex-shrink mr-2">
                <button onClick={() => {
                    router.push('/')
                }} className="rounded-full p-1 hover:bg-yellow-900 transition-colors duration-100 w-8 h-8"
                        aria-label={t('a11y.back')}>
                    <FontAwesomeIcon icon={faArrowLeft} className="text-white text-lg"/>
                </button>
            </div>
            <div className="flex-grow">
                <p className="font-bold font-display">{t('name')}</p>
            </div>
        </div>
    )
}
