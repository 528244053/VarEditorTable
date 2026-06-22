import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { VariablesStoreProvider } from '../components/VarEditorTable/store';

// 自定义渲染函数，自动包裹 Provider
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => <VariablesStoreProvider>{children}</VariablesStoreProvider>,
    ...options,
  });
}

// 重新导出 testing-library 的所有功能
export * from '@testing-library/react';
export { renderWithProviders as render };