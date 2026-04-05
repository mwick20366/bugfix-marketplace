import { Container } from "@medusajs/ui"
import { retrieveClient } from "@lib/data/client"

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

export default async function ClientDashboardPage() {
  // const { data, isLoading } = useQuery({
  //   queryKey: ["client-me"],
  //   queryFn: () => fetch("/clients/me").then((res) => res.json()),
  // })
  const data = await retrieveClient().catch(() => null)

  console.log("Client Dashboard Data:", data) // Debugging log

  const dashboard = data?.dashboard
  const client = data?.client

  const formattedTotalSpent =
    dashboard?.total_spent != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(dashboard.total_spent)
      : "-"

  return (
    <div className="flex flex-col gap-y-6 p-6">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-ui-fg-base text-2xl font-semibold">
          Welcome back{client?.first_name ? `, ${client.first_name}` : ""}
        </h1>
        <p className="text-ui-fg-muted text-sm">Here's an overview of your bugs.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Open Bugs"
          value={dashboard?.open_bugs ?? 0}
          description="Awaiting a developer"
        />
        <StatCard
          title="In Progress"
          value={dashboard?.in_progress ?? 0}
          description="Claimed or fix submitted"
        />
        <StatCard
          title="Pending Approvals"
          value={dashboard?.pending_approvals ?? 0}
          description="Awaiting your review"
        />
        <StatCard
          title="Total Spent"
          value={formattedTotalSpent}
          description="Bounties paid out"
        />
      </div>
    </div>
  )
}