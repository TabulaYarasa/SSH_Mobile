import api from "./api";

// api/Workers.js
export const getAllWorkers = async () => {
  try {
    const response = await api.post("/CallMntPersonel");
    console.log(response.data);
    if (response.data?.TMPTABLE?.ROW) {
      return response.data.TMPTABLE.ROW;
    } else {
      return [];
    }
  } catch (err) {
    console.log("error veriyor bu");
    console.log(err);
    return null;
  }
};

export const getServiceWorkers = async (breakdowntype, breakdownnum) => {
  // Servisteki çalışanları getiren API çağrısı
  try {
    const response = await api.post("/CalllSrvCalisanlar", {
      breakdowntype,
      breakdownnum,
    });

    if (response.data?.TMPDOCLIST?.ROW) {
      const workers = response.data.TMPDOCLIST.ROW;
      return Array.isArray(workers) ? workers : [workers];
    } else {
      return [];
    }
  } catch (err) {
    console.log("error veriyor bu");
    console.log(err);
    return []; // Hata durumunda boş array döndür
  }
};

export const addWorkerToService = async (requestBody) => {
  // Servise çalışan ekleyen API çağrısı
  try {
    const response = await api.post("/CallCalisanEkle", requestBody);

    return response.data;
  } catch (err) {
    console.log("error veriyor bu");
    console.log(err);
    return null;
  }
};
