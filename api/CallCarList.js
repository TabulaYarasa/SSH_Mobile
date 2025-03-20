import api from "./api";

export const callCarList = async () => {
    try {
        const response = await api.post("/CallCarList");
        
    return response.data.TMPTABLE.ROW;
  } catch (err) {
    console.log(err);
    return null;
    }
}