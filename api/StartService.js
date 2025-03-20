import api from "./api";

export const startService = async (piAction, breakdownnum) => {
  //paction = 1 => status= 1 ve start date time = date now  == start service
  //2 =>  status = 2 ve enddate = date now == end service
  //3 => işlem listesi gelmiş olacak == geçmiş işlemler
  //4 =>
  //service num ve piAction mecburi
  try {
    const response = await api.post("/StartService", {
      piAction: piAction,
      servicenum: breakdownnum,
    });
   

    if (response.data == 'HATA!') {
      return null
    } else {
      console.log("başarılı");
      return response.data;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
