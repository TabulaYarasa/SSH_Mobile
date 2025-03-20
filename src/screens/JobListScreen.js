import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";

import React, { useEffect, useState } from "react";
import { ExpandableListItem } from "../components/JobListItems";
import { getChangeDate, parseDate } from "../utility/date";
import EditableStore from "../Stores/EditableStore";
import ServiceStore from "../Stores/ServiceStore";
import ParcalarStore from "../Stores/ParcalarStore";
import { callService } from "../../api/CallService";
import { startService } from "../../api/StartService";
import eskiParcalarStore from "../Stores/EskiParcalarStore";
import { Picker } from "@react-native-picker/picker";
import { subMonths, formatISO } from "date-fns";
import PersonelStore from "../Stores/PersonelStore";
import { is } from "date-fns/locale";
import Icon from 'react-native-vector-icons/Ionicons';

export default function JobListScreen({ navigation, route }) {
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [services, setServices] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setEditable } = EditableStore();
  const { storedService, setStoredService, changeStatus, setStadate } = ServiceStore();
  const { deleteAllMaterial } = ParcalarStore();

  const { addOldMaterials, deleteAllOldMaterial } = eskiParcalarStore();

  const [selectedValue, setSelectedValue] = useState("6");
  const [startDate, setStartDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const { currentPersonel } = PersonelStore();


  console.log("storedService", storedService);
  useEffect(() => {
    const now = new Date();
    setStartDate(subMonths(now, 6));
    setEditable(true);
    setStoredService([]);
    addOldMaterials([]);
    // handleCallServices(subMonths(now, 6));
  }, []);

  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    const now = new Date();
    let date = "";
    setStartDate(subMonths(now, +selectedValue));
    date = subMonths(now, +selectedValue);
    handleCallServices(date);
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  useEffect(() => {
    const now = new Date();
    let date = "";
    setStartDate(subMonths(now, +selectedValue));
    date = subMonths(now, +selectedValue);
    handleCallServices(date);
  }, [selectedValue]);

  const handleCallServices = async (stadate) => {
    setIsLoading(true);
    let personelSorguName = currentPersonel.USERNAME;
    if (currentPersonel.SYETKI == "1") {
      personelSorguName = "%";
    }
    try {
      const result = await callService(3, '%', stadate, personelSorguName);
      console.log("res: ",result)
      if (result) {
        console.log("result", result);
        if (result.length > 0) {
          setServices(result);
        } else {
          setServices([result]);
        }
      } else {
        //setServices([])
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    let sortedArray = [...services]; // Yeni bir dizi oluşturarak orijinal diziyi koruyun
    if (selectedSortOption === "tarih") {
      sortedArray.sort((a, b) => {
        const dateA = parseDate(a.CREATEDAT);
        const dateB = parseDate(b.CREATEDAT);
        return sortOrder === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
        //       return dateA - dateB;
      });
    }
    setSortedData(sortedArray); // Yeni sıralanmış diziyle state'i güncelleyin
  }, [selectedSortOption, navigation, services, sortOrder]);

  const selectOptionHandle = (title) => {
    // setSelectedSortOption(title);
    if (title === "tarih") {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    }
    setSelectedSortOption(title);
  };
  const handleStartService = () => {
    changeStatus("1");
    Alert.alert(
      "Uyarı",
      "Servisi Başlatmak istediğinizie emin misiniz?",
      [
        {
          text: "Hayır",
          onPress: () => changeStatus("0"),
          style: "cancel",
        },
        {
          text: "Evet",
          onPress: () => {
            CallStartService();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const CallStartService = async () => {
    //paction = 1 => status= 1 ve start date time = date now
    //2 =>  status = 2 ve enddate = date now
    //3 => işlem listesi gelmiş olacak

    //service num ve piAction mecburi
    try {
      const result = await startService(1, storedService.BREAKDOWNNUM);
  
      setStadate(result)
      if (result) {
        setIsVisible(!isVisible);
        navigation.navigate("JobTabs", {
          screen: "Info",
          params: { id: storedService, from: "NewJob" },
        });
      } else {
        Alert;
      }
    } catch (err) {
      Alert.alert("Uyarı", "Servis Başlatılamadı!!");
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <ActivityIndicator size="large" color="#393939" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <ExpandableListItem
      onPress={(id) => {
        setIsVisible(!isVisible);
        setStoredService(id);
      }}
      item={item}
    />
  );

  return (
    <>
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.sortContainer}>
            <Text>Sırala</Text>
            <TouchableOpacity
              onPress={() => {
                selectOptionHandle("tarih");
              }}
            >
              <View
                // style={[
                //   styles.sortOption,
                //   selectedSortOption == "tarih" && styles.selectedSortOption,
                // ]}
                style={[
                  styles.sortOption,
                  selectedSortOption === "tarih" && styles.selectedSortOption,
                ]}
              >
                <Text
                  style={{ 
                    color: selectedSortOption ? "white" : "black", 
                  }}
                >
                  Tarih  {sortOrder === "asc" ? <Icon name="arrow-up" size={15} color="#fff" /> : <Icon name="arrow-down" size={15} color="#fff" />}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                selectOptionHandle("öncelik");
              }}
            >
              <View style={{ marginRight: 120 }} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#ffffff",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#e0e0e0",
              overflow: "hidden",
              marginRight: 10,
              marginTop: 5,
            }}
          >
            <Picker
              style={{ height: 50, width: "100%" }}
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
            >
              <Picker.Item
                style={{ textAlign: "right" }}
                label="Son 1 Ay"
                value="1"
              />
              <Picker.Item
                style={{ textAlign: "right" }}
                label="Son 6 Ay"
                value="6"
              />
              <Picker.Item label="Son 1 Yıl" value="12" />
              <Picker.Item label="Son 2 Yıl" value="24" />
            </Picker>
          </View>
        </View>

        <FlatList
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          data={sortedData.length > 0 ? sortedData : services}
          // keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          // keyExtractor={(item, index) => index.toString()}
          // extraData={{ selectedSortOption, navigation, services }}
          // style={{ marginBottom: 60 }}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(!isVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(!isVisible)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Hızlı İşlem Menüsü
                </Text>

                {storedService.STATUS == 0 && (
                  <TouchableOpacity
                    android_ripple={{ color: "#ccc" }}
                    style={styles.modalButton}
                    onPress={() => {
                      setEditable(true);
                      handleStartService();
                    }}
                  >
                    <Text style={{ color: "white" }}>İşleme Başla</Text>
                  </TouchableOpacity>
                )}
                {storedService.STATUS != 0 && (
                  <TouchableOpacity
                    android_ripple={{ color: "#ccc" }}
                    style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                  >
                    <Text style={{ color: "white" }}>İşleme Başla</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    deleteAllMaterial("s");
                    setEditable(true);
                    deleteAllOldMaterial("s");
                    console.log("mobil basıldı");
                    navigation.navigate("JobTabs", {
                      screen: "Info",
                      params: { id: storedService, from: "CurrentJob" },
                    });
                    setIsVisible(false);
                  }}
                >
                  <Text style={{ color: "white" }}>Detay Göster</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    navigation.navigate("OldServices", {
                      id: storedService.CUSTOMER,
                    });
                    setIsVisible(false);
                  }}
                >
                  <Text style={{ color: "white" }}>Eski Servisleri Göster</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sortContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  sortOption: {
    backgroundColor: "white",
    padding: 7,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 50,
    marginLeft: 10,
  },
  selectedSortOption: {
    backgroundColor: "#488130",
  },
  modalContainer: {
    marginVertical: 10,
    flexDirection: "column",
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: "#488130",
    width: "100%",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
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
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 50,
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
    width: 220,
    margin: 5,
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
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
  // selectedSortOptionText: {
  //   color: "white",
  // },
});
