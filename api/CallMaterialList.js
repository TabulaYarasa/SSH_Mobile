import api from "./api";

export const CallMaterialList = async (breakdowntype, breakdownnum) => {
  try {
    const response = await api.post("/api/CallSrvTakilanParcalar", {
      breakdowntype,
      breakdownnum,
    });
    if (response.data?.TMPDOCLIST?.ROW) {
      // Eğer ROW bir array ise direkt döndür, değilse array'e çevir
      return Array.isArray(response.data.TMPDOCLIST.ROW) 
        ? response.data.TMPDOCLIST.ROW 
        : [response.data.TMPDOCLIST.ROW];
    } else {
      return [];
    }
  } catch (err) {
    console.log("error veriyor bu");
    console.log(err);
    return null;
  }
};

export const getAvailableMaterials = async (username) => {
  try {
    const response = await api.post("/CallMaterialList", {
      username,
    });
    if (Array.isArray(response.data?.TBLT?.ROW)) {
      return response.data.TBLT.ROW;
    } else if (response.data?.TBLT?.ROW) {
      // If single item, wrap in array
      return [response.data.TBLT.ROW];
    }
    return [];
  } catch (err) {
    console.log("error veriyor bu");
    console.log(err);
    return null;
  }
};

export const addMaterialToService = async (body) => {
  try {
    const response = await api.post("/api/CallTakilanParcaEkle", body);

    return response.data;
  } catch (err) {
    console.log("error veriyor bu");
    console.log(err);
    return null;
  }
};

{
  /* <TouchableOpacity
style={styles.addButton}
onPress={() => {
  navigation.navigate("ParcaEkle", { params: combinedData });
}}
>
<AntDesign name="plus" size={24} color="white" />
<Text style={{ color: "white", marginLeft: 10 }}>Ekle</Text>
</TouchableOpacity> */
}
