import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchDatasetViewer } from "../client.js";

interface SearchResponse {
  features: Array<{
    feature_idx: number;
    name: string;
    type: Record<string, unknown>;
  }>;
  rows: Array<{
    row_idx: number;
    row: Record<string, unknown>;
    truncated_cells: string[];
  }>;
  num_rows_total: number;
  num_rows_per_page: number;
  partial: boolean;
}

export function registerSearchDataset(server: McpServer) {
  server.tool(
    "search_dataset",
    "Full-text search within a dataset split using BM25 ranking",
    {
      dataset: z.string().describe("Dataset ID (e.g., 'stanfordnlp/imdb')"),
      config: z.string().describe("Configuration name"),
      split: z.string().describe("Split name (train, test, validation)"),
      query: z.string().describe("Text to search for"),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Result offset for pagination (default: 0)"),
      length: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Number of results (default: 100, max: 100)"),
    },
    async ({ dataset, config, split, query, offset, length }) => {
      const data = await fetchDatasetViewer<SearchResponse>("/search", {
        dataset,
        config,
        split,
        query,
        offset: offset ?? 0,
        length: length ?? 100,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );
}
