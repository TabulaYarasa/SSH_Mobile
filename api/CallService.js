import api from "./api";

export const callService = async (status,custname,startDateTime,owner) => {
  try {
    const response = await api.post("/CallService", {
      custname:custname,
      owner: owner,
      scstatus:status,
      startDateTime: startDateTime,
      endDateTime: "2030-05-21T22:00:48.652Z",
    });
    console.log("response", response.data);
    return response.data.IASSRVBREAKDOWNTMP.ROW;
  } catch (err) {
    console.error(err);
    return err;
  }
};
