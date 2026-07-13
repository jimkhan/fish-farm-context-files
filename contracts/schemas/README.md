# contracts/schemas/

The **authoritative** shared entity + DTO schemas live in `../openapi.yaml` under
`components/schemas` (single source, avoids drift — ADR-003). This folder exists for cases where a
schema must be referenced as a standalone JSON Schema file by a code generator or a non-HTTP
consumer.

## Rules
- Do **not** duplicate a schema here that already exists in `openapi.yaml` unless a tool requires a
  standalone file; if you do, it must be generated from (and kept in sync with) `openapi.yaml`.
- Any new entity/schema is added to `openapi.yaml` first, then (if needed) mirrored here.
- Every schema maps to a canonical entity in `../../GLOSSARY.md §2` and uses the exact enum tokens
  in `GLOSSARY.md §4`.
- Changing a shared schema is a **Phase-7 guardrail** (it affects all surfaces): stop and ask a
  human, update the contract, then regenerate clients + backend impl.

## Canonical schemas currently defined (in openapi.yaml)
Error, Money, enums (Role, ProjectStatus, BatchStatus, WaterParameter, WaterSource, FeedType,
FeedObservation, TaskStatus, HarvestGrade, AlertType, AlertSeverity, AlertState, Channel, Ritu,
FinancialKind), User, Membership, Project, Pond, Batch, BiomassOverview, FeedPlan, FeedingLog,
Mortality, Sampling, Harvest, InventoryItem, InventoryTxn, WaterReading, WaterThreshold,
SensorReading, Task, TaskLog, FinancialTxn, FinanceSummary, CameraConfig, WeatherSnapshot, Alert,
SyncRequest, SyncResponse, DailySummary, BanglaDate (+ their Create/Update request variants).
