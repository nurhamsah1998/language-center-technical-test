import { create } from "zustand";

const initial = {
  email: null,
  name: null,
  phoneNumber: null,
  id: null,
  isLoading: true,
};

const useUserSession = create<{
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
  isLoading: boolean;
  role: "Admin" | "Customer";
  id: string | null;
  login: (props: any) => void;
  logout: () => void;
  disableloading: () => void;
}>((set) => ({
  ...initial,
  role: "Customer",
  login: (state) =>
    set({
      role: state?.role,
      email: state.email,
      name: state.name,
      phoneNumber: state.phoneNumber,
      id: state.id,
      isLoading: false,
    }),
  disableloading: () => set({ isLoading: false }),
  logout: () => set({ ...initial }),
}));

export { useUserSession };
