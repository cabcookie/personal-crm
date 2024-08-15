# Notizen in separaten Blöcken speichern (Version :VERSION)

- Datenbankschema angepasst, so dass Blöcke separat gespeichert werden können.
- Den Mechanismus für offene Aufgaben haben wir zunächst einmal komplett entfernt:
  - ContextOpenTasks löschen
  - useDailyPlans löschen
  - Task löschen
  - page /planday löschen
  - page /today löschen
  - DailyPlanComponent löschen
  - DailyPlanningPage löschen
  - getTasksByActivities löschen
  - getTaskByIndex löschen
  - getTasksData löschen
  - getAllTasks löschen
  - MeetingNextActions löschen
  - MakeTaskDecision löschen
  - ReviewProjectForDailyPlanning löschen
  - NextAction löschen
  - getEditorContentAndTaskData löschen
- Auch bei Inbox Items haben wir den Task Mechanismus entfernt.

## In Arbeit

- Wenn ich eine bestehende Notiz bearbeite, wird diese nun in der neuen Version 3 für das Notizenformat gespeichert. Das bedeutet, dass die einzelnen Blöcke der Notizen in unabhängigen Einträgen in der Datenbank landen.

## Geplant

- Sicherstellen, dass die Inbox funktioniert und Einträge in Activity übertragen werden können.
- Sicherstellen, dass wieder Todos erzeugt werden können und in diversen Ansichten angezeigt werden können (offene Aufgaben aus Meetings und in Projekten).
- In `meeting-activity-list.tsx` wieder die Task Badges einfügen:

```jsx
<DefaultAccordionItem
  value={a.id}
  key={a.id}
  triggerTitle={getProjectNamesByIds(a.projectIds)}
  badge={
    <TaskBadge
      hasOpenTasks={a.hasOpenTasks}
      hasClosedTasks={!!a.closedTasks?.length}
    />
  }
  triggerSubTitle={`Next actions: ${flow(
    map(getTextFromEditorJsonContent),
    join(", ")
  )(a.openTasks)}`}
>
```

- `meeting-next-actions.tsx` wieder herstellen:

```jsx
const MeetingNextActions: FC<MeetingNextActionsProps> = ({ meeting }) => {
  const [tasks] = useState(getTasksByActivities(meeting.activities));

  const getTasksText = ({ task }: OpenTask) =>
    getTextFromEditorJsonContent(task).trim();

  return (
    tasks.length > 0 && (
      <DefaultAccordionItem
        value="next-actions"
        triggerTitle="Agreed Next Actions"
        triggerSubTitle={tasks.map(getTasksText)}
      >
        <Accordion type="single" collapsible>
          {tasks.map((task) => (
            <NextAction
              key={`${task.activityId}-${task.index}`}
              openTask={task}
            />
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};
```

- Im NavigationMenu die Einträge für Daily Planning und Today's Tasks wieder herstellen.
- In `ProjectAccordionItem.tsx` den Task Badge wieder einführen:

```jsx
<DefaultAccordionItem
  badge={project.crmProjects.some(hasHygieneIssues) ? (
    <HygieneIssueBadge />
  ) : (
    <TaskBadge
      hasOpenTasks={openTasksByProjectId(project.id).length > 0}
      hasClosedTasks={false}
    />
  )}
>
```

- Teilnehmer und Notizen in Zwischenablage kopieren, um schneller ins Quip oder Slack zu kopieren oder eine Email zu verfassen.
