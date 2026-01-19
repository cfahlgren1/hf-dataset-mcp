import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchDatasetViewer } from "../client.js";

interface SizeResponse {
  size: {
    dataset: {
      num_bytes_original_files?: number;
      num_bytes_parquet_files?: number;
      num_bytes_memory?: number;
      num_rows?: number;
    };
    configs: Array<{
      dataset: string;
      config: string;
      num_bytes_original_files?: number;
      num_bytes_parquet_files?: number;
      num_bytes_memory?: number;
      num_rows?: number;
    }>;
    splits: Array<{
      dataset: string;
      config: string;
      split: string;
      num_bytes_original_files?: number;
      num_bytes_parquet_files?: number;
      num_bytes_memory?: number;
      num_rows?: number;
    }>;
  };
  pending: unknown[];
  failed: unknown[];
  partial: boolean;
}

export function registerGetDatasetSize(server: McpServer) {
  server.tool(
    "get_dataset_size",
    "Get row counts and byte sizes for all configs and splits",
    {
      dataset: z.string().describe("Dataset ID (e.g., 'stanfordnlp/imdb')"),
    },
    async ({ dataset }) => {
      const data = await fetchDatasetViewer<SizeResponse>("/size", {
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
