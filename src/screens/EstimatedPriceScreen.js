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

import api from "../../api/api";

import ParcalarStore from "../Stores/ParcalarStore";

import { el } from "date-fns/locale";

const EstimatedPriceScreen = ({ navigation }) => {
  const [isFocus, setIsFocus] = useState(false);

  const [MAINMATGRP, setMAINMATGRP] = useState(null);
  const [MATTYPE, setMATTYPE] = useState("%");
  const [MATGRP, setMATGRP] = useState(null);

  const [materialList, setMaterialList] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [parcalar, setParcalar] = useState([]);
  const [modal, setModal] = useState(false);

  const [valueSelect, setValueSelect] = useState([]);
  const [listData, setListData] = useState([]);
  const [id0, setId0] = useState([]);
  const [id1, setId1] = useState([]);
  const [id2, setId2] = useState([]);
  const [yapilanIslem, setYapilanIslem] = useState("");
  const [arizaSebebi, setArizaSebebi] = useState([]);
  const [degistirelecekFiyat, setDegistirilecekFiyat] = useState("");
  //const [modal, setModal] = useState(false)
  // console.log("mainmatgrp: ", MAINMATGRP);
  // console.log("mattype: ", MATTYPE);
  // console.log("matgrp: ", MATGRP);
  const {
    materials,
    addMaterials,
    increaseMaterial,
    deleteAllMaterial,
    decreaseMaterial,
    deleteMaterial,
    servisHizmetleri,
    addServis,
    increaseServis,
    decreaseServis,
    deleteServis,
    deleteAllServis,
    changePrice,
  } = ParcalarStore();

  // console.log(servisHizmetleri);
  //console.log(JSON.stringify(materials,null,2));
  useEffect(() => {
    deleteAllMaterial("s");
    deleteAllServis("s");
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      // Geri tuşuna basıldığında yapılacak işlemler burada tanımlanır
      console.log("Geri tuşuna basıldı");
      deleteAllMaterial("s");
      navigation.navigate("Home");
      return true; // true döndürerek geri tuşunu yakalayın
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Temizlik işlemi
  }, []);
  // console.log("mat type: ", MATTYPE);
  // console.log("MATGRP: ", MATGRP);
  // console.log("MAINMATGRP: ", MAINMATGRP);

  useEffect(() => {
    const handleCheckID1 = async () => {
      console.log("sorgu id1");
      try {
        const response = await api
          .post("/CallMaterialClasses", {
            id: "1",
            MATGRP: "%",
          })
          .then((response) => {
            if (response) {
              setId1(response.data.TMPTABLE.ROW);
            } else {
              setId1([]);
            }
          });
      } catch (err) {
        console.log("id1 sorgu: ", err);
      }
    };
    if (MATTYPE) {
      handleCheckID1();
    }
  }, [MATTYPE]);

  useEffect(() => {
    const handleCheckID2 = async () => {
      console.log("sorgu id2");
      try {
        const response = await api
          .post("/CallMaterialClasses", {
            id: "2",
            MATGRP: MAINMATGRP,
          })
          .then((response) => {
            if (response.data.TMPTABLE) {
              if (response.data.TMPTABLE.ROW.length > 1) {
                console.log("sorgu 2 cevap");
                setId2(response.data.TMPTABLE.ROW);
                console.log(response.data.TMPTABLE.ROW.length);
                console.log("sorgu 2 cesvap");
              } else {
                setId2([response.data.TMPTABLE.ROW]);
                console.log([response.data.TMPTABLE]);
              }
            } else {
              setId2([]);
            }
          });
      } catch (err) {
        console.log("id2: ", err);
      }
    };

    if (MAINMATGRP) {
      handleCheckID2();
    }
  }, [MAINMATGRP]);

  useEffect(() => {
    const handleCheckList = async () => {
      try {
        console.log("sorgu material list");
        const response = await api
          .post("/CallMaterialList", {
            mattype: "%",
            matgrp: MATGRP,
            matmaingrp: MAINMATGRP,
            vendor: "10004230",
          })
          .then((response) => {
            //   console.log(response.data);
            console.log("son sorgu");
            if (response.data.TMPTABLE) {
              if (response.data.TMPTABLE.ROW.length > 1) {
                    setMaterialList(response.data.TMPTABLE.ROW);
              } else {
                  setMaterialList([response.data.TMPTABLE.ROW]);
              }
            } else {
              setMaterialList([])
            }
          });
      } catch (err) {
        console.log("material list: ", err);
      }
    };
    if (MATGRP) {
      handleCheckList();
    }
  }, [MATGRP]);

  const addParcaHandler = () => {
    if (selectedMaterial) {
      const existingItem = listData.find(
        (i) => i.MATERIAL === selectedMaterial.MATERIAL
      );
      if (existingItem) {
        handleAdd(existingItem.MATERIAL);
      } else {
        if (selectedMaterial.MATGRP == "SERVİS") {
          addServis({ ...selectedMaterial, count: 1 });
        } else {
          addMaterials({ ...selectedMaterial, count: 1 });
        }
        //  addMaterials({ ...selectedMaterial, count: 1 });
        setListData([...listData, { ...selectedMaterial, count: 1 }]);
      }
    } else {
      Alert.alert("UYARI", "Malzeme seçilmesi gerekmektedir");
    }
  };

  // -------------------------------------------

  useEffect(() => {
    const groupedData = parcalar.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.MATERIAL === item.MATERIAL);
      if (existingItem) {
        existingItem.count++;

        //  increaseMaterial(existingItem.MATERIAL)
      } else {
        acc.push({ ...item, count: 1 });
        //  addMaterials( { ...item, count: 1 })
      }
      return acc;
    }, []);
    setListData(groupedData);
  }, []);
  // -------------------------------------------

  const handleAdd = (MATERIAL) => {
    if (selectedMaterial) {
      const newListData = listData.map((item) => {
        if (item.MATERIAL === MATERIAL) {
          if (item.MATGRP == "SERVİS") {
            increaseServis(MATERIAL);
          } else {
            increaseMaterial(MATERIAL);
          }

          // Eşleşen öğenin count değerini artır
          return { ...item, count: item.count + 1 };
        }
        return item;
      });

      setListData(newListData);
    }
  };

  const handleMinus = (MATERIAL) => {
    const newListData = listData.map((item) => {
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

    setListData(newListData);
  };

  const handleDelete = (MATERIAL) => {
    const newListData = listData.filter((item) => item.MATERIAL !== MATERIAL);
    const newStoreData = listData.map((item) => {
      if (item.MATGRP == "SERVİS") {
        deleteServis(MATERIAL);
      } else {
        deleteMaterial(MATERIAL);
      }
    });

    setListData(newListData);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemsCell}>
          <View style={{ maxWidth: "60%" }}>
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
              <Text style={{ fontWeight: "bold" }}>{item.count}</Text>
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
      <TouchableOpacity
        style={{ alignItems: "flex-end" }}
        onPress={() => setModal(!modal)}
      >
        <Text>değiştir</Text>
      </TouchableOpacity>
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={
            MATTYPE ? styles.placeholderStyle : { color: "#ccc" }
          }
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={id1}
          search
          disable={MATTYPE ? false : true}
          maxHeight={300}
          labelField="STEXT"
          valueField="MAINMATGRP"
          placeholder={
            MATTYPE ? "Malzeme Ana Grubu" : "Önce Malzeme Tipi Seçiniz"
          }
      
          searchPlaceholder="Search..."
          value={MAINMATGRP}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setMAINMATGRP(item.MAINMATGRP);
            setMATGRP(null)
            setSelectedMaterial(null)
            setIsFocus(false);
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={
            MAINMATGRP ? styles.placeholderStyle : { color: "#ccc" }
          }
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={id2}
          search
          disable={MAINMATGRP ? false : true}
          maxHeight={300}
          labelField="STEXT"
          valueField="MATGRP"
          placeholder={
            MATTYPE ? "Malzeme Ana Grubu" : "Önce Malzeme Grubu Seçiniz"
          }
          searchPlaceholder="Search..."
          value={MATGRP}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setMATGRP(item.MATGRP);
            setSelectedMaterial(null)
            setIsFocus(false);
          }}
        /> 
         <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={
            MATGRP ? styles.placeholderStyle : { color: "#ccc" }
          }
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={materialList}
          search
          disable={MATGRP ? false : true}
          maxHeight={300}
          labelField="STEXT"
          valueField="MATERIAL"
          placeholder={MATGRP ? "Ürün Seç" : "Önce Malzeme Ana Grubu Seçiniz"}
          searchPlaceholder="Search..."
          value={selectedMaterial}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setSelectedMaterial(item);
            setIsFocus(false);
          }}
        />
        {/* <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={
            MATGRP ? styles.placeholderStyle : { color: "#ccc" }
          }
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={id2}
          search
          disable={MATGRP ? false : true}
          maxHeight={300}
          labelField="STEXT"
       //   valueField="MATERIAL"
          placeholder={MATGRP ? "Ürün Seç" : "Önce Malzeme Ana Grubu Seçiniz"}
          searchPlaceholder="Search..."
          value={selectedMaterial}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setSelectedMaterial(item);
            setIsFocus(false);
          }}
        />  */}
        <View>
          <Button title="ekle" onPress={addParcaHandler} />
        </View>
      </View>

      <FlatList
        style={styles.flatListContainer}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.MATERIAL}
      />
      <Modal animationType="slide" transparent visible={modal}>
        <TouchableWithoutFeedback onPress={() => setModal(!modal)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}
                >
                  Fiyatını değiştirmek istediğiniz servisi seçin
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
                    data={servisHizmetleri}
                    maxHeight={300}
                    labelField="STEXT"
                    valueField="PRICE"
                    placeholder={
                      degistirelecekFiyat ? "Servis Seçin" : "Servis Seçin"
                    }
                    value={degistirelecekFiyat}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setDegistirilecekFiyat(item);

                      setIsFocus(false);
                    }}
                  />
                  <TextInput
                    value={yapilanIslem}
                    onChangeText={setYapilanIslem}
                    style={styles.input}
                    inputMode="numeric"
                    placeholder="Fiyat "
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
                      setModal(!modal);
                      setYapilanIslem("");
                      changePrice(degistirelecekFiyat, yapilanIslem);
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
    </View>
  );
};

export default EstimatedPriceScreen;

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
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
    width: 220,
    margin: 5,
  },
});
