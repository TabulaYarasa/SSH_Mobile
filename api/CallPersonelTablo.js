import api from "./api";

export const callPersonelTablo = async (username, password) => {
  console.log("callPersonelTablo çalıştı")
  console.log("username: ", username)
  console.log("password: ", password)
  try {
    const response = await api.post("/CallSbmMnt0001", {
       username,
       password
      })

    return response.data.TBLT.ROW
  
  } catch (err) {
    console.log("login hatası")
    console.log(err);
    return null;
  }
};
