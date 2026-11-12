# Feature Specification: Restore Production API Runtime Dependencies

**Feature Branch**: `001-fix-api-packaging`

**Created**: 2026-11-12

**Status**: Emergency remediation implemented; production confirmation pending release

**Input**: The quote form works locally, but production requests for its lookup data fail with empty errors.

## User Scenarios & Testing

### User Story 1 - Complete a quote request (Priority: P1)

A prospective buyer opens the quote form and can load destination countries, measurement units, and product options so they can submit a quote request.

**Why this priority**: The production failure blocks the primary inquiry flow and prevents buyers from sending quote requests.

**Independent Test**: Open the production quote page and confirm its choices load; confirm the affected production requests return useful results or controlled errors rather than blank failures.

**Acceptance Scenarios**:

1. **Given** the production database is reachable, **When** a visitor opens the quote page, **Then** destination countries, units, and products load successfully.
2. **Given** the production data source is temporarily unavailable, **When** a visitor requests quote choices, **Then** the visitor receives a controlled error instead of a blank failure.

### Edge Cases

- If the data source is temporarily unavailable, the visitor receives a controlled error instead of a blank failure.

## Requirements

### Functional Requirements

- **FR-001**: The production quote flow MUST load its required lookup data when the configured database is available.
- **FR-002**: Production requests for quote and catalog data MUST preserve the site's existing response behavior.
- **FR-003**: Visitors MUST continue to receive quote choices after production releases.
- **FR-004**: This remediation MUST preserve the existing database schema, data, credentials, and API response shapes.

### Key Entities

- **Quote lookup data**: Existing countries, currencies, measures, and product records read by the quote flow. This change introduces no data model or database changes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The production quote form loads countries, measures, and product choices without a blank failure.
- **SC-002**: 100% of production requests that support quote choices return usable data or a controlled error, with zero blank failures.
- **SC-003**: At least one prospective buyer can complete the quote flow in production after the release.

## Assumptions

- The cPanel database endpoint and credentials remain configured by the site owner; this remediation does not change them.
- The production data source remains available and configured as before.
- Existing quote behavior and stored data remain unchanged.
