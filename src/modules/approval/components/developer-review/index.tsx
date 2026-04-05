// src/modules/approval/components/developer-review-modal/index.tsx
"use client"

import { useForm, Controller, FormProvider } from "react-hook-form"
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star, StarSolid } from "@medusajs/icons"
import { Button, Textarea, Label, toast, Toaster } from "@medusajs/ui"
import { useCreateDeveloperReview } from "@lib/hooks/use-create-developer-review"

const schema = zod.object({
  rating: zod
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  notes: zod.string().optional(),
})

type DeveloperReviewFormValues = zod.infer<typeof schema>

type DeveloperReviewProps = {
  submissionId: string
  developerId: string
  onClose: () => void
}

export function DeveloperReview({
  submissionId,
  developerId,
  onClose,
}: DeveloperReviewProps) {
  const { mutate: createReview, isPending, isSuccess } = useCreateDeveloperReview(submissionId)

  const form = useForm<DeveloperReviewFormValues>({
    defaultValues: {
      rating: 0,
      notes: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const { formState: { isValid } } = form

  const handleSubmit = form.handleSubmit((data) => {
    createReview(
      {
        rating: data.rating,
        notes: data.notes,
        developer_id: developerId,
        submission_id: submissionId,
      },
      {
        onSuccess: () => {
          toast.success("Success", {
            description: "Your review has been submitted.",
          })
        },
        onError: (err: any) => {
          toast.error("Error", {
            description: err.message || "Failed to submit review.",
          })
        },
      }
    )
  })

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <p className="text-ui-fg-base text-xl-regular">Thanks for your review!</p>
        <Button onClick={onClose}>Close</Button>
        <Toaster />
      </div>
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
        <p className="text-ui-fg-base text-xl-regular">Rate the Developer</p>

        {/* Star Rating */}
        <div className="flex flex-col gap-y-2">
          <Label>Rating</Label>
          <Controller
            control={form.control}
            name="rating"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-y-1">
                <div className="flex gap-x-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => field.onChange(index + 1)}
                      className="p-0 bg-transparent border-none cursor-pointer"
                    >
                      {field.value >= index + 1 ? (
                        <StarSolid className="text-ui-tag-orange-icon w-6 h-6" />
                      ) : (
                        <Star className="w-6 h-6" />
                      )}
                    </button>
                  ))}
                </div>
                {fieldState.error && (
                  <p className="text-red-500 text-xs">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-y-2">
          <Label>Notes (optional)</Label>
          <Controller
            control={form.control}
            name="notes"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Leave notes for the developer"
              />
            )}
          />
        </div>

        <Button
          type="submit"
          isLoading={isPending}
          disabled={isPending || !isValid}
          className="w-full"
        >
          Submit Review
        </Button>
      </form>
      <Toaster />
    </FormProvider>
  )
}
