"use client"

import { useState } from "react"
import { Button } from "@medusajs/ui"

const STOCK_AVATARS = [
  "/images/stock-avatars/asian-female-1.png",
  "/images/stock-avatars/asian-female-2.png",
  "/images/stock-avatars/black-female-1.png",
  "/images/stock-avatars/black-female-2.png",
  "/images/stock-avatars/black-female-3.png",
  "/images/stock-avatars/black-male-1.png",
  "/images/stock-avatars/female-1.png",
  "/images/stock-avatars/female-2.png",
  "/images/stock-avatars/male-1.png",
  "/images/stock-avatars/male-2.png",
  "/images/stock-avatars/male-3.png",
  "/images/stock-avatars/male-4.png",
  "/images/stock-avatars/apple.png",
  "/images/stock-avatars/banana.png",
  "/images/stock-avatars/cherries.png",
  "/images/stock-avatars/grapes.png",
  "/images/stock-avatars/orange.png",
  "/images/stock-avatars/peach.png",
  "/images/stock-avatars/pear.png",
  "/images/stock-avatars/strawberry.png",
  "/images/stock-avatars/watermelon.png",
  "/images/stock-avatars/blue-jay.png",
  "/images/stock-avatars/dog.png",
  "/images/stock-avatars/cat.png",
  "/images/stock-avatars/hamster.png",
  "/images/stock-avatars/fish.png",
  "/images/stock-avatars/otter.png",
  "/images/stock-avatars/panda.png",
  "/images/stock-avatars/snake.png",
  // add more as needed
]

type StockAvatarModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export default function StockAvatarModal({
  isOpen,
  onClose,
  onSelect,
}: StockAvatarModalProps) {
  const [selected, setSelected] = useState<string | null>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-large-semi mb-4">Choose a Stock Avatar</h2>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {STOCK_AVATARS.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setSelected(url)}
              className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-colors flex-shrink-0 ${
                selected === url
                  ? "border-ui-border-interactive"
                  : "border-transparent"
              }`}
            >
              <img
                src={url}
                alt="Stock avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-x-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selected) {
                onSelect(selected)
                onClose()
              }
            }}
            disabled={!selected}
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  )
}
