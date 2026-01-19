#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSearchDatasets } from "./tools/search-datasets.js";
import { registerValidateDataset } from "./tools/validate-dataset.js";
import { registerListSplits } from "./tools/list-splits.js";
import { registerGetDatasetInfo } from "./tools/get-dataset-info.js";
import { registerGetRows } from "./tools/get-rows.js";
import { registerSearchDataset } from "./tools/search-dataset.js";
import { registerFilterRows } from "./tools/filter-rows.js";
import { registerGetDatasetSize } from "./tools/get-dataset-size.js";
import { registerListParquetFiles } from "./tools/list-parquet-files.js";
import { registerGetStatistics } from "./tools/get-statistics.js";

const server = new McpServer({
  name: "hf-dataset-mcp",
  version: "0.1.0",
});

// Register tools
registerSearchDatasets(server);
registerValidateDataset(server);
registerListSplits(server);
registerGetDatasetInfo(server);
registerGetRows(server);
registerSearchDataset(server);
registerFilterRows(server);
registerGetDatasetSize(server);
registerListParquetFiles(server);
registerGetStatistics(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("hf-dataset-mcp server running on stdio");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
