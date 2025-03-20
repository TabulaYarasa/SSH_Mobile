import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import ServiceStore from "../../Stores/ServiceStore";
import { AntDesign } from "@expo/vector-icons";
import { CallMaterialList } from "../../../api/CallMaterialList";
import EditableStore from "../../Stores/EditableStore";
import PersonelStore from "../../Stores/PersonelStore";

const JobProccess = ({ navigation }) => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    refreshing: false,
    materialList: [], // API'den gelen malzeme listesi
  });
  const { editable } = EditableStore();
  const { storedService } = ServiceStore();
  const isFocused = useIsFocused();
  const hasLoadedOnce = useRef(false);

 
  // Malzeme listesini getir
  const fetchMaterialList = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await CallMaterialList(
        storedService.BREAKDOWNTYPE,
        storedService.BREAKDOWNNUM,
      
      );

      setState((prev) => ({
        ...prev,
        materialList: response || [],
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  };
console.log("state.materialList",state.materialList)
  useEffect(() => {
    if (isFocused && !hasLoadedOnce.current) {
      fetchMaterialList();
      hasLoadedOnce.current = true;
    }
  }, [isFocused]);

  // Yenileme fonksiyonu
  const onRefresh = useCallback(() => {
    setState((prev) => ({ ...prev, refreshing: true }));
    fetchMaterialList().finally(() =>
      setState((prev) => ({ ...prev, refreshing: false }))
    );
  }, []);

  // Liste öğesi bileşeni
  const MaterialListItem = ({ item }) => (
    <View style={styles.listItemContainer}>
      <View style={styles.materialInfo}>
        <Text style={styles.materialText}>{item.STEXT}</Text>
        <Text style={styles.materialCode}>{item.MATERIAL}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <View style={styles.quantityBox}>
          <Text style={styles.quantityText}>
            {(+item.QUANTITY).toFixed(0)} {item.QUNIT}
          </Text>
        </View>
      </View>
    </View>
  );

  if (state.isLoading && !state.refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#488130" />
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{state.error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchMaterialList}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {editable && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddMaterial")}
        >
          <AntDesign name="plus" size={24} color="white" />
          <Text style={styles.addButtonText}>Malzeme Ekle</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={state.materialList}
        renderItem={MaterialListItem}
        keyExtractor={(item) => item.MATERIAL}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={onRefresh}
            colors={["#488130"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Bu serviste kayıtlı malzeme bulunmamaktadır
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  listItemContainer: {
    backgroundColor: "white",
    elevation: 2,
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  materialInfo: {
    flex: 1,
    marginRight: 10,
  },
  materialText: {
    fontSize: 16,
    marginBottom: 4,
  },
  materialCode: {
    fontSize: 14,
    color: "#666",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quantityBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#f8f8f8",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#488130",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#488130",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
});

export default JobProccess;
