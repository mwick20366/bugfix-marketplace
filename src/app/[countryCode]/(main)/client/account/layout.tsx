import { retrieveClient } from "@lib/data/client"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/client/account/templates/account-layout"

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const client = await retrieveClient().catch(() => null)

  return (
    <AccountLayout client={client}>
      {client ? dashboard : login}
      <Toaster />
    </AccountLayout>
  )
}
