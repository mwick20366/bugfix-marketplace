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
  const clientData = await retrieveClient().catch(() => null)

  const { client } = clientData || {}

  return (
    <AccountLayout client={client}>
      {client ? dashboard : login}
      <Toaster />
    </AccountLayout>
  )
}
