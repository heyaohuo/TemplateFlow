import { create } from 'zustand'

type Store = {
  credits: number
  address: string

  // 业务级幂等标记
  hasIncreased: boolean
  hasDecreased: boolean

  incOnce: (n: number) => void
  desOnce: (n: number) => void

  reset: () => void
  setAddress: (address: string) => void
}

export const useCreditsStore = create<Store>((set) => ({
  credits: 0,
  address: '',

  hasIncreased: false,
  hasDecreased: false,

  // ⭐ 只允许成功一次的加分
  incOnce: (n) =>
    set((state) => {
      if (state.hasIncreased) return state
      return {
        credits: state.credits + n,
        hasIncreased: true,
      }
    }),

  // ⭐ 只允许成功一次的减分
  desOnce: (n) =>
    set((state) => {
      if (state.hasDecreased) return state
      return {
        credits: Math.max(0, state.credits - n),
        hasDecreased: true,
      }
    }),

  reset: () =>
    set({
      credits: 0,
      hasIncreased: false,
      hasDecreased: false,
    }),

  setAddress: (address) => set({ address }),
}))