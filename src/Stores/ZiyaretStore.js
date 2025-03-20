import { create } from "zustand";

const useZiyaretStore  = create((set) => ({
    musteriStore: null,
    setMusteriStore: (musteri) => set((state) => ({ musteriStore: musteri })),
    }));

export default useZiyaretStore