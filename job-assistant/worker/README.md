# Local Worker

Run browser automation locally to reduce cloud cost.

## Current status
- processes queued approved drafts
- supports Greenhouse and Lever URLs
- opens the application page with Playwright
- fills common fields from `data/profile.json`
- attempts resume upload using tailored resume artifacts or `resumePath`
- saves screenshot and worker logs in `data/`

## Planned next steps
- improve field mapping for Greenhouse/Lever custom questions
- add stronger portal-specific pause/resume behavior
- add resume variant selection per draft

## Initial command
npm run worker
