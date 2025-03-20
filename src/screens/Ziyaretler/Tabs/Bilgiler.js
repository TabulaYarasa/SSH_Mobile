import {
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  MaterialIcons,
  Entypo,
  EvilIcons,
} from "@expo/vector-icons";

import useZiyaretStore from "../../../Stores/ZiyaretStore";

const Bilgiler = () => {
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [degisenDeger, setDegisenDeger] = useState(null);
  const [data, setData] = useState(null);
  const [textData, setTextData] = useState(null);
  const [personelList, setPersonelList] = useState([]);
  const [bdowner, setBdowner] = useState("");
  const [statuList, setStatuList] = useState([]);
  const [statu, setStatu] = useState([]);
  const [statusDetailText, setStatusDetailText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const musteriData = useZiyaretStore((state) => state.musteriStore);
  console.log("Stored customer data:", musteriData);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      musteriData.ADDRESSLINE1
    )}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.view}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent2}>
          <View style={{ flexDirection: "row" }}>
            <AntDesign name="playcircleo" size={24} color="black" />
            <Text style={styles.title}>İs Türü:</Text>
            <Text style={styles.text}>ZİYARET</Text>
          </View>
        
        </View>
       
      </View>
      <View>
        <View
          style={{ marginTop: 5, borderBottomWidth: 1, borderColor: "#dbd8d8" }}
        ></View>
        <TouchableOpacity
          android_ripple={{ color: "#ccc" }}
          onPress={() => {
            setIsInfoVisible(!isInfoVisible);
          }}
        >
          <View style={styles.customerHeader}>
            <View
              style={{ alignItems: "center", flexDirection: "row", gap: 10 }}
            >
              <Entypo name="list" size={24} color="black" />
              <Text style={{ fontWeight: "bold" }}>Ziyaret Bilgileri</Text>
            </View>
            <View>
              <EvilIcons
                name={isInfoVisible ? "chevron-up" : "chevron-down"}
                size={50}
                color="black"
              />
            </View>
          </View>
        </TouchableOpacity>
        {isInfoVisible && (
          <>
            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.infoTitle}>Müşteri adı</Text>
                <Text>{musteriData.NAME1}</Text>
              </View>
              <View style={styles.left}>
                <Text style={[styles.infoTitle, { textAlign: "right" }]}>
                  Personel
                </Text>
                <Text style={{ textAlign: "right" }}>s</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.infoTitle}></Text>
                <Text></Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.infoTitle}>EKLENECEK</Text>
                <Text>EKLENECEK</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.infoTitle}>Arayan Kişi</Text>
                <Text>TEL NO</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.infoTitle}>Servis Kaydı Açan Kişi</Text>
                <Text style={{ textAlign: "right" }}>EKLENİR</Text>
              </View>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.left}
                onPress={() => handleChange("tel")}
              >
                <Text style={styles.infoTitle}>Arayan Kişi Telefon</Text>
                <Text style={{ textAlign: "left" }}>TEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={openGoogleMaps}
                style={[styles.right, { maxWidth: "50%" }]}
              >
                <Text style={[styles.infoTitle, { textAlign: "right" }]}>
                  Adres
                </Text>
                <Text style={{ textAlign: "right" }}>
                  {musteriData.ADDRESSLINE1}
                </Text>
                {/* <Text style={{ textAlign: "right" }}>
                  {storedService.ADDRESS2}
                </Text> */}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default Bilgiler;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  headerContainer: {
    borderColor: "#dbd8d8",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  headerContent2: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    justifyContent: "space-between",
  },
  headerContent: {
    maxWidth: "80%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  title: {
    fontWeight: "bold",
    color: "green",
    marginLeft: 10,
    marginRight: 5,
  },
  infoTitle: {
    fontWeight: "bold",
    color: "green",
  },
  text: {},
  customerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    maxWidth: "60%",
  },
  right: {
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});
