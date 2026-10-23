# Global Rules for AI Agents

## Purpose

These rules apply to every AI agent working in this repository. Agents must evaluate the request, select the appropriate workflow and skills, preserve scope, verify results, and leave enough evidence for another agent to continue.

## Order of Precedence

1. The user's latest direct instruction.
2. Safety rules, permissions, and execution-environment limits.
3. A product specification or document approved by the user.
4. An accepted sprint contract.
5. This file.
6. Instructions from the selected skill.
7. Existing repository conventions.

If two sources at the same level conflict, stop the affected work and ask the user to decide. Do not choose an interpretation that materially changes scope, data, architecture, or product behavior.

## Evaluate the Request Before Acting

Before editing files, determine:

- Request type: question, investigation, planning, contract creation, implementation, bug fix, review/QA, or handoff.
- Actual user goal and required deliverable.
- Included and excluded scope.
- Whether acceptance criteria exist and are observable or testable.
- Size: number of steps, files or areas, sessions, and agents likely required.
- Risk: security, data loss, destructive actions, migrations, compatibility, cost, or production impact.
- Clarity of the request and repository context.
- Which artifact is the source of truth.

Use the smallest workflow that adequately controls the work. Do not skip planning or independent review when complexity or risk requires them.

## Cross-Agent Skill Standard

Refer to skills by canonical name, never by a local installation path, vendor prefix, slash command, or platform-specific invocation:

- `planner`
- `sprint-contract`
- `generator`
- `evaluator`
- `handoff`
- `multi-agent-dev-workflow` — optional lifecycle wrapper when supported

Skill resolution rules:

1. If the agent has a global skill with the canonical name, use it.
2. If the platform provides skill discovery or a registry, search by canonical name first.
3. If the platform adds a namespace or custom invocation syntax, map it to the same canonical name. A namespace must not change the role or contract.
4. Do not assume skills exist inside the repository's `skills/` directory.
5. Do not hard-code global installation paths; locations differ across Codex, Claude Code, OpenCode, Antigravity, and other agents.
6. If a skill is unavailable or unreadable, follow the role contract in this file and briefly disclose that fallback.
7. Global skills provide detailed procedures. This file provides shared policy and skill-selection rules. Resolve conflicts using the precedence rules above.

Artifact names, states, approval gates, and PASS/FAIL meanings must remain consistent across agents regardless of invocation syntax.

Select the minimum skill set:

- One phase only: invoke the matching role skill directly.
- Multiple phases or full-lifecycle coordination: use `multi-agent-dev-workflow`, then load only the role skill needed for the current phase.
- Do not load every skill when only one is needed.
- Before acting, briefly state which skill was selected and why.

## Skill Selection

### No Role Skill

Handle directly when:

- answering or explaining without changing the repository;
- performing read-only investigation or diagnosis;
- making a tiny, clear, low-risk edit with obvious acceptance criteria.

For small edits, still inspect relevant context, make the minimum change, and run an appropriate check.

### `planner`

Use when:

- the request is short, ambiguous, or has several valid interpretations;
- building a large feature, application, workflow, or documentation set;
- product intent, scope, milestones, non-functional requirements, or exclusions must be defined;
- work spans multiple phases, files, or sessions and has no approved specification.

Planner creates or updates a product specification only. It does not implement. The specification becomes authoritative only after user approval.

### `sprint-contract`

Use when:

- an approved specification exists and one implementation phase must be prepared;
- testable acceptance criteria are needed;
- task breakdown, file guidance, or coding guardrails are needed;
- multiple agents or models will exchange the work;
- implementation size or risk requires defining “done” before coding.

Do not implement while the contract is `Proposed` or `Needs revision`. Generator may implement after the contract is `Accepted`, unless the user explicitly waives this gate and accepts the risk.

### `generator`

Use when:

- the user requests creation or modification of a concrete artifact;
- complex work has an approved specification or accepted sprint contract;
- acceptance criteria are clear enough to execute.

Generator must follow the task breakdown, file guidance, and guardrails; self-verify; and create an implementation handoff for non-trivial work. It must not expand scope or perform unrelated refactoring.

Do not invoke `generator` only to force process around a tiny, low-risk edit. Handle such edits directly and report the result in chat without creating a handoff file.

### `evaluator`

Use when:

