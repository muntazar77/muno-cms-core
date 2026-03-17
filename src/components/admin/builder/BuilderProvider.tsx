'use client'

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'

export interface BuilderBlock {
  id: string
  blockType: string
  blockName?: string | null
  [key: string]: unknown
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

interface BuilderState {
  blocks: BuilderBlock[]
  selectedBlockId: string | null
  deviceMode: DeviceMode
  isDirty: boolean
  isSaving: boolean
}

type BuilderAction =
  | { type: 'SET_BLOCKS'; blocks: BuilderBlock[] }
  | { type: 'ADD_BLOCK'; block: BuilderBlock; index?: number }
  | { type: 'UPDATE_BLOCK'; id: string; data: Record<string, unknown> }
  | { type: 'REMOVE_BLOCK'; id: string }
  | { type: 'MOVE_BLOCK'; fromIndex: number; toIndex: number }
  | { type: 'SELECT_BLOCK'; id: string | null }
  | { type: 'SET_DEVICE'; mode: DeviceMode }
  | { type: 'SET_SAVING'; saving: boolean }
  | { type: 'MARK_CLEAN' }

function reducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_BLOCKS':
      return { ...state, blocks: action.blocks, isDirty: false }

    case 'ADD_BLOCK': {
      const blocks = [...state.blocks]
      const index = action.index ?? blocks.length
      blocks.splice(index, 0, action.block)
      return { ...state, blocks, isDirty: true, selectedBlockId: action.block.id }
    }

    case 'UPDATE_BLOCK':
      return {
        ...state,
        isDirty: true,
        blocks: state.blocks.map((b) => (b.id === action.id ? { ...b, ...action.data } : b)),
      }

    case 'REMOVE_BLOCK': {
      const blocks = state.blocks.filter((b) => b.id !== action.id)
      return {
        ...state,
        blocks,
        isDirty: true,
        selectedBlockId: state.selectedBlockId === action.id ? null : state.selectedBlockId,
      }
    }

    case 'MOVE_BLOCK': {
      const blocks = [...state.blocks]
      const [moved] = blocks.splice(action.fromIndex, 1)
      blocks.splice(action.toIndex, 0, moved)
      return { ...state, blocks, isDirty: true }
    }

    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.id }

    case 'SET_DEVICE':
      return { ...state, deviceMode: action.mode }

    case 'SET_SAVING':
      return { ...state, isSaving: action.saving }

    case 'MARK_CLEAN':
      return { ...state, isDirty: false }

    default:
      return state
  }
}

interface BuilderContextValue {
  state: BuilderState
  addBlock: (blockType: string, index?: number, defaultData?: Record<string, unknown>) => void
  updateBlock: (id: string, data: Record<string, unknown>) => void
  removeBlock: (id: string) => void
  moveBlock: (fromIndex: number, toIndex: number) => void
  selectBlock: (id: string | null) => void
  setDeviceMode: (mode: DeviceMode) => void
  getSelectedBlock: () => BuilderBlock | undefined
  saveBlocks: () => Promise<void>
  pageId: number
}

const BuilderContext = createContext<BuilderContextValue | null>(null)

function generateId() {
  return Math.random().toString(36).substring(2, 10)
}

interface BuilderProviderProps {
  children: ReactNode
  pageId: number
  initialBlocks: BuilderBlock[]
}

export function BuilderProvider({ children, pageId, initialBlocks }: BuilderProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    blocks: initialBlocks,
    selectedBlockId: null,
    deviceMode: 'desktop',
    isDirty: false,
    isSaving: false,
  })

  const addBlock = useCallback((blockType: string, index?: number, defaultData?: Record<string, unknown>) => {
    const block: BuilderBlock = { id: generateId(), blockType, ...defaultData }
    dispatch({ type: 'ADD_BLOCK', block, index })
  }, [])

  const updateBlock = useCallback((id: string, data: Record<string, unknown>) => {
    dispatch({ type: 'UPDATE_BLOCK', id, data })
  }, [])

  const removeBlock = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_BLOCK', id })
  }, [])

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: 'MOVE_BLOCK', fromIndex, toIndex })
  }, [])

  const selectBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', id })
  }, [])

  const setDeviceMode = useCallback((mode: DeviceMode) => {
    dispatch({ type: 'SET_DEVICE', mode })
  }, [])

  const getSelectedBlock = useCallback(() => {
    return state.blocks.find((b) => b.id === state.selectedBlockId)
  }, [state.blocks, state.selectedBlockId])

  const saveBlocks = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', saving: true })
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ blocks: state.blocks }),
      })
      if (!res.ok) throw new Error('Save failed')
      dispatch({ type: 'MARK_CLEAN' })
    } finally {
      dispatch({ type: 'SET_SAVING', saving: false })
    }
  }, [pageId, state.blocks])

  const value = useMemo<BuilderContextValue>(
    () => ({
      state,
      addBlock,
      updateBlock,
      removeBlock,
      moveBlock,
      selectBlock,
      setDeviceMode,
      getSelectedBlock,
      saveBlocks,
      pageId,
    }),
    [
      state,
      addBlock,
      updateBlock,
      removeBlock,
      moveBlock,
      selectBlock,
      setDeviceMode,
      getSelectedBlock,
      saveBlocks,
      pageId,
    ],
  )

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
}

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider')
  return ctx
}
