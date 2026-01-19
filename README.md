# HF Dataset MCP

MCP server for the Hugging Face Dataset Viewer API. Search datasets, fetch rows, filter data, and more.

## Installation

```bash
npx @cfahlgren1/hf-dataset-mcp
```

## Configuration

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "hf-datasets": {
      "command": "npx",
      "args": ["-y", "@cfahlgren1/hf-dataset-mcp"],
      "env": {
        "HF_TOKEN": "hf_..."
      }
    }
  }
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `HF_TOKEN` | Hugging Face API token (required for private/gated datasets) |
| `HF_DATASETS_SERVER` | Custom Dataset Viewer API URL (default: `https://datasets-server.huggingface.co`) |

## Tools

### `search_datasets`
Find datasets on the Hugging Face Hub by name, tag, or author.

```
search_datasets(search?: string, author?: string, filter?: string[], sort?: string, limit?: number)
```

### `validate_dataset`
Check if a dataset is accessible and which viewer features are available.

```
validate_dataset(dataset: string)
```

### `list_splits`
Get all available configurations and splits for a dataset.

```
list_splits(dataset: string)
```

### `get_dataset_info`
Get the schema, metadata, and row counts for a dataset configuration.

```
get_dataset_info(dataset: string, config: string)
```

### `get_rows`
Fetch a slice of rows from a dataset split.

```
get_rows(dataset: string, config: string, split: string, offset?: number, length?: number)
```

### `search_dataset`
Full-text search within a dataset split using BM25 ranking.

```
search_dataset(dataset: string, config: string, split: string, query: string, offset?: number, length?: number)
```

### `filter_rows`
Filter dataset rows using SQL-like WHERE conditions.

```
filter_rows(dataset: string, config: string, split: string, where: string, orderby?: string, offset?: number, length?: number)
```

**WHERE syntax:** Column names in double quotes, strings in single quotes. Supports `=`, `<>`, `>`, `<`, `>=`, `<=`, `AND`, `OR`, `NOT`.

Example: `"label"=1 AND "text" LIKE '%hello%'`

### `get_dataset_size`
Get row counts and byte sizes for all configs and splits.

```
get_dataset_size(dataset: string)
```

### `list_parquet_files`
Get URLs for the dataset's Parquet files for direct download or processing.

```
list_parquet_files(dataset: string)
```

### `get_statistics`
Get descriptive statistics for each column in a dataset split.

```
get_statistics(dataset: string, config: string, split: string)
```

## Examples

### Find text classification datasets
```
search_datasets(filter: ["task_categories:text-classification"], sort: "downloads", limit: 10)
```

### Get IMDB dataset info
```
list_splits(dataset: "stanfordnlp/imdb")
get_dataset_info(dataset: "stanfordnlp/imdb", config: "plain_text")
```

### Fetch rows from a dataset
```
get_rows(dataset: "stanfordnlp/imdb", config: "plain_text", split: "train", offset: 0, length: 10)
```

### Search for specific content
```
search_dataset(dataset: "stanfordnlp/imdb", config: "plain_text", split: "train", query: "amazing movie")
```

### Filter rows
```
filter_rows(dataset: "stanfordnlp/imdb", config: "plain_text", split: "train", where: "\"label\"=1", length: 10)
```

## License

MIT
