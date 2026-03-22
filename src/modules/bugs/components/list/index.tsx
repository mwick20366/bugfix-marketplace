"use client"

import { Bug } from "@lib/data/bug"
import { Client } from "@lib/data/client"
import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table, clx } from "@medusajs/ui"

import Item from "../../components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type BugsListTemplateProps = {
  bugs: Bug[],
  onEdit: (id: string) => void
}

const BugsListTemplate = ({ bugs, onEdit }: BugsListTemplateProps) => {
  // const items = client.items
  const hasOverflow = bugs && bugs.length > 4

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
            <Table.HeaderCell className="!pl-0">Title</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Tech Stack</Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Bounty
            </Table.HeaderCell>
            <Table.HeaderCell>
              Actions
            </Table.HeaderCell>
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
                      onEdit={(id: string) => onEdit(id)}
                      // onDelete={(id: string) => }
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default BugsListTemplate
