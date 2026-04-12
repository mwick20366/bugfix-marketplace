import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET /submissions/:id - get a submission
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query")
  const submissionId = req.params.id

  const { data: [submission] } = await query.graph({
    entity: "submission",
    fields: ["*", "bug.*", "bug.developer.*", "bug.client.*"],
    filters: {
      id: submissionId,
    },
  }, {
    throwIfKeyNotFound: true,
  })

  res.json({ submission })
}
