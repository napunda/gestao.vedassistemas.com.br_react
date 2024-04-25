import { create } from "zustand";

interface SearchState {
  q: string;
  setQ: (q: string) => void;
}

const params = new URLSearchParams(window.location.search);

const useSearchStore = create<SearchState>((set) => ({
  q: params.get("q") ?? "",
  setQ: (q) => {
    set({ q });
  },
}));

export default useSearchStore;
