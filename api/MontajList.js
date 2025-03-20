import api from "./api";

export const montajList = async (piAction,prdorderno,contactnum) => {
  try {
    const response = await api.post("/Montaj/MontajList", {
      piaction : piAction,
      status2 : 1,
      status3 : 0,
      prdorderno : prdorderno,
      contactnum: contactnum
    });

    return response.data.TMPTABLE.ROW;
  } catch (err) {
    console.log(err);
    return null;
  }
};
