# Tagespläne nach neuer Methodik abfragen (Version :VERSION)

## Neue Funktionen und Änderungen

Datensätze in der Datenbank wurden bisher mit einer ID erzeugt. Hier ein Beispiel:

```typescript
const newDayPlan: DayPlan = {
  id: crypto.randomUUID(),
  day,
  dayGoal,
  done: false,
};
const { data, errors } = await client.models.DayPlan.create({
  ...newDayPlan,
  context,
});
```

Das führte zu Fehlern und haben wir gefixt.

Wir haben die Amplify Packages auf die neueste Version aktualisiert und mussten das Datenschema entsprechend aktualisieren.

- `"@aws-amplify/backend": "^0.13.0"`
- `"@aws-amplify/backend-cli": "^0.12.0"`

## Detaillierte Änderungen

### Bug Fixes

#### api

- never force an ID for a new record [35d4256](https://github.com/cabcookie/personal-crm/commit/35d4256eb0379a3f874ddc6f360d826f21046b2f)
