import {cookies} from 'next/headers'
import {decodeJwt, jwtVerify} from 'jose'
import {redirect} from 'next/navigation'

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
    return decodeJwt(token).type === 'internal'
}

export async function me(): Promise<string> {
    const cook = await cookies()
    if (!cook.has('access_token')) {
        throw new Error('Unauthorized')
    }
    const token = cook.get('access_token')!.value!
    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!))
    } catch (e) {
        throw new Error('Unauthorized')
    }
    return decodeJwt(token).id as string
}

export async function isLoggedInWithPermission(permission: string): Promise<boolean> {
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
    const decoded = decodeJwt(token)
    return decoded.type === 'internal' && (decoded.permissions as string[]).includes(permission)
}

export async function requireLogin(): Promise<void> {
    if (!await isLoggedIn()) {
        redirect(redirectToLogin())
    }
}

export async function requirePermission(permission: string): Promise<void> {
    if (!await isLoggedInWithPermission(permission)) {
        throw new Error('Unauthorized')
    }
}
