import { create } from "zustand";

const initial = {
  email: null,
  name: null,
  phoneNumber: null,
  id: null,
};

const userSession = create<{
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
  id: string | null;
}>((set) => ({
  ...initial,
  login: () => set((state) => ({ ...state })),
  logout: () => set(() => initial),
}));

export { userSession };
