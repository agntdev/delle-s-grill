# Delle's Grill Logo Design Workflow — Bot specification

**Archetype:** custom

**Voice:** professional and concise — write every user-facing message, button label, error, and empty state in this voice.

A design coordination bot that manages 3D logo creation, versioning, and asset delivery for Delle's Grill branding. Handles design specifications, format conversions, and usage guidelines for multi-channel deployment.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- local barbecue customers
- catering clients
- branding designers

## Success criteria

- deliverable asset package with 7+ format variations
- versioned source files for future edits
- usage documentation with placement rules

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open logo design workflow menu
- **Submit Design Specs** (button, actor: user, callback: design:specs) — Provide text/visual requirements for logo
  - inputs: typography preferences, icon style notes
  - outputs: design confirmation
- **Request Format Conversion** (button, actor: user, callback: assets:convert) — Generate specific file formats
  - inputs: format type, resolution
  - outputs: download link

## Flows

### Design Onboarding
_Trigger:_ /start

1. present style guide options
2. collect core design parameters
3. generate initial mockups

_Data touched:_ design_specs

### Asset Delivery
_Trigger:_ design:specs

1. validate format requirements
2. package deliverables
3. email asset bundle

_Data touched:_ deliverables

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **design_specs** _(retention: persistent)_ — Core logo requirements and style parameters
  - fields: typography, icon_style, color_palette
- **deliverables** _(retention: persistent)_ — Generated asset files and metadata
  - fields: file_format, resolution, version_number

## Integrations

- **Telegram** (required) — Bot API messaging
- **Email** (required) — Asset handoff delivery
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- design parameter validation rules
- asset versioning policy
- format conversion templates

## Notifications

- Asset package ready for download
- Design spec confirmation needed
- Format request completion status

## Permissions & privacy

- Secure storage of source design files
- Access control for asset downloads
- Usage analytics opt-in

## Edge cases

- Missing design specifications
- Unsupported file format requests
- Version conflict resolution

## Required tests

- End-to-end asset delivery workflow test
- Format conversion accuracy check
- Design parameter validation test

## Assumptions

- Standard color palette used if none specified
- Default typography applied when no preference given
- Basic icon style generated for initial mockup
