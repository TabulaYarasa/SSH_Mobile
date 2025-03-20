import api from "./api";

export const callNotes = async (breakdowntype, breakdownnum) => {
  try {
    const response = await api.post("/CallServisNotSearch", {

       breakdowntype,
       breakdownnum
      })
    return response.data.TMPDOCLIST.ROW
  
  } catch (err) {
    console.log("error veriyor bu")
    console.log(err);
    return null;
  }
};
