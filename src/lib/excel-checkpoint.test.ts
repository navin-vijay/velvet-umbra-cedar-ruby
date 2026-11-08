import assert from "node:assert/strict";
import test from "node:test";
import {
  EXCEL_CHECKPOINT_INTERVAL,
  getExcelCheckpointTarget,
  isSuccessfulNewExcelCheckpoint,
} from "./excel-checkpoint.ts";

test("creates checkpoints at each 250 completed-page mark", () => {
  assert.equal(EXCEL_CHECKPOINT_INTERVAL, 250);
  assert.equal(getExcelCheckpointTarget(249, 1000), 0);
  assert.equal(getExcelCheckpointTarget(250, 1000), 250);
  assert.equal(getExcelCheckpointTarget(499, 1000), 250);
  assert.equal(getExcelCheckpointTarget(500, 1000), 500);
});

test("preserves the final checkpoint when extraction completes between marks", () => {
  assert.equal(getExcelCheckpointTarget(731, 731), 731);
});

test("downloads only a newly created checkpoint without a checkpoint error", () => {
  assert.equal(
    isSuccessfulNewExcelCheckpoint(250, { completedCount: 250, lastError: null }),
    false,
  );
  assert.equal(isSuccessfulNewExcelCheckpoint(250, { completedCount: 500, lastError: null }), true);
  assert.equal(
    isSuccessfulNewExcelCheckpoint(250, {
      completedCount: 500,
      lastError: "Workbook could not be generated.",
    }),
    false,
  );
});
