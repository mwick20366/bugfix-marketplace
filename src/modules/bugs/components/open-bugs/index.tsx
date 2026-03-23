"use client"

import React from "react"
import BugsListTemplate from "../list"
import { Bug } from "@lib/data/bugs"
import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation" 
import { Client } from "@lib/data/client"

type OpenBugsProps = {
  // client: Client,
}
  
const OpenBugs: React.FC<OpenBugsProps> = () => {
  const router = useRouter()
  const [bugs, setBugs] = React.useState<Bug[]>([])

  // const handleEdit = (id: string) => {
  //   router.push(`/client/account/my-bugs/${id}`)
  // }

  // React.useEffect(() => {
  //   const fetchBugs = async () => {
  //     const data = await retrieveBugs()
  //     console.log('bugs', data);
  //     setBugs(data)
  //   }
  //   fetchBugs()
  // }, [client.id])

  return (
    <div>
      Open Bugs (Deprecated)
      {/* <Button
        variant="primary"
        onClick={() => {
          router.push(`/client/account/my-bugs/new`)
        }}
      >
        Add New Bug
      </Button>
      {bugs.length === 0 ? (
        <p>You have no bugs posted.</p>
      ) : (
        <BugsListTemplate
          bugs={bugs}
        />
      )} */}
    </div>
  )
}

export default OpenBugs