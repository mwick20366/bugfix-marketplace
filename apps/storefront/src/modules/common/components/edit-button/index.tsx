// import { editLineItem } from "@lib/data/cart"
import { Spinner, Pencil } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

const EditButton = ({
  id,
  children,
  className,
  onEdit,
}: {
  id: string
  children?: React.ReactNode
  className?: string,
  onEdit: (id: string) => void
}) => {
  // const [isEditing, setIsEditing] = useState(false)

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => onEdit(id)}
      >
        <Pencil />
        {/* {isEditing ? <Spinner className="animate-spin" /> : <Pencil />} */}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default EditButton
