export type SearchTab = "advance" | "rma" | "production";

export type ResultSection = {
  title: string;
  columns: string[];
  rows: string[][];
};

export type SearchTabConfig = {
  key: SearchTab;
  label: string;
};
