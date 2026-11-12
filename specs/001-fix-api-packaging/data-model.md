# Data Model

This remediation introduces no entities, fields, migrations, or persisted data changes.

The quote flow continues reading existing countries, currencies, measures, and products through the existing PostgreSQL pool. The prior `products.image_url` updates are outside this implementation and remain unchanged.
