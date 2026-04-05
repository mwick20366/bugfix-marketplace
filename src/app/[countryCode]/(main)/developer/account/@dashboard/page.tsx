"use client"

import { useQuery } from "@tanstack/react-query"
import { Container } from "@medusajs/ui"

type StatCardProps = {
  title: string
  value: string | number
  description?: string
}

const StatCard = ({ title, value, description }: StatCardProps) => (
  <Container className="flex flex-col gap-y-2 p-6">
    <p className="text-ui-fg-muted text-sm font-medium">{title}</p>
    <p className="text-ui-fg-base text-3xl font-semibold">{value}</p>
    {description && (
      <p className="text-ui-fg-subtle text-xs">{description}</p>
    )}
  </Container>
)

export default function DeveloperDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["developer-me"],
    queryFn: () => fetch("/developers/me").then((res) => res.json()),
  })

  const dashboard = data?.dashboard
  const developer = data?.developer

  const formattedTotalEarned =
    dashboard?.total_earned != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(dashboard.total_earned)
      : "-"

  return (
    <div className="flex flex-col gap-y-6 p-6">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-ui-fg-base text-2xl font-semibold">
          Welcome back{developer?.first_name ? `, ${developer.first_name}` : ""}
        </h1>
        <p className="text-ui-fg-muted text-sm">Here's an overview of your activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Available Bugs"
          value={isLoading ? "..." : dashboard?.available_bugs ?? 0}
          description="Open bugs you can claim"
        />
        <StatCard
          title="Active Claims"
          value={isLoading ? "..." : dashboard?.active_claims ?? 0}
          description="Bugs you're working on"
        />
        <StatCard
          title="Pending Review"
          value={isLoading ? "..." : dashboard?.pending_review ?? 0}
          description="Submissions awaiting client approval"
        />
        <StatCard
          title="Total Earned"
          value={isLoading ? "..." : formattedTotalEarned}
          description="Bounties received"
        />
      </div>
    </div>
  )
}