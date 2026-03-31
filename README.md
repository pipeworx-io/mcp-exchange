# mcp-exchange

Exchange MCP — wraps the Frankfurter currency exchange API (free, no auth)

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `get_rate` | Get the current exchange rate between two currencies (e.g., USD to EUR). |
| `convert` | Convert an amount from one currency to another at the current exchange rate. |
| `get_currencies` | List all currencies supported by the Frankfurter API with their full names. |

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

Or use the CLI:

```bash
npx pipeworx use exchange
```

## License

MIT
