import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchDatasetViewer } from "../client.js";

interface StatisticsResponse {
  num_examples: number;
  statistics: Array<{
    column_name: string;
    column_type: string;
    column_statistics: Record<string, unknown>;
  }>;
  partial: boolean;
}

export function registerGetStatistics(server: McpServer) {
  server.tool(
    "get_statistics",
    "Get descriptive statistics for each column in a dataset split",
    {
      dataset: z.string().describe("Dataset ID (e.g., 'stanfordnlp/imdb')"),
      config: z.string().describe("Configuration name"),
      split: z.string().describe("Split name (train, test, validation)"),
    },
    async ({ dataset, config, split }) => {
      const data = await fetchDatasetViewer<StatisticsResponse>("/statistics", {
        dataset,
        config,
        split,
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
