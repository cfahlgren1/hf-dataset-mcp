import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchDatasetViewer } from "../client.js";

interface RowsResponse {
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

export function registerGetRows(server: McpServer) {
  server.tool(
    "get_rows",
    "Fetch a slice of rows from a dataset split",
    {
      dataset: z.string().describe("Dataset ID (e.g., 'stanfordnlp/imdb')"),
      config: z.string().describe("Configuration name (from list_splits)"),
      split: z.string().describe("Split name (train, test, validation)"),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Row index to start from (default: 0)"),
      length: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Number of rows to fetch (default: 100, max: 100)"),
    },
    async ({ dataset, config, split, offset, length }) => {
      const data = await fetchDatasetViewer<RowsResponse>("/rows", {
        dataset,
        config,
        split,
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
