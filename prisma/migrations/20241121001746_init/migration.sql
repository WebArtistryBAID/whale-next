-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('waiting', 'done');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('pickUp', 'delivery');

-- CreateTable
CREATE TABLE "User"
(
    "id"          TEXT            NOT NULL,
    "name"        TEXT            NOT NULL,
    "pinyin"      TEXT            NOT NULL,
    "phone"       TEXT,
    "permissions" TEXT[],
    "createdAt"   TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)    NOT NULL,
    "blocked"     BOOLEAN         NOT NULL DEFAULT false,
    "points"      DECIMAL(65, 30) NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category"
(
    "id"   SERIAL NOT NULL,
    "name" TEXT   NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag"
(
    "id"    SERIAL NOT NULL,
    "name"  TEXT   NOT NULL,
    "color" TEXT   NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionType"
(
    "id"   SERIAL NOT NULL,
    "name" TEXT   NOT NULL,

    CONSTRAINT "OptionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionItem"
(
    "id"          SERIAL          NOT NULL,
    "typeId"      INTEGER         NOT NULL,
    "name"        TEXT            NOT NULL,
    "default"     BOOLEAN         NOT NULL DEFAULT false,
    "priceChange" DECIMAL(65, 30) NOT NULL DEFAULT 0,
    "soldOut"     BOOLEAN         NOT NULL DEFAULT false,

    CONSTRAINT "OptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemType"
(
    "id"               SERIAL          NOT NULL,
    "categoryId"       INTEGER         NOT NULL,
    "name"             TEXT            NOT NULL,
    "image"            TEXT,
    "description"      TEXT            NOT NULL,
    "shortDescription" TEXT            NOT NULL,
    "basePrice"        DECIMAL(65, 30) NOT NULL,
    "salePercent"      DECIMAL(65, 30) NOT NULL,
    "soldOut"          BOOLEAN         NOT NULL DEFAULT false,

    CONSTRAINT "ItemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderedItem"
(
    "id"         SERIAL  NOT NULL,
    "orderId"    INTEGER NOT NULL,
    "itemTypeId" INTEGER NOT NULL,
    "amount"     INTEGER NOT NULL,

    CONSTRAINT "OrderedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order"
(
    "id"           SERIAL          NOT NULL,
    "totalPrice"   DECIMAL(65, 30) NOT NULL,
    "number"       TEXT            NOT NULL,
    "status"       "OrderStatus"   NOT NULL,
    "createdAt"    TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3)    NOT NULL,
    "type"         "OrderType"     NOT NULL,
    "deliveryRoom" TEXT,
    "userId"       TEXT            NOT NULL,
    "onSiteName"   TEXT,
    "paid"         BOOLEAN         NOT NULL DEFAULT false,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ad"
(
    "id"    SERIAL NOT NULL,
    "name"  TEXT   NOT NULL,
    "image" TEXT,
    "url"   TEXT   NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingsItem"
(
    "key"   TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SettingsItem_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "_OptionItemToOrderedItem"
(
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ItemTypeToTag"
(
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ItemTypeToOptionType"
(
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OptionItemToOrderedItem_AB_unique" ON "_OptionItemToOrderedItem" ("A", "B");

-- CreateIndex
CREATE INDEX "_OptionItemToOrderedItem_B_index" ON "_OptionItemToOrderedItem" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemTypeToTag_AB_unique" ON "_ItemTypeToTag" ("A", "B");

-- CreateIndex
CREATE INDEX "_ItemTypeToTag_B_index" ON "_ItemTypeToTag" ("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemTypeToOptionType_AB_unique" ON "_ItemTypeToOptionType" ("A", "B");

-- CreateIndex
CREATE INDEX "_ItemTypeToOptionType_B_index" ON "_ItemTypeToOptionType" ("B");

-- AddForeignKey
ALTER TABLE "OptionItem"
    ADD CONSTRAINT "OptionItem_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "OptionType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemType"
    ADD CONSTRAINT "ItemType_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderedItem"
    ADD CONSTRAINT "OrderedItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderedItem"
    ADD CONSTRAINT "OrderedItem_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "ItemType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionItemToOrderedItem"
    ADD CONSTRAINT "_OptionItemToOrderedItem_A_fkey" FOREIGN KEY ("A") REFERENCES "OptionItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionItemToOrderedItem"
    ADD CONSTRAINT "_OptionItemToOrderedItem_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderedItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemTypeToTag"
    ADD CONSTRAINT "_ItemTypeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "ItemType" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemTypeToTag"
    ADD CONSTRAINT "_ItemTypeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemTypeToOptionType"
    ADD CONSTRAINT "_ItemTypeToOptionType_A_fkey" FOREIGN KEY ("A") REFERENCES "ItemType" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemTypeToOptionType"
    ADD CONSTRAINT "_ItemTypeToOptionType_B_fkey" FOREIGN KEY ("B") REFERENCES "OptionType" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
