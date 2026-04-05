import { createDeveloperReview } from "@lib/data/developer-reviews"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type CreateDeveloperReviewInput = {
  rating: number
  notes?: string
  developer_id: string
  submission_id: string
}

export function useCreateDeveloperReview(submissionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDeveloperReviewInput) => {
      return createDeveloperReview(data)
      // const res = await fetch("/store/developer-reviews", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })

      // if (!res.ok) {
      //   const error = await res.json()
      //   throw new Error(error.message || "Failed to submit review")
      // }

      // return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId] })
      queryClient.invalidateQueries({ queryKey: ["developer-submissions"] })
    },
  })
}