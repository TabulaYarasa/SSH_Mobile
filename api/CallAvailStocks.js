import api from "./api";

export const callAvailStock = async (stockplace, warehouse) => {
  console.log(stockplace);
  console.log(warehouse);
  try {
    const response = await api.post("/CallAvailStocks", {
      stockplace: stockplace,
      warehouse: warehouse,
    });
    console.log(response.data)
  
    if (response.data.TMPAVAILSTOCK) {
      console.log(response.data.TMPAVAILSTOCK.ROW)
      return response.data.TMPAVAILSTOCK.ROW;
    } else {
      console.error("sonuç yok");
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
