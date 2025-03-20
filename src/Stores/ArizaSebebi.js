import { create } from "zustand";

const ArizaSebebi = create((set) => ({
  storedAriza: [],
  
  setStoredAriza: (ariza) => set((state) => ({ storedAriza: ariza })),

  arizaAciklama : "",
  setArizaAciklama : (ariza) => set((state) => ({arizaAciklama: ariza}))

  
}));
//
export default ArizaSebebi;
