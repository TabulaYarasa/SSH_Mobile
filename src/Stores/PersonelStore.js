import { create } from "zustand";

const   PersonelStore = create ((set) => ({
    currentPersonel: "",
   setCurrentPersonel: (personel) => set((state) => ({currentPersonel: personel})),
   currentSecondPersonel: "",
   setCurrentSecondPersonel: (personel2) => set((state) => ({currentSecondPersonel: personel2})),

   imzalayanKisi: "",
   setImzalayanKisi: (personel) => set((state) => ({imzalayanKisi: personel})),

}))

export default PersonelStore