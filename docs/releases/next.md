# Fix: Datensätze in der Datenbank dürfen nicht mit einer ID angelegt werden (Version :VERSION)

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

Das führte zu Fehlern.

## Detaillierte Änderungen

### Bug Fixes

#### api

- never force an ID for a new record [35d4256](https://github.com/cabcookie/personal-crm/commit/35d4256eb0379a3f874ddc6f360d826f21046b2f)
