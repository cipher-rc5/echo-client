# readme

Simple, modular unofficial/community composed Dune Echo client with minimal external dependencies and Bun as package manager and javascript runtime. Intended for rapid blockchain data extractions and pipeline interfacing.

[Dune Echo Documentation](https://docs.dune.com/echo/overview)

> [!WARNING]
> Code is very nascent and highly subject to change/upgrades.
> Test cases are currently a work in progress, considering database interfacing and serverless proxy. Simultaneous multi-address inputs are not included in this repository to support Dune analytics [rate-limits](https://docs.dune.com/api-reference/overview/rate-limits)

## Table of Contents

- [features](#features)
- [dependencies](#dependencies)
- [structure](#structure)
- [usage](#usage)
- [contributing](#contributing)

## features

- Rapid blockchain data extraction
- Modular design for ease of extension
- Minimal external dependencies
- Integration with Dune Analytics via API

## dependencies

required dependencies

- Bun Runtime/Package Manager [Bun Documentation](https://bun.sh/docs/typescript)
- Zod [Zod Package Link](https://www.npmjs.com/package/zod)
- Pino [Pino Package Link](https://www.npmjs.com/package/pino)
- Pino-Pretty [Pino-Pretty Package Link](https://www.npmjs.com/package/pino-pretty)

install all dependencies

```sh
bun install
```

install dependencies independently

```sh
bun add zod pino pino-pretty
```

developer dependencies

```sh
bun add -d @types/bun
```

## structure

```
echo-client/
├── src/
│ ├── config/
│ │ ├── environment.config.ts
│ │ └── chains.config.ts
│ ├── schemas/
│ │ ├── chain.schema.ts
│ │ └── command.schema.ts
│ ├── types/
│ │ ├── api.types.ts
│ │ └── command.types.ts
│ ├── utils/
│ │ ├── logger.ts
│ │ └── filters.ts
│ ├── services/
│ │ └── dune.service.ts
│ └── index.ts
├── .env (DO NOT COMMIT - PRIVATE)
├── .env.example
├── .gitignore
├── dprint.json (optional - formatting)
├── package.json
├── readme.md
└── tsconfig.json
```

## usage

To utilize, copy `.env.example` to `.env` and input your respective DUNE_ECHO_API key value, keep this value private as it is a credential tied to your respective Dune Analytics accounts. If uncertain how to get a DUNE_ECHO_API key value, please refer to the [official documentation here](https://docs.dune.com/api-reference/overview/authentication#generate-an-api-key)

### examples

evm example

```sh
bun run src/index.ts 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 --type evm-transactions --chain ethereum --start-date 2025-02-22
```

evm_output example

```json
{
  "chain": "ethereum",
  "chain_id": 1,
  "address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "block_time": "2025-02-23T02:09:59+00:00",
  "block_number": 21905955,
  "index": 120,
  "hash": "0xe97d250544c31bcb37d2fc620faf2bbf81ada301840e7608a5705fbb71bee04f",
  "block_hash": "0x35efc9bebe572bca214f1bbb1fdb00f1075d1e072409eac6fa904c00d0e63a83",
  "value": "0x0",
  "transaction_type": "Receiver",
  "from": "0x9ed7bef41948467152b1dbbe3ce5bc044c961953",
  "to": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "nonce": "0x1",
  "gas_price": "0x40070d89",
  "gas_used": "0x5208",
  "effective_gas_price": "0x40070d89",
  "success": true,
  "data": "0x",
  "logs": []
}
```

### generate llm.txt

```sh
repomix --style plain -o llm.txt --no-file-summary --no-directory-structure --verbose
```

## contributing

Contributions are welcome! Please fork the repository and submit your pull requests. For major changes, open an issue first to discuss what you would like to change. Ensure your code adheres to the existing style and passes all tests.

## changelog

### license

licensed under the MIT License

#### liability disclaimer

echo-client is provided "as is" without any warranties or guarantees.
We do not take responsibility for how the generated output is used, including but not limited to its accuracy, legality, or any potential consequences arising from its use. Please adhere to all Dune Analytics [terms of use](https://dune.com/terms) and policies.
