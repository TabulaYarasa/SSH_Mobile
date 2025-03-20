import api from "./api";

export const finishService = async (breakdowntype, breakdownnum) => {
  try {
    console.log("girdi")
    const response = await api.post("/SaveSrv", {

       breakdowntype,
       breakdownnum
      })
      console.log("çıktı")
    return response.data
  
  } catch (err) {
    console.log("finish error",err)
   
    return null;
  }
};


