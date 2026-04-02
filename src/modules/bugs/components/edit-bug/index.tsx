// src/components/bugs/edit-bug.tsx
"use client"

import { useForm, FormProvider, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Drawer, Heading, Label, Input, Textarea, Button, toast } from "@medusajs/ui"
import { editBugSchema, EditBugSchema } from "./validators"
import { sdk } from "@lib/config"
import { Bug, retrieveBug, updateBug as saveBugChanges } from "@lib/data/bugs"
import { useEffect } from "react"

type EditBugDrawerProps = {
  bug: Bug
  isOpen: boolean
  onClose: (open: boolean) => void
}

export const EditBugDrawer = ({ bug, isOpen, onClose }: EditBugDrawerProps) => {
  const queryClient = useQueryClient()

  const form = useForm<EditBugSchema>({
    resolver: zodResolver(editBugSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      tech_stack: "",
      repo_link: "",
      bounty: 0,
    },
  })

  // Fetch full bug details when drawer opens
  const { data: retrievedBug, isLoading } = useQuery({
    queryFn: () => retrieveBug(bug.id),
    queryKey: ["bug", bug.id],
    enabled: isOpen && !!bug.id, // only fetch when drawer is open
  })

  // const bug = bugData?.bug

  // Reset form when drawer opens with current bug data
  useEffect(() => {
    if (retrievedBug && isOpen) {
      form.reset({
        title: retrievedBug.title,
        description: retrievedBug.description,
        tech_stack: retrievedBug.tech_stack || "",
        repo_link: retrievedBug.repo_link || "",
        bounty: retrievedBug.bounty,
      })
    }
  }, [retrievedBug, isOpen, form])

  const { mutate: updateBug, isPending } = useMutation({
    mutationFn: (data: EditBugSchema) => saveBugChanges({ ...data, bugId: bug.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] })
      toast.success("Bug updated successfully")
      onClose(false)
    },
    onError: (error) => {
      toast.error(`Failed to update bug: ${error.message}`)
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    updateBug(data)
  })

  return (
    <Drawer open={isOpen} onOpenChange={() => onClose(false)}>
      <Drawer.Content
        className="z-[60]"
        overlayProps={{
            className: "z-[60] !transition-none !animate-none",
        }}
      >
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
            <Drawer.Header>
              <Heading>Edit Bug</Heading>
            </Drawer.Header>
            <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-6 overflow-y-auto p-6">
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col gap-y-2">
                    <Label size="small" weight="plus">Title</Label>
                    <Input {...field} placeholder="Bug title" />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col gap-y-2">
                    <Label size="small" weight="plus">Description</Label>
                    <Textarea {...field} rows={4} placeholder="Describe the bug..." />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name="tech_stack"
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col gap-y-2">
                    <Label size="small" weight="plus">Tech Stack</Label>
                    <Input {...field} placeholder="Enter the tech stack..." />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name="repo_link"
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col gap-y-2">
                    <Label size="small" weight="plus">Repository Link</Label>
                    <Input {...field} placeholder="Enter the repository link..." />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name="bounty"
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col gap-y-2">
                    <Label size="small" weight="plus">Bounty ($)</Label>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </div>
                )}
              />
            </Drawer.Body>
            <Drawer.Footer>
              <div className="flex items-center justify-end gap-x-2">
                <Drawer.Close asChild>
                  <Button size="small" variant="secondary">Cancel</Button>
                </Drawer.Close>
                <Button
                  size="small"
                  type="submit"
                  isLoading={isPending}
                  disabled={!form.formState.isValid || isPending}
                >
                  Save
                </Button>
              </div>
            </Drawer.Footer>
          </form>
        </FormProvider>
      </Drawer.Content>
    </Drawer>
  )
}