import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ParcalarStore from "../Stores/ParcalarStore";

export default function EstimatedTeklifScreen() {
  const [servisUcreti, setServisUcreti] = useState("");
  const [parcaUcreti, setParcaUcreti] = useState("");
  const [materialsPrice, setMaterialsPrice] = useState(null);
  const [servicesPrice, setServicesPrice] = useState(null);
  const { materials, servisHizmetleri } = ParcalarStore();
  console.log(+servisUcreti + +parcaUcreti);

  const combinedData = materials.concat(servisHizmetleri);

  useEffect(() => {
    let toplam = 0;
    for (let i = 0; i < materials.length; i++) {
      let satirToplam = 0;

      satirToplam = Number(materials[i].PRICE) * materials[i].count;

      toplam += satirToplam;
    }
    setMaterialsPrice(toplam);
    console.log("malzeme sonuc: ", toplam);
  }, [materials]);

  useEffect(() => {
    let toplam = 0;
    for (let i = 0; i < servisHizmetleri.length; i++) {
      let satirToplam = 0;

      satirToplam =
        Number(servisHizmetleri[i].PRICE) * servisHizmetleri[i].count;

      toplam += satirToplam;
    }
    setServicesPrice(toplam);
    console.log("servis sonuc: ", toplam);
  }, [servisHizmetleri]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.renderItem}>
        <Text>{item.STEXT}</Text>
        <Text>{item.count} x {(+item.PRICE).toFixed(2)} TL </Text>
      </View>
    );
  };

  return (
    <View style={styles.view}>
      <FlatList
        data={combinedData}
        renderItem={renderItem}
        style={{ borderBottomWidth: 1, marginVertical: 5 }}
      />
      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Servis/İşçilik Ücreti</Text>
        <Text style={{ fontWeight: "bold" }}>
          {servicesPrice ? servicesPrice : "0"} TL
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={{ fontWeight: "bold" }}>Ek Ücret(Yedek Parça)</Text>
        <Text style={{ fontWeight: "bold" }}>
          {materialsPrice ? materialsPrice.toFixed(2) : "0"} TL
        </Text>
      </View>

      <View style={styles.total}>
        <Text style={{ fontWeight: "bold" }}>
          Toplam Fiyat:{" "}{" "}
          {servicesPrice || materialsPrice
            ? (+servicesPrice + +materialsPrice).toFixed(2)
            : "0"}{" "}
          TL
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          KDV Fiyatı(%20):{" "}{" "}
          {servicesPrice || materialsPrice
            ? ((+servicesPrice + +materialsPrice) * 0.2).toFixed(2)
            : "0"}{" "}
          TL
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          Artı KDV'li Toplam Fiyat:{" "}{" "}
          {servicesPrice || materialsPrice
            ? ((+servicesPrice + +materialsPrice) * 1.2).toFixed(2)
            : "0"}{" "}
          TL
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    paddingTop: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  total: {
    marginVertical: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 30,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#488130",
    padding: 10,
    borderRadius: 50,
    flexDirection: "row",
    marginVertical: 10,
  },
  centeredView: {
    //     width:250,
    //     height:150,
    //     backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
    minWidth: 100,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#488130",
    padding: 10,
    borderRadius: 50,

    flex: 1,
  },
  renderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
