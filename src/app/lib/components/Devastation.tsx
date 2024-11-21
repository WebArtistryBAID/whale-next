import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleExclamation} from '@fortawesome/free-solid-svg-icons'
import {useTranslation} from 'react-i18next'

export default function Devastation({
    screen
}: { screen: boolean } = {screen: false}): JSX.Element {
    const {t} = useTranslation()

    return (
        <div
            className={`${screen ? 'w-screen h-screen' : 'w-full h-full'} flex flex-col justify-center items-center p-5`}>
            <FontAwesomeIcon icon={faCircleExclamation} aria-label={t('a11y.error')}
                             className="text-4xl text-accent-red mb-3"/>
            <p className="font-bold font-display text-lg mb-1">{t('error.message')}</p>
        </div>
    )
}
