// src/modules/dashboard/components/stat-card/index.tsx
import { Container } from "@medusajs/ui"

type StatCardProps = {
  title: string
  value: string | number
  description?: string
}

export const StatCard = ({ title, value, description }: StatCardProps) => {
  return (
    <Container className="flex flex-col gap-y-2 p-6">
      <p className="text-ui-fg-muted text-sm font-medium">{title}</p>
      <p className="text-ui-fg-base text-3xl font-semibold">{value}</p>
      {description && (
        <p className="text-ui-fg-subtle text-xs">{description}</p>
      )}
    </Container>
  )
}