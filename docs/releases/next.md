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

Beim Laden der Tagespläne laden wir die Aufgaben gleich mit. Dadurch sparen wir uns einige der API Aufrufe und die Anwendung wird performanter. Außerdem versuchen wir Aufgaben in der neuen Tabelle `DayPlanTodo` zu konsolidieren. Wir bieten dem Anwender dafür an, bestehende Aufgaben in `DayPlanTodo` zu migrieren.

## Detaillierte Änderungen

### Feature

#### deps

- upgrade backend and schema accordingly [862b6b0](https://github.com/cabcookie/personal-crm/commit/862b6b061161cb00843947ce8830fe629a6ef1e9)

### Bug Fixes

#### api

- never force an ID for a new record [35d4256](https://github.com/cabcookie/personal-crm/commit/35d4256eb0379a3f874ddc6f360d826f21046b2f)
