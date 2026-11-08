export const EXCEL_CHECKPOINT_INTERVAL = 250;

export type ExcelCheckpointStatus = {
  completedCount: number;
  updatedAt: string | null;
  lastError: string | null;
};

export function getExcelCheckpointTarget(completedCount: number, totalCount: number): number {
  if (completedCount === totalCount) return completedCount;
  return Math.floor(completedCount / EXCEL_CHECKPOINT_INTERVAL) * EXCEL_CHECKPOINT_INTERVAL;
}

export function isSuccessfulNewExcelCheckpoint(
  previousCount: number,
  checkpoint: { completedCount: number; lastError: string | null },
): boolean {
  return checkpoint.completedCount > previousCount && !checkpoint.lastError;
}
