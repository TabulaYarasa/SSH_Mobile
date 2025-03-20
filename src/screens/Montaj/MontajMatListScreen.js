import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import MontajStore from "../../Stores/MontajStore";

export default function MontajMatListScreen() {
  const { storedMontajMaterial } = MontajStore();

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listItemContainer}>
        <View style={{ maxWidth: "80%" }}>
          <Text style={{ textAlignVertical: "center" }}>{item.STEXT}</Text>
        </View>

        <View style={[styles.button1]}>
          <Text style={{ fontWeight: "bold" }}>{+item.KALAN}</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={{ maxWidth: "80%" }}>
          <Text style={{ fontWeight: "bold",fontSize:16  }} >Ürün</Text>
        </View>
        <View style={{ maxWidth: "80%" }}>
          <Text style={{ fontWeight: "bold", fontSize:16 }}>Kalan Miktar</Text>
        </View>
      </View>
      <FlatList
        data={storedMontajMaterial}
        renderItem={renderItem}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",

   
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  listItemContainer: {
    backgroundColor: "white",
    elevation: 2,
    marginVertical: 3,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button1: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    minWidth: 30,
    minHeight: 30,
    alignItems: "center",
  },
});
