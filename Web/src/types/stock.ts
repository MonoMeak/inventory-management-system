export type MovementType = "IN" | "OUT";

export interface StockMovement {
  id?: number;
  movementType: MovementType;
  quantity: number;
  reason?: string;
}
