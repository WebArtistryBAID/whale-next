import {cookies} from 'next/headers'
import {decodeJwt, jwtVerify} from 'jose'

export function redirectToLogin(): string {
    return `${process.env.ONELOGIN_HOST}/oauth2/authorize?client_id=${process.env.ONELOGIN_CLIENT_ID}&redirect_uri=${process.env.HOST}/login/authorize&scope=basic+phone+sms&response_type=code`
}

export async function isLoggedIn(): Promise<boolean> {
    const cook = await cookies()
    if (!cook.has('access_token')) {
        return false
    }
    const token = cook.get('access_token')!.value!
    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!))
    } catch (e) {
        return false
    }
    if (decodeJwt(token).type !== 'internal') {
        return false
    }
    return true
}
