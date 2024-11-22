'use server'

import {Ad, Category, OrderStatus, PrismaClient, User, UserAuditLogType} from '@prisma/client'
import {me, requirePermission} from '@/app/login/login'
import Decimal from 'decimal.js'
import {
    serializeItemType,
    serializeItemTypeNotNull,
    serializeOrder,
    serializeOrderNotNull,
    serializeUser
} from '@/app/lib/utils'
import {
    HydratedItemType,
    HydratedOrder,
    OrderCreate,
    OrderEstimate,
    Paginated,
    SerializableUser,
    UserStatistics
} from '@/app/lib/actions/types'

const prisma = new PrismaClient()

export async function getItemTypes(): Promise<HydratedItemType[]> {
    return (await prisma.itemType.findMany({
        include: {
            tags: true,
            category: true,
            options: {include: {items: true}}
        }
    })).map(serializeItemTypeNotNull)
}

export async function getItemTypesByCategory(category: number): Promise<HydratedItemType[]> {
    return (await prisma.itemType.findMany({
        where: {categoryId: category},
        include: {tags: true, category: true, options: {include: {items: true}}}
    })).map(serializeItemTypeNotNull)
}

export async function getItemType(id: number): Promise<HydratedItemType | null> {
    return serializeItemType(await prisma.itemType.findUnique({
        where: {id},
        include: {tags: true, category: true, options: {include: {items: true}}}
    }))
}

export async function getCategories(): Promise<Category[]> {
    return prisma.category.findMany()
}

export async function getCategory(id: number): Promise<Category | null> {
    return prisma.category.findUnique({where: {id}})
}

export async function getSettings(key: string): Promise<string | null> {
    const setting = await prisma.settingsItem.findUnique({where: {key}})
    return setting?.value ?? null
}

export async function setSettings(key: string, value: string): Promise<string> {
    await requirePermission('admin.manage')
    await prisma.settingsItem.upsert({
        where: {key},
        update: {value},
        create: {key, value}
    })
    return value
}

export async function getOrder(id: number): Promise<HydratedOrder | null> {
    return serializeOrder(await prisma.order.findUnique({
        where: {id},
        include: {
            user: true,
            items: {
                include: {
                    itemType: {include: {tags: true, category: true, options: {include: {items: true}}}},
                    appliedOptions: true
                }
            }
        }
    }))
}

export async function getMyOrders(page: number): Promise<Paginated<HydratedOrder>> {
    return {
        items: (await prisma.order.findMany({
            skip: (page - 1) * 20,
            take: 20,
            where: {
                userId: await me()
            },
            include: {
                user: true,
                items: {
                    include: {
                        itemType: {include: {tags: true, category: true, options: {include: {items: true}}}},
                        appliedOptions: true
                    }
                }
            }
        })).map(serializeOrderNotNull),
        pages: Math.ceil(await prisma.order.count({where: {userId: await me()}}) / 20),
        page
    }
}

export async function getTodayCupsAmount(): Promise<number> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const orders = await prisma.order.findMany({where: {createdAt: {gte: today, lt: tomorrow}}})
    let result = 0
    for (const order of orders) {
        const items = await prisma.orderedItem.findMany({where: {orderId: order.id}})
        for (const item of items) {
            result += item.amount
        }
    }
    return result
}

export async function getOrderTimeEstimate(id: number | null = null): Promise<OrderEstimate> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let upwardLimit = new Date()
    if (id != null) {
        const order = await prisma.order.findUnique({where: {id, status: OrderStatus.waiting}})
        if (order != null) {
            upwardLimit = order.createdAt
        }
    }
    const orders = await prisma.order.findMany({
        where: {
            status: OrderStatus.waiting,
            createdAt: {gte: today, lte: upwardLimit}
        }
    })
    let result = 0
    let o = 0
    for (const order of orders) {
        const items = await prisma.orderedItem.findMany({where: {orderId: order.id}})
        o++
        for (const item of items) {
            result += item.amount * 2
        }
    }
    return {
        time: result,
        orders: o
    }
}

