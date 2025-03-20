import api from "./api";

export const callMntPersonel = async () => {
  try {

    const response = await api.post("/CallMntPersonel")
 
    return response.data.TMPTABLE.ROW
  } catch (err) {
    console.error(err);
    return null;
  }
};
