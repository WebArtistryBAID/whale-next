import {useCookies} from 'react-cookie'
import {getLoginTarget} from '@/app/login/login-actions'

export async function requireLoginClient(): Promise<void> {
    const [cookies] = useCookies()
    if (!('access_token' in cookies)) {
        location.href = await getLoginTarget()
    }
}
