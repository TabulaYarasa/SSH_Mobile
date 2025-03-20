import { create } from "zustand";

const ParcalarStore = create((set) => ({
  materials: [],
  arizaSebep: [],
  arizaSebepAciklama: "",
  servisHizmetleri: [],

  addArizaSebep: (item) =>
    set((state) => ({
      arizaSebep: item,
    })),
    addArizaSebepAciklama: (item) =>
    set((state) => ({
      arizaSebepAciklama: item,
    })),

  addMaterials: (item) =>
    set((state) => ({
      materials: [...state.materials, item],
    })),

  addServis: (item) =>
    set((state) => ({
      servisHizmetleri: [...state.servisHizmetleri, item],
    })),

  increaseMaterial: (id) => {
    set((state) => {
      const updatedMaterials = state.materials.map((material) =>
        material.MATERIAL === id
          ? { ...material, count: material.count + 1 }
          : material
      );
      return { ...state, materials: updatedMaterials };
    });
  },

  increaseServis: (id) => {
    set((state) => {
      const updatedServisHizmeti = state.servisHizmetleri.map((servis) =>
        servis.MATERIAL === id ? { ...servis, count: servis.count + 1 } : servis
      );
      return { ...state, servisHizmetleri: updatedServisHizmeti };
    });
  },

  decreaseMaterial: (id) => {
    set((state) => {
      const updatedMaterials = state.materials.map((material) =>
        material.MATERIAL === id
          ? { ...material, count: material.count - 1 }
          : material
      );
      return { ...state, materials: updatedMaterials };
    });
  },

  decreaseServis: (id) => {
    set((state) => {
      const updatedServisHizmeti = state.servisHizmetleri.map((material) =>
        material.MATERIAL === id
          ? { ...material, count: material.count - 1 }
          : material
      );
      return { ...state, servisHizmetleri: updatedServisHizmeti };
    });
  },

  deleteMaterial: (id) => {
    set((state) => {
      const updatedMaterials = state.materials.filter(
        (material) => material.MATERIAL !== id
      );
      return { ...state, materials: updatedMaterials };
    });
  },

  deleteServis: (id) => {
    set((state) => {
      const updatedServis = state.servisHizmetleri.filter(
        (material) => material.MATERIAL !== id
      );
      return { ...state, servisHizmetleri: updatedServis };
    });
  },

  deleteAllMaterial: (item) =>
    set((state) => ({
      materials: [],
    })),

  deleteAllServis: (item) =>
    set((state) => ({
      servisHizmetleri: [],
    })),

  changePrice: (item, price) => {
    set((state) => {
      const updatedServisHizmeti = state.servisHizmetleri.map((material) =>
        material.MATERIAL == item.MATERIAL
          ? { ...material, PRICE: price }
          : material
      );

      return { ...state, servisHizmetleri: updatedServisHizmeti };
    });
  },
}));

export default ParcalarStore;
