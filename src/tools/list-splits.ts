import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchDatasetViewer } from "../client.js";

interface SplitsResponse {
  splits: Array<{
    dataset: string;
    config: string;
    split: string;
  }>;
  pending: unknown[];
  failed: unknown[];
}

export function registerListSplits(server: McpServer) {
  server.tool(
    "list_splits",
    "Get all available configurations and splits for a dataset",
    {
      dataset: z.string().describe("Dataset ID (e.g., 'stanfordnlp/imdb')"),
    },
    async ({ dataset }) => {
      const data = await fetchDatasetViewer<SplitsResponse>("/splits", {
        dataset,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(data.splits, null, 2),
          },
        ],
      };
    }
  );
}
