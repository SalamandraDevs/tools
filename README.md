# Salamandra Devs Community Platform Tools

`@slmdevs/tools` is the shared utility package for the Salamandra Devs Community
Platform. It collects small browser-safe, shared, and Node-specific helpers used by services
and libraries across the platform.

The package stays intentionally modest: it holds reusable mechanics that are useful across
repositories without taking ownership of application policy.

## What It Provides

- `CustomError` and shared error names for deliberate application error classification.
- A normalized `makeApiRequest` helper for fetch-based service and third-party calls.
- Type guards for common runtime checks.
- Zod-to-Mongo schema conversion support for dataset provisioning.
- A temporary MySQL schema conversion placeholder used by the current Core provisioning path.
- Node crypto helpers for JWT signing input construction and timing-safe hash comparison.

## Project Shape

The package exports shared utilities from `@slmdevs/tools/shared` and Node-only helpers from
`@slmdevs/tools/node`. The separation keeps browser-compatible code clear while allowing
server packages to use Node crypto utilities where appropriate.

`@slmdevs/core` and `@slmdevs/auth` use Tools for structured errors, schema conversion, API
request normalization, and security-sensitive comparisons.

## Development

```sh
pnpm install
pnpm run check
pnpm run build
```

## Community

This repository is part of the Salamandra Devs Community Platform, a community-developed
effort led by Salamandra Devs and its contributors. Join us on Telegram at
<https://t.me/salamandradevs> to learn, build, ask questions, and have a good time
contributing.

## License

Licensed under the GNU Lesser General Public License v3.0 or later. See
[LICENSE.md](./LICENSE.md).
