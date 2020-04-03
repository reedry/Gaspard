export type StateName = "Menu" | "Flashcard" | "Result";

export type ColumnNumbers = {
  entry: number;
  check: number;
  front: number;
  back: number;
};

export type ColumnArrays = {
  categories: number[];
  notes: number[];
};

export type Columns = ColumnNumbers & ColumnArrays;
