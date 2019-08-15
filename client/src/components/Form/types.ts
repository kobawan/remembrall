type FormElements = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type OnChangeFn = (e: React.ChangeEvent<FormElements>) => void;

export interface RowProps {
  name: string;
  value: string;
  onChange: OnChangeFn;
}
