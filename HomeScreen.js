import React from "react";
import { View, StyleSheet } from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
  MaterialIcons,
  AntDesign,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import HomeIcons from "../components/HomeIcons";


const COLOR = "#BACAFF";

export default function HomeScreen({ route, navigation }) {
  const { servicesCar, setServicesCar } = ServicesCarStore();
  console.log("store home: ", servicesCar);

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
        <HomeIcons name="Stok Sorgulama" onPress="Calendar">
          <MaterialIcons name="inventory" size={50} color={COLOR} />
        </HomeIcons>
      </View>
      <View style={styles.row}>
        <HomeIcons name="Eski Servisler">
          <FontAwesome name="history" size={50} color={COLOR} />
        </HomeIcons>
        <HomeIcons name="Tahmini Teklif">
          <MaterialCommunityIcons name="offer" size={50} color={COLOR} />
        </HomeIcons>
      </View>
      <View style={styles.row}>
        <HomeIcons name="Müşteriler" onPress="CustomerTabs">
          <Ionicons name="people" size={50} color={COLOR} />
        </HomeIcons>
        <HomeIcons name="Randevu Takvimi" onPress="Tabs">
          <AntDesign name="calendar" size={50} color={COLOR} />
        </HomeIcons>
      </View>

      <HomeIcons name="İmza Modulü" onPress="Signature">
        <FontAwesome5 name="signature" size={50} color={COLOR} />
      </HomeIcons>
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
