import { create } from "zustand";

const MontajStore = create((set) => ({
  storedMontaj: [],
  
  setStoredmontaj: (montaj) => set((state) => ({ storedMontaj: montaj })),

  storedMontajMaterial : [],

setStoredmontajMaterial: (montaj) => set((state) => ({ storedMontajMaterial: montaj })),

  
  
}));
//
export default MontajStore;
