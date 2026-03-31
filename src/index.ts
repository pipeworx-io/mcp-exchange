interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Exchange MCP — wraps the Frankfurter currency exchange API (free, no auth)
 *
 * Tools:
 * - get_rate: current exchange rate between two currencies
 * - convert: convert an amount between currencies
 * - get_historical_rate: exchange rate on a specific past date
 * - get_currencies: list all available currencies
 */


const BASE_URL = 'https://api.frankfurter.app';

const tools: McpToolExport['tools'] = [
  {
    name: 'get_rate',
    description: 'Get the current exchange rate between two currencies (e.g., USD to EUR).',
    inputSchema: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'Source currency code (e.g., USD, EUR, GBP)' },
        to: { type: 'string', description: 'Target currency code (e.g., EUR, JPY, CHF)' },
      },
      required: ['from', 'to'],
    },
  },
  {
    name: 'convert',
    description: 'Convert an amount from one currency to another at the current exchange rate.',
    inputSchema: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'Source currency code (e.g., USD)' },
        to: { type: 'string', description: 'Target currency code (e.g., JPY)' },
        amount: { type: 'number', description: 'Amount to convert' },
      },
      required: ['from', 'to', 'amount'],
    },
  },
  {
    name: 'get_historical_rate',
    description:
      'Get the exchange rate between two currencies on a specific historical date (YYYY-MM-DD).',
    inputSchema: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'Source currency code (e.g., USD)' },
        to: { type: 'string', description: 'Target currency code (e.g., EUR)' },
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (earliest available: 1999-01-04)',
        },
      },
      required: ['from', 'to', 'date'],
    },
  },
  {
    name: 'get_currencies',
    description: 'List all currencies supported by the Frankfurter API with their full names.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_rate':
      return getRate(args.from as string, args.to as string);
    case 'convert':
      return convert(args.from as string, args.to as string, args.amount as number);
    case 'get_historical_rate':
      return getHistoricalRate(args.from as string, args.to as string, args.date as string);
    case 'get_currencies':
      return getCurrencies();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function fetchRate(endpoint: string, from: string, to: string) {
  const params = new URLSearchParams({
    base: from.toUpperCase(),
    symbols: to.toUpperCase(),
  });
  const res = await fetch(`${BASE_URL}/${endpoint}?${params}`);
  if (!res.ok) throw new Error(`Frankfurter error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as {
    amount: number;
    base: string;
    date: string;
    rates: Record<string, number>;
  };

  const rate = data.rates[to.toUpperCase()];
  if (rate === undefined) throw new Error(`Currency not found: ${to.toUpperCase()}`);
  return { data, rate };
}

async function getRate(from: string, to: string) {
  const { data, rate } = await fetchRate('latest', from, to);
  return {
    from: data.base,
    to: to.toUpperCase(),
    rate,
    date: data.date,
  };
}

async function convert(from: string, to: string, amount: number) {
  const { data, rate } = await fetchRate('latest', from, to);
  return {
    from: data.base,
    to: to.toUpperCase(),
    rate,
    amount,
    converted: Math.round(amount * rate * 10000) / 10000,
    date: data.date,
  };
}

async function getHistoricalRate(from: string, to: string, date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date format: "${date}". Expected YYYY-MM-DD.`);
  }
  const { data, rate } = await fetchRate(date, from, to);
  return {
    from: data.base,
    to: to.toUpperCase(),
    rate,
    date: data.date,
  };
}

async function getCurrencies() {
  const res = await fetch(`${BASE_URL}/currencies`);
  if (!res.ok) throw new Error(`Frankfurter error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as Record<string, string>;
  return {
    count: Object.keys(data).length,
    currencies: Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([code, name]) => ({ code, name })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
