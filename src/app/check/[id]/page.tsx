import {getOrder} from '@/app/lib/actions/data-actions'
import Devastation from '@/app/lib/components/Devastation'
import PageCheckWrapper from '@/app/check/[id]/PageCheck'

export default async function PageCheckHydrator({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const order = await getOrder(parseInt((await params).id))
    if (order == null) {
        return <Devastation screen={true}/>
    }
    return <PageCheckWrapper order={order}/>
}
