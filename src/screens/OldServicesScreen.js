import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import React, { useEffect, useState } from "react";

import { ExpandableListItem } from "../components/JobListItems";

import { deleteClock } from "../utility/date";

import EditableStore from "../Stores/EditableStore";

import { callService } from "../../api/CallService";
import ServiceStore from "../Stores/ServiceStore";
import { Picker } from "@react-native-picker/picker";
import { subMonths, formatISO } from "date-fns";
import eskiParcalarStore from "../Stores/EskiParcalarStore";
export default function OldServicesScreen({ navigation, route }) {
  const [selectedSortOption, setSelectedSortOption] = useState("");

  const [sortedData, setSortedData] = useState([]);
  const [modalCustomer, setModalCustomer] = useState("");
  const [services, setServices] = useState([]);
  const [modal, setModal] = useState(false);

  const { setEditable } = EditableStore();
  const { setStoredService } = ServiceStore();
  const [selectedValue, setSelectedValue] = useState("6");
  const [startDate, setStartDate] = useState("");
  const { addOldMaterials } = eskiParcalarStore();
  const { id } = route.params;

  console.log("id", id);

  useEffect(() => {
    const now = new Date();
    setStartDate(subMonths(now, 6));

    setStoredService([]);
    setEditable(false);
    addOldMaterials([]);
    //handleCallServices();
  }, []);
  useEffect(() => {
    const now = new Date();
    let date = "";
    if (selectedValue == "6") {
      setStartDate(subMonths(now, 6));
      date = subMonths(now, 6);
    } else if (selectedValue == "12") {
      setStartDate(subMonths(now, 12));
      date = subMonths(now, 12);
    } else if (selectedValue == "24") {
      setStartDate(subMonths(now, 24));
      date = subMonths(now, 24);
    }
    handleCallServices(date);
  }, [selectedValue]);

  const handleCallServices = async (stadate) => {
    try {
      const result = await callService(2, `${id}%`, stadate, "%");
      if (result) {
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
    }
  };

  useEffect(() => {
    let sortedArray = [...services]; // Yeni bir dizi oluşturarak orijinal diziyi koruyun
    if (selectedSortOption == "tarih") {
      //console.log(selectedSortOption);
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

  const renderItem = ({ item }) => (
    <ExpandableListItem
      onPress={(id) => {
        setStoredService(id);
        navigation.navigate("JobTabs", {
          screen: "Info",
          params: { id: modalCustomer, from: "OldJob" },
        });
        setModalCustomer(id);
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
                style={[
                  styles.sortOption,
                  selectedSortOption == "tarih" && styles.selectedSortOption,
                ]}
              >
                <Text
                  style={selectedSortOption == "tarih" && { color: "white" }}
                >
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
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
            >
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
          data={sortedData}
          // keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          extraData={{ selectedSortOption, navigation, services }}
          style={{ marginBottom: 60 }}
        />
      </View>
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
});
