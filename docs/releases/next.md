# Stabilität von Tagesplänen und Projekten erhöhen (Version :VERSION)

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

Die Projekte laden wir nun über einen Kontext, der der ganzen Anwendung zur Verfügung steht. Dadurch reduzieren wir API Aufrufe und Ladezeiten.

In der Projektdetailansicht sortieren wir die Aktivitäten nun schon beim Abruf aus der Datenbank nach dem Datum absteigend. Wir können dort nun auch die eigenen nächsten Aktivitäten festhalten als auch die anderer.
