import { createContext, useContext, ReactNode, useMemo } from 'react';
import { create, useStore } from 'zustand';
import { produce } from 'immer';
import { Variable } from './type';

export interface VariablesStore {
  variables: Variable[];
  addVariable: (variable: Variable) => void;
  updateVariable: (id: string, updates: Partial<Variable>) => void;
  deleteVariable: (idList: string[]) => void;
}

const initialVariables: Variable[] = [
  { id: '1', name: 'Start', type: 'BOOL', defaultValue: 'TRUE', comment: 'system start' },
  { id: '2', name: 'Stop', type: 'BOOL', defaultValue: 'TRUE', comment: '' },
  { id: '3', name: 'Count', type: 'INT', defaultValue: '123', comment: 'count number' },
];

const createVariablesStore = () =>
  create<VariablesStore>((set) => ({
    variables: initialVariables,

    addVariable: (variable) =>
      set(
        produce((state) => {
          state.variables.push(variable);
        }),
      ),

    updateVariable: (id, updates) =>
      set(
        produce((state: VariablesStore) => {
          const index = state.variables.findIndex((v: Variable) => v.id === id);
          if (index !== -1) {
            state.variables[index] = { ...state.variables[index], ...updates };
          }
        }),
      ),

    deleteVariable: (idList) =>
      set(
        produce((state: VariablesStore) => {
          state.variables = state.variables.filter((v: Variable) => !idList.includes(v.id));
        }),
      ),
  }));

export type VariablesStoreType = ReturnType<typeof createVariablesStore>;

const VariablesStoreContext = createContext<VariablesStoreType | null>(null);

export const VariablesStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storeCurrent = useMemo(() => createVariablesStore(), []);
  return (
    <VariablesStoreContext.Provider value={storeCurrent} >
      {children}
    </VariablesStoreContext.Provider>
  );
};

export const useVariablesStore = () => {
  const store = useContext(VariablesStoreContext);
  if (!store) {
    throw new Error('useVariablesStore must be used within VariablesStoreProvider');
  }
  return useStore(store);
};