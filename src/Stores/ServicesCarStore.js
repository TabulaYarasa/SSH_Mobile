import { create } from "zustand";

const ServicesCarStore = create ((set) => ({
    servicesCar: "",
   setServicesCar: (car) => set((state) => ({servicesCar: car})),
}))

export default ServicesCarStore