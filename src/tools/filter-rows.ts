import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchDatasetViewer } from "../client.js";

interface FilterResponse {
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

export function registerFilterRows(server: McpServer) {
  server.tool(
    "filter_rows",
    "Filter dataset rows using SQL-like WHERE conditions",
    {
      dataset: z.string().describe("Dataset ID (e.g., 'stanfordnlp/imdb')"),
      config: z.string().describe("Configuration name"),
      split: z.string().describe("Split name (train, test, validation)"),
      where: z
        .string()
        .describe(
          'Filter condition (e.g., "age">30 AND "city"=\'Paris\'). Column names in double quotes, strings in single quotes.'
        ),
      orderby: z
        .string()
        .optional()
        .describe('Sort column and direction (e.g., "score" DESC)'),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Result offset (default: 0)"),
      length: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Number of results (default: 100, max: 100)"),
    },
    async ({ dataset, config, split, where, orderby, offset, length }) => {
      const data = await fetchDatasetViewer<FilterResponse>("/filter", {
        dataset,
        config,
        split,
        where,
        orderby,
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
