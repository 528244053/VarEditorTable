import React from 'react';
import { Input } from '@arco-design/web-react';
import { EditorCell, EditorCellCommonProps, RenderComponent } from './EditorCell';
import '../styles.less';

interface TextEditorCellProps extends EditorCellCommonProps<string> { }

export const TextEditorCell: React.FC<TextEditorCellProps> = (props) => {

  const renderComponent: RenderComponent<string> = ({
    value,
    onChange,
    onCommit,
    hasError,
  }) => {
    const handleBlur = () => {
      onCommit(value);
    };

    return (
      <Input
        autoFocus
        status={hasError ? 'error' : undefined}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        onPressEnter={handleBlur}
        className="input-full"
      />
    );
  };

  return (
    <EditorCell
      {...props}
      renderComponent={renderComponent}
    />
  );
};
