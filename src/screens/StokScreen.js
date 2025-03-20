import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { callAvailStock } from "../../api/CallAvailStocks";
import ServicesCarStore from "../Stores/ServicesCarStore";

export default function StokScreen() {
  const [stocks, setStocks] = useState([]);

  const { servicesCar } = ServicesCarStore();

  const handleGetStocks = async () => {
    try {
      const result = await callAvailStock(
        servicesCar.STOCKPLACE,
        servicesCar.WAREHOUSE
      );
      if (result) {
        setStocks(result);
      } else {
        setStocks([]);
      }
    } catch (err) {
      console.log("errodr");
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetStocks();
  }, []);

  const item = {
    qunit: "5.0",
  };

  console.log((+item.qunit).toFixed(0));
  console.log(item.qunit);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listItemContainer}>
        <View style={{ maxWidth: "80%" }}>
          <Text style={{ textAlignVertical: "center" }}>{item.STEXT}</Text>
        </View>

        <View style={[styles.button1]}>
          <Text style={{ fontWeight: "bold" }}>
            {(+item.AVAILSTOCK).toFixed(0)} {item.QUNIT}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Stok Sorgulama</Text>
      <FlatList
        data={stocks}
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
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  listItemContainer: {
    backgroundColor: "white",
    elevation: 2,
    marginVertical: 5,
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
