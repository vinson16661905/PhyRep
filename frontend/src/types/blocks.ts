export type BlockType = "text" | "table" | "formula" | "image" | "calculation";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  heading?: string;
  content: string;
}

export type TableAnalysisType = "successive_difference" | "least_squares" | "uncertainty_single_set";

export interface TableAnalysis {
  type: TableAnalysisType;
  label?: string;
  params: Record<string, unknown>;
}

export interface TableBlock extends BaseBlock {
  type: "table";
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
  analysis?: TableAnalysis[];
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  caption?: string;
  url: string;
  width?: string;
}

export interface FormulaBlock extends BaseBlock {
  type: "formula";
  latex: string;
  caption?: string;
}

export type CalculationMethod =
  | "propagation"
  | "logarithmic";

export interface CalculationBlock extends BaseBlock {
  type: "calculation";
  label: string;
  method: CalculationMethod;
  payload: Record<string, unknown>;
  notes?: string;
}

export type Block = TextBlock | TableBlock | ImageBlock | FormulaBlock | CalculationBlock;

export interface ReportMeta {
  experiment: string;
  student: string;
  student_id: string;
  date: string;
}
