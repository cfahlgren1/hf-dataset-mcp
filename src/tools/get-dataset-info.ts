import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchDatasetViewer } from "../client.js";

interface InfoResponse {
  dataset_info: {
    description?: string;
    citation?: string;
    homepage?: string;
    license?: string;
    features?: Record<string, unknown>;
    builder_name?: string;
    dataset_name?: string;
    config_name?: string;
    version?: Record<string, unknown>;
    splits?: Record<
      string,
      {
        num_examples: number;
        num_bytes: number;
      }
    >;
    download_size?: number;
    dataset_size?: number;
  };
  partial: boolean;
}

export function registerGetDatasetInfo(server: McpServer) {
  server.tool(
    "get_dataset_info",
    "Get the schema, metadata, and row counts for a dataset configuration",
    {
      dataset: z.string().describe("Dataset ID (e.g., 'stanfordnlp/imdb')"),
      config: z.string().describe("Configuration name (from list_splits)"),
    },
    async ({ dataset, config }) => {
      const data = await fetchDatasetViewer<InfoResponse>("/info", {
        dataset,
        config,
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
