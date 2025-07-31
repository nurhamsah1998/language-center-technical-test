import { create } from "zustand";

const initial = {
  email: null,
  name: null,
  phoneNumber: null,
  id: null,
};

const useUserSession = create<{
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
  id: string | null;
  login: (props: any) => void;
  logout: () => void;
}>((set) => ({
  ...initial,
  login: () =>
    set((state) => ({
      email: state.email,
      name: state.name,
      phoneNumber: state.phoneNumber,
      id: state.id,
    })),
  logout: () => set(() => initial),
}));

export { useUserSession };