- the user requests review, QA, validation, or a readiness decision;
- Generator has completed a handoff;
- changes have user-facing behavior, several acceptance criteria, or meaningful risk;
- a PASS, FAIL, or NEEDS FIX decision is required.

Evaluator must inspect the real output and must not rely only on a handoff or self-report. A review-only request does not authorize code changes unless the user also requests fixes.

### `handoff`

Use when:

- changing roles or agents;
- ending a long phase or session;
- work is blocked or has remaining steps;
- context must survive compaction or reset;
- Generator transfers work to Evaluator, or Evaluator returns fixes to Generator.

A handoff does not replace tests, source code, contracts, or evaluator reports.

## Default Workflow Matrix

| Request | Minimum workflow |
| --- | --- |
| Question or explanation | Direct |
| Read-only investigation or diagnosis | Direct inspection |
| Tiny, clear, low-risk edit | Direct implementation + verification |
| Small bug with known cause and scope | `generator` + verification |
| Bug with unknown cause | Diagnose first; use `generator` only when the user requests a fix |
| Medium feature with clear scope | `sprint-contract` if criteria are missing → `generator` → `evaluator` |
| Large or ambiguous feature | `planner` → human approval → `sprint-contract` → acceptance → `generator` → `evaluator` |
| Security, migration, destructive, or production-critical work | `planner` or `sprint-contract` as appropriate → explicit approval when required → `generator` → independent `evaluator` |
| Review or QA | `evaluator` |
| Review and fix | `evaluator` → `generator` fix pass → `evaluator` re-check |
| Agent or session transfer | `handoff` |

## General Implementation Rules

1. Read relevant instructions and source-of-truth artifacts before acting.
2. Inspect existing code or artifacts and follow local conventions.
3. Preserve user changes and dirty worktrees.
4. Edit only necessary and authorized files or areas.
5. Do not add features, dependencies, abstractions, or refactors outside scope.
6. Do not perform destructive actions, production changes, publishing, pushing, merging, or external data transmission without user authorization.
7. For minor ambiguity, choose the lowest-risk assumption and state it. Ask the user when ambiguity materially changes the result.
8. Execute tasks in dependency order and do not skip task-breakdown items.
9. Run tests and checks proportional to risk. If a check cannot run, state why.
10. Do not hide errors, failing tests, untested areas, blockers, or risks.
11. Do not claim completion without evidence.
12. End with a clear state: complete, needs review, needs fix, blocked, or needs user decision.

## Evaluation Rules

Evaluate implementation requests and results against:

- Correctness: required user behavior works.
- Scope fit: core scope is complete and excluded scope was not added.
- Acceptance evidence: every criterion has a check or evidence.
- Regression risk: existing behavior remains functional.
- Maintainability: code or content follows conventions and avoids unnecessary abstraction.
- Security and safety: no secret exposure, unsafe destruction, or excessive permissions.
- Usability and UX: test real workflows when a user interface exists.
- File and guardrail compliance: protected areas were not changed without approval.
- Verification quality: checks match the risk and untested areas are explicit.

If a core criterion fails, the result cannot be PASS. Plausible-looking output without evidence is not complete.

## Standard Artifacts and States

- Product specification: default `plans/`; state `Draft pending review` or approved.
- Sprint contract: default `plans/`; state `Proposed`, `Accepted`, or `Needs revision`.
- Implementation or fix handoff: default `handoffs/<task-slug>-implementation.md` or `handoffs/<task-slug>-fix.md`; state `Ready for evaluator`, `Blocked`, or `Needs user decision`.
- Evaluator or final report: default `reports/`; verdict `PASS`, `FAIL`, or `NEEDS FIX`.

If the source task specifies another location, use the source task's location.

Artifact hygiene:

- Do not create handoff files for direct answers, read-only investigation, or tiny low-risk edits.
- Never place generated handoffs in the repository root unless the user explicitly requests it.
- Reuse or update the current task's handoff instead of creating duplicate generic files.
- Use a stable task slug. Add a sprint or phase identifier only when needed to avoid collisions.
- Keep generated artifacts inside `plans/`, `handoffs/`, or `reports/`.

## Completion Criteria

A request is complete only when:

- the deliverable exists and matches scope;
- relevant acceptance criteria were checked;
- appropriate tests or checks ran, or the reason they could not run is documented;
- no known core-scope defect remains;
- changed files and risks are reported;
- every artifact required by the selected skill exists;
- any remaining next step is explicit.
