import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChecklistState {
  checkedItems: string[]
  checkedSubItems: string[]
  toggleItem: (id: string) => void
  toggleSubItem: (subId: string) => void
  resetChecklist: () => void
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    set => ({
      checkedItems: [],
      checkedSubItems: [],
      toggleItem: id =>
        set(state => ({
          checkedItems: state.checkedItems.includes(id)
            ? state.checkedItems.filter(item => item !== id)
            : [...state.checkedItems, id],
        })),
      toggleSubItem: subId =>
        set(state => ({
          checkedSubItems: state.checkedSubItems.includes(subId)
            ? state.checkedSubItems.filter(item => item !== subId)
            : [...state.checkedSubItems, subId],
        })),
      resetChecklist: () => set({ checkedItems: [], checkedSubItems: [] }),
    }),
    {
      name: 'checklist-storage',
    }
  )
)
