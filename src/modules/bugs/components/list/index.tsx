"use client"

import { Bug } from "@lib/data/bugs"
import repeat from "@lib/util/repeat"
import { Table, clx } from "@medusajs/ui"

import Item from "../../components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type BugsListTemplateProps = {
  bugs: Bug[],
  actionButtons?: React.ReactNode
  // onEdit: (id: string) => void
}

const BugsListTemplate = ({ bugs, actionButtons }: BugsListTemplateProps) => {
  // const items = client.items
  const hasOverflow = bugs && bugs.length > 12

  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="pr-6">Title</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Tech Stack</Table.HeaderCell>
            <Table.HeaderCell className="pr-6 text-right">
              Bounty
            </Table.HeaderCell>
            {actionButtons && (
            <Table.HeaderCell>
              Actions
            </Table.HeaderCell>)}
          </Table.Row>
        </Table.Header>
        <Table.Body data-testid="items-table">
          {bugs
            ? bugs
                .sort((a, b) => {
                  return (a.createdAt ?? "") > (b.createdAt ?? "") ? -1 : 1
                })
                .map((bug) => {
                  return (
                    <Item
                      key={bug.id}
                      item={bug}
                      actionButtons={actionButtons}
                      // onDelete={(id: string) => }
                    />
                  )
                })
            : repeat(12).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default BugsListTemplate
