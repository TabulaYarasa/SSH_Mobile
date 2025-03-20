import api from "../api";

export const callListCustomer = async (name) => {
    try {
        const response = await api.post("/api/callListCustomer", {
            name
          });
        
    return response.data.TBTX.ROW;
  } catch (err) {
    console.log(err);
    return null;
    }
}