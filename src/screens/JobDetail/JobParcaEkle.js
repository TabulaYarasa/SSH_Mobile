import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { EvilIcons } from "@expo/vector-icons";
import api from "../../../api/api";
import ServiceStore from "../../Stores/ServiceStore";
import ParcalarStore from "../../Stores/ParcalarStore";
import { callIASMNT003 } from "../../../api/CallIASMNT003";
import ArizaSebebi from "../../Stores/ArizaSebebi";

const JobParcaEkle = ({ navigation, route }) => {
  const { params } = route.params;
  const [isFocus, setIsFocus] = useState(false);

  const [materialList, setMaterialList] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [modal, setModal] = useState(false);
  
  const [listData, setListData] = useState([]);

  const [yapilanIslem, setYapilanIslem] = useState("");
  const [arizaSebebi, setArizaSebebi] = useState([]);
  const [secilenArizaSebebi, setSecilenArizaSebebi] = useState([]);
  const [degistirelecekFiyat, setDegistirilecekFiyat] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const { setStoredAriza } = ArizaSebebi();
  const {
    materials,
    addMaterials,
    increaseMaterial,
    deleteAllMaterial,
    decreaseMaterial,
    deleteMaterial,
    addArizaSebep,
    arizaSebep,
    addArizaSebepAciklama,
    servisHizmetleri,
    addServis,
    increaseServis,
    decreaseServis,
    deleteServis,
    deleteAllServis,
    changePrice,
  } = ParcalarStore();

  const { storedService } = ServiceStore();

  const combinedData = materials.concat(servisHizmetleri);

  useLayoutEffect(() => {
    setListData(params);
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          handleCallIASMNT003()
        setModal(!modal)}}>
          <Text style={{ fontSize: 20 }}>✓</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  useEffect(() => {
    const backAction = () => {
      // Geri tuşuna basıldığında yapılacak işlemler burada tanımlanır
      console.log("Geri tuşuna basıldı");
      deleteAllMaterial("s");
      navigation.pop();
      return true; // true döndürerek geri tuşunu yakalayın
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Temizlik işlemi
  }, []);

  // useEffect(() => {
  //   handleCallIASMNT003();
  // }, []);

  const handleCallIASMNT003 = async () => {
    try {
      const result = await callIASMNT003();
      if (result) {
        setArizaSebebi(result);
      } else {
        console.log("sonuç yok");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleCheckList = async () => {
      try {
        console.log("sorgu material list");
        const response = await api.post("/CallMaterialList");

        if (response.data.TBLT) {
          if (response.data.TBLT.ROW.length > 1) {
            setMaterialList(response.data.TBLT.ROW);
          } else {
            setMaterialList([response.data.TBLT.ROW]);
          }
        } else {
          setMaterialList([]);
        }
      } catch (err) {
        console.log("material list: ", err);
      }
    };
    handleCheckList();
  }, []);

  const addParcaHandler = () => {
    console.log("parça ekleme ve artırma işlemi");
    if (selectedMaterial) {
      const existingItem = listData.find(
        (i) => i.MATERIAL === selectedMaterial.MATERIAL
      );
      if (existingItem) {
        console.log("artırma");
        handleAdd(existingItem.MATERIAL);
      } else {
        if (selectedMaterial.MATGRP == "SERVİS") {
          addServis({ ...selectedMaterial, count: 1 });
          // setRenderer("");
        } else {
          console.log("yeni ekleme");

          addMaterials({ ...selectedMaterial, count: 1 });
          // setRenderer("");
        }

        setListData([...listData, { ...selectedMaterial, count: 1 }]);
      }
    } else {
      Alert.alert("UYARI", "Malzeme seçilmesi gerekmektedir");
    }
  };

  // -------------------------------------------

  // useEffect(() => {
  //   const groupedData = parcalar.reduce((acc, item) => {
  //     const existingItem = acc.find((i) => i.MATERIAL === item.MATERIAL);
  //     if (existingItem) {
  //       existingItem.count++;
  //       // setRenderer("");
  //     } else {
  //       acc.push({ ...item, count: 1 });
  //       // setRenderer("");
  //     }
  //     return acc;
  //   }, []);
  //   setListData(groupedData);
  // }, []);

  const handleAdd = (MATERIAL) => {
    const newListData = combinedData.map((item) => {
      if (item.MATERIAL === MATERIAL) {
        if (item.MATGRP == "SERVİS") {
          increaseServis(MATERIAL);
        } else {
          increaseMaterial(MATERIAL);
        }
        return { ...item, count: item.count + 1 };
      }
      return item;
    });
  };

  const handleMinus = (MATERIAL) => {
    const newListData = combinedData.map((item) => {
      if (item.MATERIAL === MATERIAL) {
        if (item.count > 1) {
          // Eşleşen öğenin count değerini artır

          if (item.MATGRP == "SERVİS") {
            decreaseServis(MATERIAL);
          } else {
            decreaseMaterial(MATERIAL);
          }
          return { ...item, count: item.count - 1 };
        } else {
          console.log("0 veya küçük");
        }
      }
      return item;
    });
  };

  const handleDelete = (MATERIAL) => {
    const newStoreData = combinedData.map((item) => {
      if (item.MATGRP == "SERVİS") {
        deleteServis(MATERIAL);
      } else {
        deleteMaterial(MATERIAL);
      }
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemsCell}>
          <View style={{ maxWidth: "55%" }}>
            <Text style={{ textAlignVertical: "center" }}>{item.STEXT}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <TouchableOpacity
              onPress={() => handleMinus(item.MATERIAL)}
              style={[
                styles.button,
                { paddingHorizontal: 10, backgroundColor: "#FFD3B6" },
              ]}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <View style={[styles.button]}>
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                {item.count}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                handleAdd(item.MATERIAL);
              }}
              style={[styles.button, { backgroundColor: "#A8E6CF" }]}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(item.MATERIAL)}
              style={[
                styles.button,
                { justifyContent: "center", backgroundColor: "#FFAAA5" },
              ]}
            >
              <EvilIcons name="trash" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
     
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <Modal
          onBackdropPress={() => setModal(!modal)}
          animationType="slide"
          transparent
          visible={modal}
          onRequestClose={() => setModal(!modal)}
          dismiss={() => setModal(!modal)}
        >
          <TouchableWithoutFeedback onPress={() => setModal(!modal)}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                  >
                    Hata nedenini seçiniz
                  </Text>

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                  >
                    <Dropdown
                      style={[
                        styles.dropdown2,
                        isFocus && { borderColor: "blue" },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={arizaSebebi}
                      search
                      maxHeight={300}
                      labelField="STEXT"
                      valueField="PROBLEMTYPE"
                      placeholder={!isFocus ? "Arıza Kaynağı" : "..."}
                      searchPlaceholder="Ara..."
                      value={secilenArizaSebebi}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={(item) => {
                        setSecilenArizaSebebi(item.PROBLEMTYPE);

                        setIsFocus(false);
                      }}
                    />
                    <TextInput
                      value={yapilanIslem}
                      multiline={true}
                      numberOfLines={6}
                      onChangeText={setYapilanIslem}
                      style={styles.input}
                      placeholder="Açıklama giriniz"
                    />
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.buttons, { backgroundColor: "#dc3545" }]}
                      onPress={() => setModal(!modal)}
                    >
                      <Text style={styles.buttonText}>İptal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.buttons, { backgroundColor: "#007bff" }]}
                      onPress={() => {
                        addArizaSebepAciklama(yapilanIslem);
                        addArizaSebep(secilenArizaSebebi);
                        navigation.navigate("Ariza");
                      }}
                    >
                      <Text style={styles.buttonText}>SEÇ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={
          styles.placeholderStyle 
          }
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={materialList}
          search
          maxHeight={300}
          labelField="STEXT"
          valueField="MATERIAL"
          placeholder="Ürün Seç"
          searchPlaceholder="Search..."
          value={selectedMaterial}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setSelectedMaterial(item);
            setIsFocus(false);
          }}
        />
        <View>
          <Button title="ekle" onPress={addParcaHandler} />
        </View>
      </View>

      <FlatList
        style={styles.flatListContainer}
        data={combinedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.MATERIAL}
      />
  
    </View>
  );
};

export default JobParcaEkle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    marginHorizontal: 2,
    elevation: 2,
    borderRadius: 3,
    borderColor: "#fff",
    padding: 10,
    backgroundColor: "#fff",
  },
  itemsCell: {
    flex: 1,
    width: 100,
    textAlign: "left",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },

  button: {
    justifyContent: "center",
    padding: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    minWidth: 30,
    minHeight: 25,
  },

  buttonText: {
    fontSize: 24,
    color: "#000",
  },
  flatListContainer: {
    maxHeight: 250,
  },
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    width: 300,
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
  buttons: {
    // backgroundColor: "#008CBA",
    height: 50,
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 50,
  },

  dropdown2: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
    width: 220,
    margin: 5,
  },
  input: {
    height: 200,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
    width: 220,
    margin: 5,
    textAlignVertical: "top",
  },
});
