#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSearchDatasets } from "./tools/search-datasets.js";
import { registerGetRows } from "./tools/get-rows.js";

const server = new McpServer({
  name: "hf-dataset-mcp",
  version: "0.1.0",
});

// Register tools
registerSearchDatasets(server);
registerGetRows(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("hf-dataset-mcp server running on stdio");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
