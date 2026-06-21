import React, { useState, useCallback, useMemo } from 'react';
import { Button, Table, TableColumnProps, Message } from '@arco-design/web-react';
import { useVariablesStore, VariablesStoreProvider } from './store';
import { Variable, DataType } from './type';
import { TextEditorCell } from './components/TextEditorCell';
import { SelectEditorCell } from './components/SelectEditorCell';
import { DATA_TYPE_OPTIONS, BOOL_VALUES, INT_MIN, INT_MAX, DefaultValueMap } from './const';
import './styles.less';
import { useStore } from 'zustand';

const VarEditorTableInternal: React.FC = () => {
  const { variables, addVariable, updateVariable, deleteVariable } = useVariablesStore();
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

  const showError = useCallback((message: string) => {
    Message.error(message);
  }, []);

  const handleAddRow = useCallback(() => {
    const maxId = variables.length > 0
      ? Math.max(...variables.map(v => parseInt(v.id)))
      : 0;
    addVariable({
      id: (maxId + 1).toString(),
      name: '',
      type: null,
      defaultValue: '',
      comment: '',
    });
  }, [variables.length, addVariable]);

  const handleDeleteRow = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      showError('Please select a row to delete');
      return;
    }
    deleteVariable(selectedRowKeys.map(id => id.toString()));
    setSelectedRowKeys([]);
  }, [selectedRowKeys, deleteVariable, showError]);

  const handleNameChange = useCallback((variable: Variable, value: string) => {
    if (!variable) return;

    if (!value.trim()) {
      showError('Name cannot be empty');
      return;
    }

    updateVariable(variable.id, { name: value });
  }, [updateVariable, showError]);

  const handleTypeChange = useCallback((variable: Variable, value: DataType) => {
    if (!variable) return;

    const newDefaultValue = DefaultValueMap[value];
    updateVariable(variable.id, { type: value, defaultValue: newDefaultValue });
  }, [updateVariable]);

  const handleDefaultValueChange = useCallback((variable: Variable, value: string) => {
    if (!variable) return;

    if (variable.type === 'BOOL') {
      if (!BOOL_VALUES.includes(value)) {
        showError('Invalid BOOL value. Only true/false allowed');
        return;
      }
      updateVariable(variable.id, { defaultValue: value.toUpperCase() });
    } else {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) {
        showError('Invalid INT value. Must be an integer');
        return;
      }
      if (numValue < INT_MIN || numValue > INT_MAX) {
        showError(`INT value must be between ${INT_MIN} and ${INT_MAX}`);
        return;
      }
      updateVariable(variable.id, { defaultValue: value });
    }
  }, [updateVariable, showError]);

  const handleCommentChange = useCallback((variable: Variable, value: string) => {
    if (!variable) return;
    updateVariable(variable.id, { comment: value });
  }, [updateVariable]);

  const columns: TableColumnProps<Variable>[] = [
    {
      title: 'Index',
      dataIndex: 'index',
      width: 80,
      render: (_: string, __: Variable, index: number) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
      render: (name: string, record: Variable) => {
        const validate = (value: string): string | null => {
          const existingNames = variables
            .filter(v => v.id !== record.id)
            .map(v => v.name);
          if (existingNames.some(n => n.toLowerCase() === value.toLowerCase())) {
            return 'Name already exists';
          }
          if (!value?.trim()) {
            return 'Name cannot be empty';
          }
          return null;
        };

        return (
          <TextEditorCell
            value={name}
            defaultEditing={!name}
            onChange={(value) => handleNameChange(record, value)}
            validate={validate}
          />
        );
      },
    },
    {
      title: 'DataType',
      dataIndex: 'type',
      width: 120,
      render: (type: DataType, record: Variable) => (
        <SelectEditorCell
          value={type}
          defaultEditing={!type}
          onChange={(value) => handleTypeChange(record, value)}
          validate={(v) => {
            if (!v) {
              return 'DataType cannot be empty';
            }
            return null;
          }}
          options={DATA_TYPE_OPTIONS}
        />
      ),
    },
    {
      title: 'Default Value',
      dataIndex: 'defaultValue',
      width: 120,
      render: (defaultValue: string, record: Variable) => {
        const validate = (value: string): string | null => {
          if (record.type === 'BOOL') {
            if (!BOOL_VALUES.includes(value)) {
              return `Invalid BOOL value. Only ${BOOL_VALUES.join('/')} allowed`;
            }
          } else {
            const numValue = Number(value);
            if (isNaN(numValue) || !Number.isInteger(numValue) || value?.includes('.')) {
              return `Invalid INT value. Must be an integer`;
            }
            if (numValue < INT_MIN || numValue > INT_MAX) {
              return `INT value must be between ${INT_MIN} and ${INT_MAX}`;
            }
          }
          return null;
        };

        return (
          <TextEditorCell
            value={defaultValue}
            onChange={(value) => handleDefaultValueChange(record, value)}
            validate={validate}
          />
        );
      },
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      render: (comment: string, record: Variable) => (
        <TextEditorCell
          value={comment}
          onChange={(value) => handleCommentChange(record, value)}
        />
      ),
    },
  ];

  return (
    <div className="container">
      <div className="button-group">
        <Button
          type="primary"
          onClick={handleAddRow}
        >
          Add Variable Row
        </Button>
        <Button
          type="primary"
          status="danger"
          disabled={selectedRowKeys.length === 0}
          onClick={handleDeleteRow}
        >
          Delete Variable Row
        </Button>
      </div>
      <Table
        columns={columns}
        data={variables}
        rowKey="id"
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={false}
      />
    </div>
  );
};

export const VarEditorTable: React.FC = () => {
  return (
    <VariablesStoreProvider>
      <VarEditorTableInternal />
    </VariablesStoreProvider>
  );
};