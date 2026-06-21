export type DataType = 'BOOL' | 'INT';

export interface Variable {
  id: string;
  name: string;
  type: DataType | null;
  defaultValue: string;
  comment: string;
}
