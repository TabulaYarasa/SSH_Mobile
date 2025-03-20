import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { DUMMY_DATES } from "../utility/Dummy_datas";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { ExpandableListItem } from "../components/JobListItems";

import api from "../../api/api";
import { convertDateFormat, deleteClock } from "../utility/date";
import { Dropdown } from "react-native-element-dropdown";
import { montajList } from "../../api/MontajList";
import { ExpandableJobItem } from "../components/MontajListItems";
import MontajStore from "../Stores/MontajStore";
import ServiceStore from "../Stores/ServiceStore";
import PersonelStore from "../Stores/PersonelStore";

export default function MontajListScreen({ navigation, route }) {
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [baseData, setBaseData] = useState(DUMMY_DATES);
  const [sortedData, setSortedData] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalCustomer, setModalCustomer] = useState("");
  const [services, setServices] = useState([]);
  const [modal, setModal] = useState(false);
  const [montajListItems, setMontajListItems] = useState([]);

  const {storedMontaj,setStoredmontaj} = MontajStore()
  const { storedService, setStoredService, changeStatus } = ServiceStore();
  const {currentPersonel} = PersonelStore()


  useEffect(() => {
    

      handleCallMontajList();
    
  }, []);

 
    const MontajOnayStart = async () => {
      console.log("MontajOnayStart");
      try {
        const response = await api
          .post("/Montaj/MontajOnayStart  ", {
            trackingno: storedMontaj.TRACKINGNO,
            workorderno: storedMontaj.WORKORDERSNO,
           
          
          })
          .then((response) => {
            console.log(response.data);
          });
      } catch (err) {
        console.log("Montaj Onay: ", err);
      }
    };

 




  const handleCallMontajList = async () => {
    let contactNum = currentPersonel.CONTACT
    if(currentPersonel.MYETKI == "1") {
     contactNum = "%"
    }
    try {
      const result = await montajList(1,"%",contactNum);
      if (result) {
        if (result.length > 0) {
          setMontajListItems(result);
        } else {
          setMontajListItems([result]);
        }
      } else {
        //setServices([])
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    let sortedArray = [...services]; // Yeni bir dizi oluşturarak orijinal diziyi koruyun
    if (selectedSortOption == "tarih") {
      console.log(selectedSortOption);
      sortedArray.sort((a, b) => {
        const dateA = new Date(deleteClock(a.REPORTEDAT));
        const dateB = new Date(deleteClock(b.REPORTEDAT));

        return dateA - dateB;
      });
    }
    setSortedData(sortedArray); // Yeni sıralanmış diziyle state'i güncelleyin
  }, [selectedSortOption, navigation, services]);

  const selectOptionHandle = (title) => {
    setSelectedSortOption(title);
  };

  const handleStart =()=> [
    MontajOnayStart(),

    navigation.navigate("MontajTabs", {
      screen: "MontajInfo",
     
    })
  ]

  const renderItem = ({ item }) => (
    <ExpandableJobItem
      onPress={(id) => {
        setStoredmontaj(id)
        setIsVisible(!isVisible)
        
      }}
      item={item}
    />
  );


 console.log(storedMontaj)
  return (
    <>
      <View>
        <View style={styles.sortContainer}>
          <Text>Sırala</Text>
          <TouchableOpacity
            onPress={() => {
              selectOptionHandle("tarih");
            }}
          >
            <View
              style={[
                styles.sortOption,
                selectedSortOption == "tarih" && styles.selectedSortOption,
              ]}
            >
              <Text style={selectedSortOption == "tarih" && { color: "white" }}>
                Tarih
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              selectOptionHandle("öncelik");
            }}
          >
            <View
              style={[
                styles.sortOption,
                selectedSortOption == "öncelik" && styles.selectedSortOption,
              ]}
            >
              <Text
                style={selectedSortOption == "öncelik" && { color: "white" }}
              >
                Öncelik
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={montajListItems}
          // keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          extraData={{ selectedSortOption, navigation, services }}
          style={{ marginBottom: 60 }}
        />
      </View>
      <Modal
        animationType="fade"
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
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
                >
                  Hızlı İşlem Menüsü
                </Text>
                {storedMontaj.ISBASLANGICTARIHI  == "01.01.1975 00:00:00" &&
                <TouchableOpacity
                  android_ripple={{ color: "#ccc" }}
                  style={styles.modalButton}
                  onPress={() => handleStart()}
                >
                  <Text style={{ color: "white" }}>İşleme Başla</Text>
                </TouchableOpacity>
                  }
                     {storedMontaj.ISBASLANGICTARIHI  != "01.01.1975 00:00:00" &&
                <TouchableOpacity
                  android_ripple={{ color: "#ccc" }}
                  style={[
                    styles.modalButton,
                    { backgroundColor: "#ccc" },
                  ]}
                  onPress={() => handleStart()}
                >
                  <Text style={{ color: "white" }}>İşleme Başla</Text>
                </TouchableOpacity>
                  }
                  
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    navigation.navigate("MontajTabs", {
                      screen: "MontajInfo",
                     
                    });
                    setIsVisible(false);
                  }}
                >
                  <Text style={{ color: "white" }}>Detay Göster</Text>
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
});
