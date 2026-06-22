import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useVariablesStore, VariablesStoreProvider } from './store';
import { renderHook } from '@testing-library/react';

// 创建 wrapper 用于测试
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <VariablesStoreProvider>{children}</VariablesStoreProvider>
);

describe('VariablesStore', () => {
    beforeEach(() => {
        // 每个测试使用新的 store 实例
    });

    it('应该有初始数据', () => {
        const { result } = renderHook(() => useVariablesStore(), { wrapper });

        expect(result.current.variables).toHaveLength(3);
        expect(result.current.variables[0].name).toBe('Start');
        expect(result.current.variables[0].type).toBe('BOOL');
        expect(result.current.variables[0].defaultValue).toBe('TRUE');
    });

    it('addVariable 应该添加新变量', () => {
        const { result } = renderHook(() => useVariablesStore(), { wrapper });

        act(() => {
            result.current.addVariable({
                id: '4',
                name: 'NewVar',
                type: 'INT',
                defaultValue: '0',
                comment: 'new variable',
            });
        });

        expect(result.current.variables).toHaveLength(4);
        expect(result.current.variables[3].name).toBe('NewVar');
    });

    it('updateVariable 应该更新指定变量', () => {
        const { result } = renderHook(() => useVariablesStore(), { wrapper });

        act(() => {
            result.current.updateVariable('1', { name: 'UpdatedStart' });
        });

        expect(result.current.variables[0].name).toBe('UpdatedStart');
        expect(result.current.variables[0].type).toBe('BOOL'); // 其他字段不变
    });

    it('updateVariable 应该支持更新多个字段', () => {
        const { result } = renderHook(() => useVariablesStore(), { wrapper });

        act(() => {
            result.current.updateVariable('1', {
                name: 'NewName',
                type: 'INT',
                defaultValue: '100',
            });
        });

        const updated = result.current.variables[0];
        expect(updated.name).toBe('NewName');
        expect(updated.type).toBe('INT');
        expect(updated.defaultValue).toBe('100');
    });

    it('deleteVariable 应该删除指定变量（单个）', () => {
        const { result } = renderHook(() => useVariablesStore(), { wrapper });

        act(() => {
            result.current.deleteVariable(['1']);
        });

        expect(result.current.variables).toHaveLength(2);
        expect(result.current.variables.find(v => v.id === '1')).toBeUndefined();
    });

    it('deleteVariable 应该支持批量删除', () => {
        const { result } = renderHook(() => useVariablesStore(), { wrapper });

        act(() => {
            result.current.deleteVariable(['1', '2']);
        });

        expect(result.current.variables).toHaveLength(1);
        expect(result.current.variables[0].id).toBe('3');
    });

    it('deleteVariable 删除不存在的ID应该不影响数据', () => {
        const { result } = renderHook(() => useVariablesStore(), { wrapper });

        act(() => {
            result.current.deleteVariable(['999']);
        });

        expect(result.current.variables).toHaveLength(3);
    });

    it('updateVariable 更新不存在的ID应该不影响数据', () => {
        const { result } = renderHook(() => useVariablesStore(), { wrapper });

        act(() => {
            result.current.updateVariable('999', { name: 'NotExist' });
        });

        expect(result.current.variables).toHaveLength(3);
        expect(result.current.variables.find(v => v.name === 'NotExist')).toBeUndefined();
    });

    it('删除所有变量后应该为空数组', () => {
        const { result } = renderHook(() => useVariablesStore(), { wrapper });

        act(() => {
            result.current.deleteVariable(['1', '2', '3']);
        });

        expect(result.current.variables).toHaveLength(0);
    });

    it('连续添加多个变量应该正确累加', () => {
        const { result } = renderHook(() => useVariablesStore(), { wrapper });

        act(() => {
            result.current.addVariable({
                id: '4',
                name: 'Var4',
                type: 'BOOL',
                defaultValue: 'TRUE',
                comment: '',
            });
            result.current.addVariable({
                id: '5',
                name: 'Var5',
                type: 'INT',
                defaultValue: '0',
                comment: '',
            });
        });

        expect(result.current.variables).toHaveLength(5);
        expect(result.current.variables[3].name).toBe('Var4');
        expect(result.current.variables[4].name).toBe('Var5');
    });
});