export type OnChangeFn = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

export interface RowProps {
	name: string;
	value: string;
	onChange: OnChangeFn;
}
