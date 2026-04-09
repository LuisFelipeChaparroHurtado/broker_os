export type CellType =
  | 'text'
  | 'mono'       // monospace (precios, cantidades)
  | 'positive'   // verde
  | 'negative'   // rojo
  | 'mint'       // mint
  | 'badge-buy'
  | 'badge-sell'
  | 'badge-pending'
  | 'badge-active'
  | 'template';  // usa templateRef personalizado

export interface ColumnDef<T = any> {
  key:       keyof T & string;
  header:    string;
  type?:     CellType;
  sortable?: boolean;
  width?:    string;       // e.g. '120px'
  align?:    'left' | 'center' | 'right';
}

export interface RowAction {
  action: string;
  label:  string;
  icon?:  string;
  danger?: boolean;
}

export interface TableConfig<T = any> {
  columns:      ColumnDef<T>[];
  rowActions?:  RowAction[];
  trackBy:      keyof T & string;
  emptyTitle?:  string;
  emptyMessage?: string;
}

export interface SortState {
  column:    string;
  direction: 'asc' | 'desc';
}

export interface PageEvent {
  page:  number;
  size:  number;
}
