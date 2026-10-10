# .nxs-personas

Who your agents are, and where they talk. nexus-chat reads this folder — nothing writes it but you.

## One folder per persona: `<name>/SKILL.md`

```markdown
---
name: coder
description: Builds what the work order asks for, and says so when it cannot.
nxs:
  title: Implementer
---
You implement one task at a time and report back in the thread you were asked in.
```

A persona is a skill in the form of the Agent Skills specification: a skill folder you found
elsewhere works when you copy it in. Address it with `nxc send --to coder -`, with the request on
STDIN — `… - <<'EOF'`, your text, then `EOF` on its own line — so the shell evaluates nothing in
it. A one-liner may be an argument instead.

## One file per channel: `channels/<name>.yaml`

```yaml
name: review
members: [coder, reviewer]
timeout: 30m
```

Address it with `nxc send --to review -`, the same way. A channel may also declare `steps:` — its
members in order — and then a send walks that order step by step.

The older forms, `<handle>.yaml` and a `channels.yaml` list, are still read;
`nxs personas migrate` rewrites them. `nxc guide personas` has every field.

## Nothing is declared until it is in here

There are no built-in personas and no ad-hoc targets: `nxc send --to` reaches what this folder
declares, and nothing else. That is the point — a target that is declared is readable, reviewable,
and survives the run.
