import React from 'react';
import { Select } from '@arco-design/web-react';
import { EditorCell, EditorCellCommonProps, RenderComponent } from './EditorCell';
import '../styles.less';

interface SelectEditorCellProps<T extends string | number | null> extends EditorCellCommonProps<T> {
  options: { value: T; label: string }[];
}

export const SelectEditorCell = <T extends string | number | null>({
  options,
  ...props
}: SelectEditorCellProps<T>) => {

  const renderComponent: RenderComponent<T> = ({
    value,
    onCommit,
    onCancel,
    hasError,
  }) => (
    <Select
      defaultActiveFirstOption
      status={hasError ? 'error' : undefined}
      value={value as string | number}
      onChange={(val) => {
        onCommit(val as T);
      }}
      onVisibleChange={(visible) => {
        if (!visible) {
          setTimeout(() => {
            if (!hasError) {
              onCancel();
            }
          }, 0);
        }
      }}
      className="select-full"
      triggerProps={{
        autoAlignPopupWidth: true,
      }}
    >
      {options.map(opt => (
        <Select.Option key={String(opt.value)} value={opt.value as string | number}>
          {opt.label}
        </Select.Option>
      ))}
    </Select>
  );

  return (
    <EditorCell
      {...props}
      renderComponent={renderComponent}
    />
  );
};
