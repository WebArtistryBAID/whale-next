import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClockRotateLeft, faCoffee, faHouse, faUser} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import {useTranslation} from '@/app/i18n'

export default async function BottomNav() {
    const {t} = await useTranslation('home')

    return (
        <nav
            className="w-full flex justify-center p-2 bg-white border-t border-gray-200 border-solid fixed bottom-0 h-16 z-30">
            <div className="w-1/4">
                <Link href={'/'}>
                    <div className="text-center">
                        <FontAwesomeIcon icon={faHouse}/>
                        <p className="text-xs">{t('navbar.home')}</p>
                    </div>
                </Link>
            </div>
            <div className="w-1/4">
                <Link href={'/order'}>
                    <div className="text-center">
                        <FontAwesomeIcon icon={faCoffee}/>
                        <p className="text-xs">{t('navbar.order')}</p>
                    </div>
                </Link>
            </div>
            <div className="w-1/4">
                <Link href={'/history'}>
                    <div className="text-center">
                        <FontAwesomeIcon icon={faClockRotateLeft}/>
                        <p className="text-xs">{t('navbar.history')}</p>
                    </div>
                </Link>
            </div>
            <div className="w-1/4">
                <Link href={'/account'}>
                    <div className="text-center">
                        <FontAwesomeIcon icon={faUser}/>
                        <p className="text-xs">{t('navbar.account')}</p>
                    </div>
                </Link>
            </div>
        </nav>
    )
}