export async function getAllOrders(page: number): Promise<Paginated<HydratedOrder>> {
    await requirePermission('admin.manage')
    return {
        items: (await prisma.order.findMany({
            skip: (page - 1) * 10,
            take: 10,
            include: {
                user: true,
                items: {
                    include: {
                        itemType: {include: {tags: true, category: true, options: {include: {items: true}}}},
                        appliedOptions: true
                    }
                }
            }
        })).map(serializeOrderNotNull),
        pages: Math.ceil(await prisma.order.count() / 10),
        page
    }
}

export async function updateOrderStatus(orderId: number, status: OrderStatus | null, paid: boolean | null): Promise<HydratedOrder | null> {
    await requirePermission('admin.manage')
    await prisma.userAuditLog.create({
        data: {
            type: UserAuditLogType.modifyOrder,
            userId: await me(),
            values: [orderId.toString(), orderId.toString(), `${status}`, `${paid}`]
        }
    })
    return serializeOrder(await prisma.order.update({
        where: {id: orderId},
        data: {status: status ?? undefined, paid: paid ?? undefined},
        include: {
            user: true,
            items: {
                include: {
                    itemType: {include: {tags: true, category: true, options: {include: {items: true}}}},
                    appliedOptions: true
                }
            }
        }
    }))
}

export async function cancelOrder(id: number): Promise<boolean> {
    await requirePermission('admin.manage')
    await prisma.userAuditLog.create({
        data: {
            type: UserAuditLogType.deleteOrder,
            userId: await me(),
            values: [id.toString()]
        }
    })
    await prisma.order.delete({where: {id}})
    return true
}

export async function canFindUserByName(name: string): Promise<boolean> {
    await requirePermission('admin.manage')
    return prisma.user.findFirst({where: {name}}) != null
}

export async function canOrderByName(name: string): Promise<boolean> {
    await requirePermission('admin.manage')
    const user = await prisma.user.findFirst({where: {name}})
    if (user == null) {
        return false
    }
    const order = await prisma.order.count({
        where: {
            OR: [
                {
                    userId: user.id
                },
                {
                    onSiteName: name
                }
            ],
            paid: false
        }
    })
    return order === 0
}

export async function getTodayOrders(): Promise<HydratedOrder[]> {
    await requirePermission('admin.manage')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return (await prisma.order.findMany({
        where: {createdAt: {gte: today, lt: tomorrow}},
        include: {
            user: true,
            items: {
                include: {
                    itemType: {include: {tags: true, category: true, options: {include: {items: true}}}},
                    appliedOptions: true
                }
            }
        }
    })).map(serializeOrderNotNull)
}

