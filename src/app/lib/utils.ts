import Decimal from 'decimal.js'
import {LocalOrderedItem} from '@/app/lib/provider/shopping-cart'
import {Order, User} from '@prisma/client'
import {HydratedItemType, HydratedOrder, SerializableUser} from '@/app/lib/actions/types'

export function moneyRound(n: Decimal): Decimal {
    return n.mul(100).round().div(100)
}

export function clientCalculate(item: LocalOrderedItem): Decimal {
    return new Decimal(item.itemType.basePrice)
        .mul(item.itemType.salePercent)
        .add(item.appliedOptions
            .map(option => option.priceChange)
            .reduce((partialSum, current) => partialSum.add(current), new Decimal(0))
        ).mul(item.amount)
}

export function serializeUser(user: User): SerializableUser {
    return {
        id: user.id,
        name: user.name,
        pinyin: user.pinyin,
        phone: user.phone,
        permissions: user.permissions,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        blocked: user.blocked,
        points: user.points.toString()
    }
}

export function serializeOrder(order: any): HydratedOrder | null {
    if (order == null) {
        return null
    }
    return {
        id: order.id,
        type: order.type,
        status: order.status,
        user: order.user == null ? null : serializeUser(order.user),
        userId: order.userId,
        items: order.items.map((item: any) => ({
            id: item.id,
            itemType: serializeItemType(item.itemType),
            itemTypeId: item.itemTypeId,
            amount: item.amount,
            appliedOptions: item.appliedOptions.map((option: any) => ({
                id: option.id,
                name: option.name,
                priceChange: option.priceChange.toString(),
                soldOut: option.soldOut,
                default: option.default
            }))
        })),
        deliveryRoom: order.deliveryRoom,
        number: order.number,
        onSiteName: order.onSiteName,
        totalPrice: order.totalPrice.toString(),
        paid: order.paid,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
    }
}

export function serializeOrderNotNull(order: Order): HydratedOrder {
    return serializeOrder(order)!
}

export function serializeItemType(item: any | null): HydratedItemType | null {
    if (item == null) {
        return null
    }
    return {
        id: item.id,
        name: item.name,
        shortDescription: item.shortDescription,
        description: item.description,
        image: item.image,
        basePrice: item.basePrice.toString(),
        salePercent: item.salePercent.toString(),
        soldOut: item.soldOut,
        category: item.category,
        categoryId: item.categoryId,
        tags: item.tags,
        options: item.options.map((option: any) => ({
            id: option.id,
            name: option.name,
            required: option.required,
            items: option.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                priceChange: item.priceChange.toString(),
                default: item.default
            }))
        }))
    }
}

export function serializeItemTypeNotNull(item: any): HydratedItemType {
    return serializeItemType(item)!
}
