# MyZubster Platform

Platform-services track in the MyZubster ecosystem.

## Status

**Development / consolidation track.** This repository contains platform-era code and should be aligned with the canonical contracts in the main `myzubster` repository before a component is treated as a production source of truth.

## Role

Use this repository for platform-specific services or legacy/platform modules that are not yet consolidated into the current core repository.

The canonical ecosystem map is maintained here:

- [Ecosystem Architecture](https://github.com/MyZubster-Ecosystem/myzubster/blob/main/docs/ECOSYSTEM.md)

## Bounties

Platform work may be bountied through GitHub issues when objective, acceptance criteria, evidence and reward terms are explicit.

- [Canonical Bounty System](https://github.com/MyZubster-Ecosystem/myzubster/blob/main/BOUNTIES.md)

MYZ in the current core platform is an internal reward/accounting ledger. A merged PR or issue closure does not prove an external payment.

See `BOUNTIES.md` for local scope.

## Development

Inspect the current project manifests/source tree for the authoritative setup. Do not copy production secrets into `.env` files committed to Git.

Before reusing a platform module in the current core:

1. identify overlapping functionality in `myzubster`;
2. document the source-of-truth decision;
3. add/port tests;
4. verify authentication/authorization boundaries;
5. update architecture documentation.

## Security

Do not commit tokens, passwords, wallet seeds, private keys or production infrastructure credentials.

## Related repositories

- [myzubster](https://github.com/MyZubster-Ecosystem/myzubster) — current core/canonical contracts
- [MyZubsterGateway](https://github.com/MyZubster-Ecosystem/MyZubsterGateway) — integration boundary
- [myzubster-docs](https://github.com/MyZubster-Ecosystem/myzubster-docs) — documentation hub
