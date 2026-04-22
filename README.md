# mcp-exchange

Exchange MCP — wraps the Frankfurter currency exchange API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_rate` | Get the current exchange rate between two currencies (e.g., USD, EUR). Returns the rate value and timestamp. |
| `convert` | Convert an amount from one currency to another at current rates. Returns the converted amount and the exchange rate applied. |
| `get_currencies` | List all supported currencies with codes and full names. Use to verify currency codes before converting or checking rates. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "exchange": {
      "url": "https://gateway.pipeworx.io/exchange/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Exchange data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
