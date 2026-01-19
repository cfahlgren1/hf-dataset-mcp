import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchDatasetViewer } from "../client.js";

interface ParquetResponse {
  parquet_files: Array<{
    dataset: string;
    config: string;
    split: string;
    url: string;
    filename: string;
    size: number;
  }>;
  pending: unknown[];
  failed: unknown[];
  partial: boolean;
}

export function registerListParquetFiles(server: McpServer) {
  server.tool(
    "list_parquet_files",
    "Get URLs for the dataset's Parquet files for direct download or processing",
    {
      dataset: z.string().describe("Dataset ID (e.g., 'stanfordnlp/imdb')"),
    },
    async ({ dataset }) => {
      const data = await fetchDatasetViewer<ParquetResponse>("/parquet", {
        dataset,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(data.parquet_files, null, 2),
          },
        ],
      };
    }
  );
}
