# @pipeworx/mcp-exchange

MCP server for currency exchange rates — conversion, historical rates, and currency lists.

## Tools

| Tool | Description |
|------|-------------|
| `get_rate` | Get the current exchange rate between two currencies |
| `convert` | Convert an amount from one currency to another |
| `get_historical_rate` | Get the exchange rate on a specific past date |
| `get_currencies` | List all supported currencies |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "exchange": {
      "url": "https://gateway.pipeworx.io/exchange/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use exchange
```

## License

MIT
