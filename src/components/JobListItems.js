import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import {
  getFormattedDate,
  getChangeDate,
  deleteClock,
  convertDateFormat,
} from "../utility/date";
import ParcalarStore from "../Stores/ParcalarStore";
import ServiceStore from "../Stores/ServiceStore";
import PersonelStore from "../Stores/PersonelStore";
// import {TouchableOpacity, TouchableHighlight} from "react-native-gesture-handler"

export const ExpandableListItem = ({ item, onPress }) => {
  const [expanded, setExpanded] = useState(false);

  const{currentPersonel} = PersonelStore()

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const handlePress = () => {
    onPress(item);
  };

  const date = new Date();

  // const date1= "24.4.2024"s
  // const date2= "26.03.2024"
  // console.log("sorgu: ",date1<date2)
  //console.log( date)
  //console.log(deleteClock(item.REPORTEDAT),"//",Math.floor((getChangeDate(item.REPORTEDAT)-date) / (1000 * 60 * 60 * 24)))
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        android_ripple={{ color: "#ccc", borderless: true }}
        onPress={toggleExpand}
        style={{ padding: 10 }}
      >
        <View style={styles.baseContainer}>
          <View style={{ width: "50%" }}>
            <Text style={styles.bold}>{item.NAME1}</Text>
            <Text>{item.PROBDESCRS}</Text>
            {currentPersonel.SYETKI == "1" && 
            <Text>Atanan Kişi:  {item.BDOWNER}</Text>
            }
             <Text>{item.BREAKDOWNNUM}</Text>
          </View>
          <View style={styles.rightSide}>
            <View>
              <Text style={styles.bold}>Atanma Tarihi</Text>
              <Text>{deleteClock(item.TECDATE)}</Text>
              <Text>Durum:
              {item.STATUS === "0" && "Başlamadı"}
                  {item.STATUS === "1" && "Başladı"}
                  {item.STATUS === "2" && "Sonlandırıldı"}
                  {item.STATUS === "3" && "Tamamlandı"} 
                  </Text> 
            </View>
            <View>
              <EvilIcons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={50}
                color="black"
              />
            
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      Math.floor(
                        (getChangeDate(item.CREATEDAT) - date) /
                          (1000 * 60 * 60 * 24)
                      ) < -3 && item.STATUS === "0"
                        ? "#FFD700"
                        : Math.floor(
                            (getChangeDate(item.CREATEDAT) - date) /
                              (1000 * 60 * 60 * 24)
                          ) >= -3 && item.STATUS === "0"
                        ? "#0000FF"
                        : Math.floor(
                            (getChangeDate(item.CREATEDAT) - date) /
                              (1000 * 60 * 60 * 24)
                          ) < -3 && item.STATUS === "1"
                        ? "#FF0000"
                        : "#008000",
                  },
                ]}
              />
              
            </View>
          </View>
        </View>
        {expanded && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.detailButton} onPress={handlePress}>
              <Text style={{ color: "white" }}>Detay Göster</Text>
            </TouchableOpacity>
          
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 10,
    marginVertical: 6,
    marginHorizontal: 10,
    elevation: 4,
    borderRadius: 20,
    borderColor: "#fff",

    backgroundColor: "#fff",
  },
  baseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rightSide: {
    flexDirection: "row",
  },
  buttonContainer: {
    alignItems: "center",
  },
  detailButton: {
    backgroundColor: "#65B741",
    borderRadius: 20,
    padding: 10,
  },
  dot: {
    alignSelf: "flex-end",
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 10,
  },
  modalButton: {
    backgroundColor: "#488130",
    width: "100%",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
});
