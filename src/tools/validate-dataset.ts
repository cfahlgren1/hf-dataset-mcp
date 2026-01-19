import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchDatasetViewer } from "../client.js";

interface ValidResponse {
  viewer: boolean;
  preview: boolean;
  search: boolean;
  filter: boolean;
  statistics: boolean;
}

export function registerValidateDataset(server: McpServer) {
  server.tool(
    "validate_dataset",
    "Check if a dataset is accessible and which viewer features are available",
    {
      dataset: z.string().describe("Dataset ID (e.g., 'stanfordnlp/imdb')"),
    },
    async ({ dataset }) => {
      const data = await fetchDatasetViewer<ValidResponse>("/is-valid", {
        dataset,
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
