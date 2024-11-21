'use client'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClock, faMugHot, faUser} from '@fortawesome/free-solid-svg-icons'
import {useTranslationClient} from '@/app/i18n/client'
import {useRouter} from 'next/navigation'
import {requireLoginClient} from '@/app/login/login-client'
import {useCookies} from 'react-cookie'

export function AccountButton() {
    const {t} = useTranslationClient('home')
    const router = useRouter()
    const [cookies] = useCookies()

    return (
        <button className="flex justify-center items-center flex-col rounded-3xl w-full h-full
                            px-3 py-5 bg-white hover:bg-gray-100 transition-colors duration-100"
                onClick={async () => {
                    await requireLoginClient(cookies)
                    router.push('/account')
                }}>
            <FontAwesomeIcon icon={faUser} className="text-blue-500 mb-3 text-5xl"/>

            <p className="font-bold text-xl font-display mb-0.5">
                {t('account.name')}
            </p>

            <p className="text-gray-400 text-xs">
                {t('account.description')}
            </p>
        </button>
    )
}

export function PickupButton() {
    const {t} = useTranslationClient('home')
    const router = useRouter()
    const [cookies] = useCookies()

    return (
        <button className="flex justify-center items-center flex-col rounded-3xl w-full h-full
                            px-3 py-5 bg-white hover:bg-gray-100 transition-colors duration-100"
                onClick={async () => {
                    await requireLoginClient(cookies)
                    router.push('/order')
                }}>
            <FontAwesomeIcon icon={faMugHot} className="text-accent-red mb-3 text-5xl"/>

            <p className="font-bold text-xl font-display mb-0.5">
                {t('pickUp.name')}
            </p>

            <p className="text-gray-400 text-xs">
                {t('pickUp.description')}
            </p>
        </button>
    )
}

export function HistoryButton() {
    const {t} = useTranslationClient('home')
    const router = useRouter()
    const [cookies] = useCookies()

    return (
        <button className="flex justify-center items-center flex-col rounded-3xl w-full h-full
                            px-3 py-5 bg-white hover:bg-gray-100 transition-colors duration-100"
                onClick={async () => {
                    await requireLoginClient(cookies)
                    router.push('/account')
                }}>
            <FontAwesomeIcon icon={faClock} className="text-accent-orange mb-3 text-5xl"/>

            <p className="font-bold text-xl font-display mb-0.5">
                {t('history.name')}
            </p>

            <p className="text-gray-400 text-xs">
                {t('history.description')}
            </p>
        </button>
    )
}
