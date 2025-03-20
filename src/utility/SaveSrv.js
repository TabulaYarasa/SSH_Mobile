import api from "../../api/api";


export const SaveSrv = async (breakdowntype, breakdownnum) => {

  try {
    console.log("response cevap sorgu ");
    const response = await api.post("/SaveSrv", {
      breakdowntype: storedService.BREAKDOWNTYPE,
      breakdownnum: storedService.BREAKDOWNNUM,
    });
    console.log("response cevap sorgu s");
    console.log(response.data);
    return response;
  } catch (err) {
    console.log("Hata ", err);
  }
};
