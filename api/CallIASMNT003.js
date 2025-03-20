import api from "./api";

export const callIASMNT003 = async () => {
  try {
    const response = await api.post("/api/call-iasmnt003");
 
    return response.data.TMPTABLE.ROW;
  } catch (err) {
    console.error(err);
    return null;
  }
};
