import type {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";
import { PostCreateBugSchema } from "./validators";
import { createBugWorkflow } from "../../workflows/bug";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type CreateBugBody = z.infer<typeof PostCreateBugSchema>;

// GET /bugs
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { q, status, difficulty, developer_id, client_id, tech_stack } =
    req.validatedQuery as {
      q?: string;
      status?: string | string[];
      difficulty?: string | string[];
      developer_id?: string;
      client_id?: string;
      tech_stack?: string | string[];
    };

  const isAdmin = req.auth_context?.actor_type === "user";
  const currentUserId = req.auth_context?.actor_id;

  let developerId: string | undefined = developer_id;
  let clientId: string | undefined = client_id;

  if (!isAdmin) {
    if (developerId && req.auth_context?.actor_type === "developer") {
      developerId = currentUserId;
    } else if (clientId && req.auth_context?.actor_type === "client") {
      clientId = currentUserId;
    }
  }

  // Normalize status and difficulty to arrays
  const statusFilter = status
    ? Array.isArray(status)
      ? status
      : [status]
    : undefined;

  const difficultyFilter = difficulty
    ? Array.isArray(difficulty)
      ? difficulty
      : [difficulty]
    : undefined;

  // Normalize tech_stack to array
  const techStackFilter = tech_stack
    ? Array.isArray(tech_stack)
      ? tech_stack
      : [tech_stack]
    : undefined;

  const { data: bugs, metadata: { count, take, skip } = {} } =
    await query.graph({
      entity: "bug",
      ...req.queryConfig,
      filters: {
        ...(q && {
          $or: [
            { title: { $ilike: `%${q}%` } },
            { description: { $ilike: `%${q}%` } },
            { tech_stack: { $ilike: `%${q}%` } },
          ],
        }),
        $and: [
          ...(statusFilter
            ? [{ $or: statusFilter.map((s) => ({ status: { $ilike: s } })) }]
            : []),
          ...(difficultyFilter
            ? [
                {
                  $or: difficultyFilter.map((d) => ({
                    difficulty: { $ilike: d },
                  })),
                },
              ]
            : []),
          ...(techStackFilter
            ? [
                {
                  $or: techStackFilter.map((tag) => ({
                    tech_stack: { $ilike: `%${tag}%` },
                  })),
                },
              ]
            : []),
          ...(developerId ? [{ developer: { id: developerId } }] : []),
          ...(clientId ? [{ client: { id: clientId } }] : []),
        ],
      } as any, // ← cast to any to suppress TS errors
    });

  res.json({ bugs, count, limit: take, offset: skip });
};

// POST /bugs
export const POST = async (
  req: AuthenticatedMedusaRequest<CreateBugBody>,
  res: MedusaResponse,
) => {
  const { result } = await createBugWorkflow(req.scope).run({
    input: {
      bug: req.validatedBody,
    },
  });

  res.json({ bug: result });
};
