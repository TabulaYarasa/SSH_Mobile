import api from "./api";

export const SendNotes = async (nottipi, not, breakdowntype, breakdownnum) => {
  try {
    const response = await api.post("/CallCozumnotu", {
      nottipi,
      not,
      breakdowntype,
      breakdownnum,
    });
    console.log(response.data)
    return response.data
  } catch (err) {
    console.error(err);
    return err;
  }
};
