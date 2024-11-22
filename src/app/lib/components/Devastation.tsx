'use client'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import {useTranslationClient} from '@/app/i18n/client'

export default function Devastation({
    screen
}: { screen: boolean }) {
    const {t} = useTranslationClient('home')

    return (
        <div
            className={`${screen ? 'w-screen h-screen' : 'w-full h-full'} flex flex-col justify-center items-center p-5`}>
            <FontAwesomeIcon icon={faCircleExclamation} aria-label={t('a11y.error')}
                             className="text-4xl text-accent-red mb-3"/>
            <p className="font-bold font-display text-lg mb-1">{t('error')}</p>
        </div>
    )
}

Devastation.defaultProps = {
    screen: false
}
