import { DataType } from './type';

export const DATA_TYPE_OPTIONS = [
  { value: 'BOOL' as DataType, label: 'BOOL' },
  { value: 'INT' as DataType, label: 'INT' },
];

export const DefaultValueMap: Record<DataType, string> = {
  BOOL: 'TRUE',
  INT: '0',
};

export const BOOL_VALUES = ['true', 'false', 'TRUE', 'FALSE'];
export const INT_MIN = -2147483648;
export const INT_MAX = 2147483647;
