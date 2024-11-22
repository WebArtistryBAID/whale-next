'use client'

import {useCookies} from 'react-cookie'
import {useRouter} from 'nextjs-toploader/app'

export default function LogOut() {
    const [cookies, setCookies] = useCookies()
    const router = useRouter()
    setCookies('access_token', null)
    router.push('/')
    return <div></div>
}
