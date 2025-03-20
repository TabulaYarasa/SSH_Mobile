import { create } from "zustand";

const eskiParcalarStore = create((set) => ({
  oldMaterialsStore: [],

  oldServisHizmetleri: [],

  addOldMaterials: (item) =>
    set((state) => ({
      oldMaterialsStore: item,
    })),

  setStoredService: (service) => set((state) => ({ storedService: service })),

  addOldServis: (item) =>
    set((state) => ({
      oldServisHizmetleri: [...state.oldServisHizmetleri, item],
    })),

  deleteAllOldMaterial: (item) =>
    set((state) => ({
      oldMaterials: [],
    })),

  deleteAllOldServis: (item) =>
    set((state) => ({
      oldServisHizmetleri: [],
    })),
}));

export default eskiParcalarStore;
