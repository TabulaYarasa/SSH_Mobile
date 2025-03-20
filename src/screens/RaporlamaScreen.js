import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { callService } from "../../api/CallService";
import PersonelStore from "../Stores/PersonelStore";
import { subMonths, formatISO, format,parse } from "date-fns";
import { Calendar } from "react-native-calendars";
import { Dropdown } from "react-native-element-dropdown";
import { callMntPersonel } from "../../api/CallMntPersonel";

export default function RaporlamaScreen() {
  const [totalServices, setTotalServices] = useState(0);

  const [selected, setSelected] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [value, setValue] = useState(null);

  const [selectedPeriod, setSelectedPeriod] = useState("1");
  const { currentPersonel } = PersonelStore();
  const [services, setServices] = useState([]);
  const [totalServicesCount, setTotalServicesCount] = useState();
  const [didntStarted, setDidnStarted] = useState(0);
  const [openServices, setOpenServices] = useState(0);
  const [closedServices, setClosedServices] = useState(0);
  const [garantiliServisler, setGarantiliServisler] = useState(0);
  const [garantisizServisler, setGarantisizServisler] = useState(0);
  const [modal, setModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [personelList, setPersonelList] = useState([]);
  const [formattedDate, setFormattedDate] = useState(null);
  const [gonderilenTarih, setGonderilenTarih] = useState(null);
  const [personel, setPersonel] = useState(null);
const[denemeMarked, setDenemeMarked] = useState([])
  useEffect(() => {
    const now = new Date();
    let date = "";
    if (selectedPeriod == "1") {
      date = subMonths(now, 1);
    } else if (selectedPeriod == "3") {
      date = subMonths(now, 3);
    } else if (selectedPeriod == "6") {
      date = subMonths(now, 6);
    } else if (selectedPeriod == "12") {
      date = subMonths(now, 12);
    }
    handleCallServices(date);
  }, [selectedPeriod, personel]);

  const handleCallServices = async (stadate) => {
    let personelSorguName = currentPersonel.CONTACT;

    if (personel) {
      personelSorguName = personel.PASSW;
      console.log(personelSorguName);
    }
    try {
      const result = await callService(5, "%", stadate, personelSorguName);
      if (result) {
        if (result.length > 0) {
          setServices(result);
          console.log(services);
        } else {
          setServices([result]);
        }
      } else {
        //setServices([])
      }
    } catch (err) {
      console.log("call servssicse error");
      console.log(err);
    }
  };

  console.log(services);

  const handleCallMntPersonel = async () => {
    try {
      const result = await callMntPersonel();
      if (result) {
        const personelListt = result.filter((personel) => {
          return personel.MODULE == "SERVIS";
        });

        console.log("çalısştısffas");
        setPersonelList(personelListt);
      } else {
        setPersonelList([]);
      }
    } catch (err) {
      console.log("error: ", err);
    }
  };

  useEffect(() => {
    handleCallMntPersonel();
  }, []);

  useEffect(() => {
    setTotalServicesCount(services.length);
    setDidnStarted(services.filter((service) => service.STATUS == "0").length);
    setOpenServices(services.filter((service) => service.STATUS == "1").length);

    setClosedServices(
      services.filter(
        (service) => service.STATUS == "2" || service.STATUS == "3"
      ).length
    );
  }, [services]);

  const markedDates = {};
 

  // useEffect(() => {
  //   console.log("girdi")
  //   services.forEach((item) => {
  //     let oldDataFormat = item.CLODATE.split(" ")[0]
  //     const date = parse(oldDataFormat, 'dd.MM.yyyy', new Date());
  //     const formattedDate = format(date, 'yyyy-MM-dd');

  //      markedDates[formattedDate] = { marked: true };
      
  //   });
  //   console.log("çıktı")
  
  // },[services,selectedPeriod,personel])

  services.forEach((item) => {
    let oldDataFormat = item.CLODATE.split(" ")[0]
    const date = parse(oldDataFormat, 'dd.MM.yyyy', new Date());
    const formattedDate = format(date, 'yyyy-MM-dd');

     markedDates[formattedDate] = { marked: true };
    
  });
  if (selected) {
    markedDates[selected] = { selected: true };
  }

  useEffect(() => {
    if (selected) {
      const formattedDate = format(new Date(selected), "dd.MM.yyyy");
      setFormattedDate(formattedDate);

      const dayService = services.filter(
        (service) => service.CLODATE.split(" ")[0] == formattedDate
      );
console.log("selected Date: ",selected)
      console.log("formasttedDate: ", formattedDate);
      //console.log(services.CLODATE[0].split(" "))
      console.log("day service: ", dayService);

      setGarantiliServisler(
        dayService.filter((service) => service.GARANTI == "1").length
      );
      setGarantisizServisler(
        dayService.filter((service) => service.GARANTI == "0").length
      );


    }
  }, [selected]);

  return (
    <View
      style={{ flex: 1, padding: 20, paddingTop: 40, backgroundColor: "white" }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Teknik Servis Raporlama Ekranı
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (currentPersonel.SYETKI == "1") {
            setModal(!modal);
          }
        }}
      >
        <Text>Kullanıcı Bilgileri:</Text>
        <Text>
          Kullanıcı Adı: {personel ? personel.USERS : currentPersonel.DISPLAY}
        </Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "1" && styles.selectedButton,
          ]}
          onPress={() => setSelectedPeriod("1")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === "1" && styles.selectedText,
            ]}
          >
            Son 1 Ay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "3" && styles.selectedButton,
          ]}
          onPress={() => setSelectedPeriod("3")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === "3" && styles.selectedText,
            ]}
          >
            Son 3 Ay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "6" && styles.selectedButton,
          ]}
          onPress={() => setSelectedPeriod("6")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === "6" && styles.selectedText,
            ]}
          >
            Son 6 Ay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "12" && styles.selectedButton,
          ]}
          onPress={() => setSelectedPeriod("12")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === "12" && styles.selectedText,
            ]}
          >
            Son 1 Yıl
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 18 }}>
        Servis İstatistikleri:
      </Text>
      <Text>Toplam Servis Sayısı: {totalServicesCount}</Text>
      <Text>Başlanmamış Servis Sayısı: {didntStarted}</Text>
      <Text>Açık Servis Sayısı: {openServices}</Text>
      <Text>Tamamlanan Servis Sayısı: {closedServices}</Text>

      <Calendar
        onDayPress={(day) => {
          setSelected(day.dateString);
          markedDates[day.dateString] = { selected: true };
        }}
        firstDay={1}
        markedDates={markedDates}
      />
      <View>
        <Text style={{ marginTop: 20, fontWeight: "bold" }}>
          Günlük Tamamlanan Servisler{" "}
        </Text>
        <Text>
          Garantili Şekilde Tamamlanan Servis Adedi: {garantiliServisler}
        </Text>
        <Text>
          Garantisiz Şekilde Tamamlanan Servis Adedi: {garantisizServisler}
        </Text>
      </View>
      <Modal animationType="slide" transparent visible={modal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
              Raporunu Görmek İstediğiniz Kişi
            </Text>

            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={personelList}
                search
                maxHeight={300}
                labelField="USERS"
                valueField="USERS"
                placeholder={!isFocus ? "2. Kişi" : "..."}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setPersonel(item);
                  setIsFocus(false);
                }}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.buttons, { backgroundColor: "#dc3545" }]}
                onPress={() => {
                  setModal(!modal);
                }}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModal(!modal);
                }}
                style={[styles.buttons, { backgroundColor: "#007bff" }]}
              >
                <Text style={styles.buttonText}>SEÇ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
  },
  selectedText: {
    color: "white",
  },
  centeredView: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
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
  buttons: {
    // backgroundColor: "#008CBA",
    height: 50,
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText2: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
