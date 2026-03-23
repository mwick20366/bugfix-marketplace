"use client"

import React from "react"
import { retrieveClientBugs } from "@lib/data/bugs"
import BugsListTemplate from "../list"
import { Bug } from "@lib/data/bugs"
import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation" 
import { Client } from "@lib/data/client"

type ClientBugsProps = {
  client: Client,
}

const ClientBugs: React.FC<ClientBugsProps> = ({ client }) => {
  const router = useRouter()
  const [bugs, setBugs] = React.useState<Bug[]>([])

  const handleEdit = (id: string) => {
    router.push(`/client/account/my-bugs/${id}`)
  }

  React.useEffect(() => {
    const fetchBugs = async () => {
      const data = await retrieveClientBugs(client.id)
      console.log('bugs', data);
      setBugs(data)
    }
    fetchBugs()
  }, [client.id])

  return (
    <div>
      <div className="pb-6">
        <Button
          variant="primary"
          onClick={() => {
            router.push(`/client/account/my-bugs/new`)
          }}
        >
          Add New Bug
        </Button>        
      </div>
      {bugs.length === 0 ? (
        <p>You have no bugs posted.</p>
      ) : (
        <BugsListTemplate
          // client={client} 
          bugs={bugs}
          // onEdit={handleEdit}
        />
      )}
    </div>
  )
}

export default ClientBugs