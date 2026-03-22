"use client"

import { Table, Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import EditButton from "@modules/common/components/edit-button"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import { Bug } from "@lib/data/bug"

type ItemProps = {
  item: Bug
  onEdit: (id: string) => void
  // onDelete: (id: string) => {}
}

const Item = ({ item, onEdit }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // const changeQuantity = async (quantity: number) => {
  //   setError(null)
  //   setUpdating(true)

  //   await updateLineItem({
  //     lineId: item.id,
  //     quantity,
  //   })
  //     .catch((err) => {
  //       setError(err.message)
  //     })
  //     .finally(() => {
  //       setUpdating(false)
  //     })
  // }

  return (
    <Table.Row className="w-full" data-testid="product-row">
      {/* <Table.Cell className="!pl-0 p-4 w-24">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell> */}
      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.title}
        </Text>
      </Table.Cell>
      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-description"
        >
          {item.description}
        </Text>
      </Table.Cell>
      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-description"
        >
          {item.techStack}
        </Text>
      </Table.Cell>
      <Table.Cell className="text-right">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-description"
        >
          ${item.bounty}
        </Text>
      </Table.Cell>
      <Table.Cell>
        <EditButton
          id={item.id}
          onEdit={onEdit}
        />
        <DeleteButton
          id={item.id}
        />
      </Table.Cell>        
      {/* TODO: Add status, priority, and other relevant fields for the bug */}
    </Table.Row>
  )
}

export default Item
