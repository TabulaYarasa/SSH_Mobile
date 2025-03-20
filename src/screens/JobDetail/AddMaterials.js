// AddMaterial.js
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import ServiceStore from "../../Stores/ServiceStore";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { getAvailableMaterials,addMaterialToService } from "../../../api/CallMaterialList";
import PersonelStore from "../../Stores/PersonelStore";


const AddMaterial = ({ navigation }) => {
  const [state, setState] = useState({
    searchText: "",
    availableMaterials: [],
    selectedMaterials: [],
    isLoading: false,
    error: null,
  });

  const { storedService } = ServiceStore();
  const { currentPersonel } = PersonelStore();

  useEffect(() => {
    fetchAvailableMaterials();
  }, []);
//
  const fetchAvailableMaterials = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      // API çağrısını kendi API'nize göre düzenleyin
      const response = await getAvailableMaterials(
        currentPersonel.USERNAME
      );
      console.log("response.data", response);
      const materials = response || [];
      setState((prev) => ({
        ...prev,
        availableMaterials: materials,
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

  const handleMaterialPress = (material) => {
    setState((prev) => {
      const existingIndex = prev.selectedMaterials.findIndex(
        (item) => item.MATERIAL === material.MATERIAL
      );

      let newSelectedMaterials;
      if (existingIndex >= 0) {
        newSelectedMaterials = prev.selectedMaterials.map((item, index) => {
          if (index === existingIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      } else {
        newSelectedMaterials = [
          ...prev.selectedMaterials,
          { ...material, quantity: 1 },
        ];
      }

      return { ...prev, selectedMaterials: newSelectedMaterials };
    });
  };

  const handleQuantityChange = (material, increment) => {
    setState((prev) => {
      const newSelectedMaterials = prev.selectedMaterials
        .map((item) => {
          if (item.MATERIAL === material.MATERIAL) {
            const newQuantity = item.quantity + increment;
            if (newQuantity <= 0) {
              return null;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean);

      return { ...prev, selectedMaterials: newSelectedMaterials };
    });
  };

  const handleSave = async () => {
    if (state.selectedMaterials.length === 0) return;

    const requestBody = {
      breakdowntype: storedService.BREAKDOWNTYPE,
      breakdownnum: storedService.BREAKDOWNNUM,
      tparca: state.selectedMaterials.map((item) => ({
        material: item.MATERIAL,
        quantity: item.quantity,
        stext: item.STEXT,
        skunit: "",
      })),
    };

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await addMaterialToService(requestBody);
      console.log(response);
      setState((prev) => ({
        ...prev,
        modalVisible: false,
        selectedWorkers: [], // Seçimleri temizle
        isLoading: false,
      }));

      navigation.goBack();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  };

  
  const filteredMaterials = state.availableMaterials.filter(
    (material) =>
      material.STEXT?.toLowerCase().includes(state.searchText.toLowerCase()) ||
      material.MATERIAL?.toLowerCase().includes(state.searchText.toLowerCase())
  );

  if (state.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#488130" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Malzeme Ara..."
          value={state.searchText}
          onChangeText={(text) =>
            setState((prev) => ({ ...prev, searchText: text }))
          }
        />
      </View>

      <FlatList
        data={filteredMaterials}
        keyExtractor={(item) => item.MATERIAL}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.materialItem}
            onPress={() => handleMaterialPress(item)}
          >
            <View style={styles.materialInfo}>
              <Text style={styles.materialName}>{item.STEXT}</Text>
              <Text style={styles.materialCode}>{item.MATERIAL}</Text>
            </View>
            {state.selectedMaterials.find(
              (m) => m.MATERIAL === item.MATERIAL
            ) && <AntDesign name="checkcircle" size={24} color="#488130" />}
          </TouchableOpacity>
        )}
      />

      {state.selectedMaterials.length > 0 && (
        <View style={styles.selectedItemsContainer}>
          <Text style={styles.selectedTitle}>Seçilen Malzemeler</Text>
          <FlatList
            data={state.selectedMaterials}
            keyExtractor={(item) => item.MATERIAL}
            renderItem={({ item }) => (
              <View style={styles.selectedItem}>
                <Text style={styles.selectedItemText}>{item.STEXT}</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item, -1)}
                    style={styles.quantityButton}
                  >
                    <AntDesign name="minus" size={20} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item, 1)}
                    style={styles.quantityButton}
                  >
                    <AntDesign name="plus" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  materialItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    justifyContent: "space-between",
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: 16,
    marginBottom: 4,
  },
  materialCode: {
    color: "#666",
    fontSize: 14,
  },
  selectedItemsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 10,
    maxHeight: "40%",
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 5,
    borderRadius: 8,
  },
  selectedItemText: {
    flex: 1,
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quantityButton: {
    padding: 5,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#488130",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    textAlign: "center",
    margin: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  checkedIcon: {
    color: "#488130",
    marginLeft: 10,
  },
});

export default AddMaterial;
