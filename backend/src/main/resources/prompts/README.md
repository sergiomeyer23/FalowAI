# Falow prompt versions

Prompts are versioned assets, not string literals scattered through services.

Current vertical slice:

- `tutor/speaking-evaluation-v1.txt`
- `feedback/exercise-feedback-v1.txt`

Every prompt should receive a compact student context selected by `StudentContextSelector`, not the full database.
