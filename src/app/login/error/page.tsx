import {useTranslation} from '@/app/i18n'
import {redirect} from 'next/navigation'
import {redirectToLogin} from '@/app/login/login'

export default async function PageLoginOnboarding() {
    const {t} = await useTranslation('login')

    return <div className="flex justify-center items-center w-screen h-screen bg-cover bg-center"
                style={{backgroundImage: '/assets/login-bg.webp'}}>
        <div className="p-8 w-full h-full lg:w-1/2 xl:w-1/3 2xl:w-1/4 lg:h-auto bg-white rounded-3xl">
            <h1 className="font-display text-3xl font-bold mb-1">{t('login.title')}</h1>
            <p className="text-sm mb-5">
                {t('error')}
            </p>
            <button
                className="w-full rounded-full bg-blue-500 hover:bg-blue-600 hover:shadow-lg
                            transition-colors duration-100 p-2 text-white mb-8"
                onClick={() => {
                    redirect(redirectToLogin())
                }}>
                {t('tryAgain')}
            </button>
        </div>
    </div>
}
