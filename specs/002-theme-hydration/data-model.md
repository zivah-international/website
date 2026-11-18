# Data Model: Theme Initialization Without Hydration Errors

No database entities, API contracts, or server-side persistence are added or changed.

The existing browser preference remains:

| Value | Meaning | Fallback behavior |
| --- | --- | --- |
| `light` | Explicit light preference | Apply light theme |
| `dark` | Explicit dark preference | Apply dark theme |
| `system` or missing/invalid value | Follow device preference | Resolve from `prefers-color-scheme` |

The existing storage key is `theme`. If browser storage is unavailable, initialization falls back to the system preference and the page remains usable.
