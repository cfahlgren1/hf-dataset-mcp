import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchHub } from "../client.js";

interface DatasetInfo {
  _id: string;
  id: string;
  author?: string;
  disabled?: boolean;
  gated?: boolean | string;
  lastModified: string;
  likes: number;
  trendingScore?: number;
  private: boolean;
  sha: string;
  description?: string;
  downloads: number;
  tags?: string[];
  createdAt: string;
}

export function registerSearchDatasets(server: McpServer) {
  server.tool(
    "search_datasets",
    "Find datasets on the Hugging Face Hub by name, tag, or author",
    {
      search: z
        .string()
        .optional()
        .describe("Query to match against dataset names and descriptions"),
      author: z
        .string()
        .optional()
        .describe("Filter by dataset owner (user or organization)"),
      filter: z
        .array(z.string())
        .optional()
        .describe(
          "Tag filters (e.g., task_categories:text-classification, language:en)"
        ),
      sort: z
        .enum([
          "trending_score",
          "downloads",
          "likes",
          "created_at",
          "last_modified",
        ])
        .optional()
        .describe("Sort order for results"),
      direction: z
        .enum(["asc", "desc"])
        .optional()
        .describe("Sort direction (default: desc)"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Max results to return (default: 20, max: 100)"),
    },
    async ({ search, author, filter, sort, direction, limit }) => {
      const params: Record<string, string | number | string[] | undefined> = {
        search,
        author,
        filter,
        sort,
        direction: direction === "asc" ? "1" : direction === "desc" ? "-1" : undefined,
        limit: limit ?? 20,
      };

      const datasets = await fetchHub<DatasetInfo[]>("/api/datasets", params);

      const results = datasets.map((d) => ({
        id: d.id,
        author: d.author,
        description: d.description?.slice(0, 200),
        downloads: d.downloads,
        likes: d.likes,
        trending_score: d.trendingScore,
        tags: d.tags?.slice(0, 10),
        last_modified: d.lastModified,
        private: d.private,
        gated: d.gated,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }
  );
}
