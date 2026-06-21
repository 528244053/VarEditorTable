import React, { useState, useEffect } from 'react';
import { Tooltip } from '@arco-design/web-react';
import '../styles.less';

export type RenderComponent<T> = (props: {
  value: T;
  onChange: (value: T) => void;
  onCommit: (value: T) => void;
  onCancel: () => void;
  hasError: boolean;
}) => React.ReactNode;

// 共用的属性，扩展的单元格编辑组件继承该接口
export interface EditorCellCommonProps<T> {
  value: T;
  onChange: (value: T) => void;
  validate?: (value: T) => string | null; // 校验方法返回错误信息或null
  defaultEditing?: boolean; // 是否默认编辑
}

interface EditorCellProps<T> extends EditorCellCommonProps<T> {
  renderValue?: (value: T) => React.ReactNode;
  renderComponent: RenderComponent<T>;
}

export const EditorCell = <T, R>({
  value,
  onChange,
  validate,
  renderValue,
  renderComponent,
  defaultEditing = false,
}: EditorCellProps<T>) => {
  const [isEditing, setIsEditing] = useState(defaultEditing);
  const [inputValue, setInputValue] = useState(value);
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [editingFocus, setEditingFocus] = useState(false);

  useEffect(() => {
    if (isEditing && value !== inputValue) {
      setInputValue(value);
    }
  }, [isEditing, value]);

  useEffect(() => {
    if (isEditing && validate) {
      const result = validate(inputValue);
      setValidationResult(result);
    }
  }, [isEditing, inputValue, validate]);

  const handleCommit = (commitValue: T) => {
    if (!validate || !validate(commitValue)) {
      onChange(commitValue);
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    setInputValue(value);
    setValidationResult(null);
    setIsEditing(true);
    setEditingFocus(true);
  };

  const renderValueDefault = () => {
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  };

  const hasError = !!validationResult;

  if (isEditing) {
    return (
      <Tooltip
        popupVisible={hasError && (editingFocus || popupVisible)}
        onVisibleChange={setPopupVisible}
        trigger="hover"
        content={validationResult ? (
          <span style={{ color: 'red' }}>{validationResult}</span>
        ) : null}
        position="top"
      >
        <div
          className={`editor-cell-editing ${hasError ? 'editor-cell-editing-error' : ''}`}
          onBlur={() => setEditingFocus(false)}
          onFocus={() => setEditingFocus(true)}
        >
          {renderComponent({
            value: inputValue,
            hasError,
            onChange: setInputValue,
            onCommit: handleCommit,
            onCancel: () => setIsEditing(false),
          })}
        </div>
      </Tooltip>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`editor-cell`}
    >
      {renderValue ? renderValue(value) : renderValueDefault()}
    </div>
  );
};
