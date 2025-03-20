import { create } from "zustand";

const ServiceStore = create((set) => ({
  storedService: [],
  storedSignature: "",
  stadate:"",

  // setStadate: (date) => set((state) => ({ stadate: date })),
    
  setStadate: (date) => set((state) => {
    // Update both stadate and storedService.STADATE
    const newService = { ...state.storedService };
    newService.STADATE = date;
    return { 
      stadate: date,
      storedService: newService 
    };
  }),
  setStoredService: (service) => set((state) => ({ storedService: service })),
  
  setStoredSignature: (signature) => set((state) => ({ storedSignature: signature })),

  changeWarranty: (garanti) => {
    set((state) => {
      const newService = { ...state.storedService };

      newService.GARANTI = garanti;
      return { storedService: newService };
    });
  },
  changeTelNum: (telno) => {
    set((state) => {
      const newService = { ...state.storedService };

      newService.ARAYANTELNUM = telno;
      return { storedService: newService };
    });
  },
  changeBdOwner: (bdowner) => {
    set((state) => {
      const newService = { ...state.storedService };

      newService.BDOWNER = bdowner;
      return { storedService: newService };
    });
  },
  changeMntStatu: (statu) => {
    set((state) => {
      const newService = { ...state.storedService };

      newService.STATUSDETAIL = statu;
      return { storedService: newService };
    });
  },
  changeStadate: (stadate) => {
    set((state) => {
      const newService = { ...state.storedService };

      newService.STADATE = stadate;
      return { storedService: newService };
    });
  },
  changeStatus: async(status) => {
    set((state) => {
      const newService = { ...state.storedService };

      newService.STATUS = status;
  
      return { storedService: newService };
    })
  },
}));
//
export default ServiceStore;