export async function order(data: OrderCreate): Promise<HydratedOrder | null> {
    const user = await getMe()
    if (user == null || user.blocked) {
        return null
    }
    if (data.onSiteOrder) {
        await requirePermission('admin.manage')
        if (!await canOrderByName(data.onSiteName!)) {
            return null
        }
    } else if ((await prisma.order.count({
        where: {
            userId: user.id,
            paid: false
        }
    })) > 0) {
        return null
    }
    const today = await getTodayCupsAmount()
    if (today >= parseInt(await getSettings('total-quota') ?? '999')) {
        return null
    }

    let total = 0
    for (const item of data.items) {
        total += item.amount
        const itemType = await getItemType(item.itemType)
        if (itemType == null || itemType.soldOut) {
            return null
        }
        for (const option of item.appliedOptions) {
            const optionItem = await prisma.optionItem.findUnique({where: {id: option}})
            if (optionItem == null || optionItem.soldOut) {
                return null
            }
        }
    }
    if (total > parseInt(await getSettings('order-quota') ?? '10')) {
        return null
    }

    // Create the order
    let orderUser: User | null = user
    if (data.onSiteOrder) {
        const onSiteUser = await prisma.user.findMany({where: {name: data.onSiteName}})
        if (onSiteUser.length !== 1) {
            orderUser = null
        } else {
            orderUser = onSiteUser[0]
        }
    }

    const order = await prisma.order.create({
        data: {
            type: data.type,
            status: OrderStatus.waiting,
            userId: orderUser == null ? null : orderUser.id,
            deliveryRoom: data.deliveryRoom,
            number: '0',
            onSiteName: data.onSiteOrder ? data.onSiteName : undefined,
            totalPrice: new Decimal(0)
        }
    })
    if (orderUser != null) {
        await prisma.userAuditLog.create({
            data: {
                type: UserAuditLogType.createOrder,
                userId: orderUser.id,
                values: [order.id.toString()]
            }
        })
    }
    const items = []
    let totalPrice = new Decimal(0)
    for (const item of data.items) {
        const itemType = await getItemType(item.itemType)
        if (itemType == null) {
            return null
        }
        let singlePrice = new Decimal(itemType.basePrice)
        for (const option of item.appliedOptions) {
            const optionItem = await prisma.optionItem.findUnique({where: {id: option}})
            if (optionItem == null) {
                return null
            }
            singlePrice = singlePrice.add(optionItem.priceChange)
        }
        const orderedItem = await prisma.orderedItem.create({
            data: {
                orderId: order.id,
                itemTypeId: item.itemType,
                amount: item.amount,
                appliedOptions: {
                    connect: item.appliedOptions.map(option => ({id: option}))
                }
            }
        })
        items.push(orderedItem)
        totalPrice = totalPrice.add(new Decimal(singlePrice).mul(item.amount))
    }

    const latest = await prisma.order.findFirst({orderBy: {createdAt: 'desc'}})
    let number
    if (latest == null || latest.createdAt.getDate() !== new Date().getDate()) {
        number = '001'
    } else {
        number = (parseInt(latest.number) + 1).toString().padStart(3, '0')
    }
    return serializeOrder(await prisma.order.update({
        where: {id: order.id},
        include: {
            user: true,
            items: {
                include: {
                    itemType: {include: {tags: true, category: true, options: {include: {items: true}}}},
                    appliedOptions: true
                }
            }
        },
        data: {totalPrice, number}
    }))
}

export async function getMe(): Promise<User> {
    return (await prisma.user.findUnique({where: {id: await me()}}))!
}

export async function getMeCrossBoundary(): Promise<SerializableUser> {
    return serializeUser((await prisma.user.findUnique({where: {id: await me()}}))!)
}

export async function getMeCanOrder(): Promise<HydratedOrder | null> {
    return serializeOrder(await prisma.order.findFirst({
        where: {
            OR: [
                {
                    userId: await me()
                }
            ],
            paid: false
        },
        include: {
            user: true,
            items: {
                include: {
                    itemType: {include: {tags: true, category: true, options: {include: {items: true}}}},
                    appliedOptions: true
                }
            }
        }
    }))
}

export async function getUploadServePath(): Promise<string> {
    return process.env.UPLOAD_SERVE_PATH!
}

export async function getMeStatistics(): Promise<UserStatistics> {
    const me = await getMe()
    const orders = await prisma.order.findMany({where: {userId: me.id}})
    let spent = new Decimal(0)
    let cups = 0
    for (const order of orders) {
        spent = spent.add(order.totalPrice)
        const items = await prisma.orderedItem.findMany({where: {orderId: order.id}})
        for (const item of items) {
            cups += item.amount
        }
    }
    return {
        totalOrders: orders.length,
        totalSpent: spent.toString(),
        totalCups: cups
    }
}

export async function getGeneralStatistics() {
    // TODO
}

export async function getAds(): Promise<Ad[]> {
    return prisma.ad.findMany()
}

