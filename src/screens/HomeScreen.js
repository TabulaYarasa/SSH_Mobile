import React, { useEffect, useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import HomeIcons from "../components/HomeIcons";

import ParcalarStore from "../Stores/ParcalarStore";
import PersonelStore from "../Stores/PersonelStore";

const COLOR = "#BACAFF";

export default function HomeScreen({ route, navigation }) {
  const { deleteAllMaterial, deleteAllServis } = ParcalarStore();
  const { currentPersonel } = PersonelStore();

  useLayoutEffect(() => {
    deleteAllMaterial("s");
    deleteAllServis("ss");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate("StokSorgulama", { item, isim });
          }}
          style={styles.button}
        >
          <FontAwesome name="barcode" size={50} color="#BACAFF" />
          <Text style={styles.text}>Stok Sorgulama</Text>
        </TouchableOpacity> */}

        <HomeIcons name="Servis Listesi" onPress="JobList">
          <Feather name="truck" size={50} color={COLOR} />
        </HomeIcons>
        <HomeIcons name="Montaj Listesi" onPress="MontajList">
          <MaterialCommunityIcons name="car-wrench" size={50} color={COLOR} />
        </HomeIcons>
      </View>
      <View style={styles.row}>
        {/* <HomeIcons name="Stok Sorgulama" onPress="Stok">
          <MaterialIcons name="inventory" size={50} color={COLOR} />
        </HomeIcons> */}
        <HomeIcons name="Müşteri ziyaretleri" onPress="Ziyaretler">
          <MaterialIcons name="inventory" size={50} color={COLOR} />
        </HomeIcons>
        <HomeIcons name="Tahmini Teklif" onPress="EstimatedTabs">
          <MaterialCommunityIcons name="offer" size={50} color={COLOR} />
        </HomeIcons>
      </View>
      <View style={styles.row}>
        <HomeIcons name="Raporlama" onPress="Raporlama">
          <Entypo name="text-document" size={50} color={COLOR} />
        </HomeIcons>
        <HomeIcons name="Çıkış" onPress="Login">
          <Entypo name="circle-with-cross" size={50} color={COLOR} />
        </HomeIcons>
      </View>
      {/* <View style={styles.row}>
        
        <HomeIcons name="Randevu Takvimi" onPress="Tabs">
          <AntDesign name="calendar" size={50} color={COLOR} />
        </HomeIcons>
        <HomeIcons name="Stok Sorgulama" onPress="Stok">
          <MaterialIcons name="inventory" size={50} color={COLOR} />
        </HomeIcons>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
    gap: 10,
  },
});
