import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Linking,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  MaterialIcons,
  Entypo,
  EvilIcons,
  Feather,
} from "@expo/vector-icons";
import ServiceStore from "../../Stores/ServiceStore";
import { Dropdown } from "react-native-element-dropdown";
import { UpdateSrv } from "../../utility/UpdateSrv";
import EditableStore from "../../Stores/EditableStore";
import { startService } from "../../../api/StartService";
import eskiParcalarStore from "../../Stores/EskiParcalarStore";
import Toast from "react-native-toast-message";
import PersonelStore from "../../Stores/PersonelStore";
import { callMntPersonel } from "../../../api/CallMntPersonel";
import api from "../../../api/api";
import { format, set } from "date-fns";

export default function JobsInfo({ navigation, route }) {
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
  const [newStadate, setNewStadate] = useState(null);

  const {
    storedService,
    setStoredService,
    changeWarranty,
    changeTelNum,
    changeStatus,
    changeBdOwner,
    changeStadate,
    setStadate,
    stadate,
    changeMntStatu,
  } = ServiceStore();
  const { currentPersonel } = PersonelStore();

  const { editable } = EditableStore();
  const { addOldMaterials } = eskiParcalarStore();
  const { id } = route.params;

  const now = new Date();
  const formattedDate = format(now, "yyyy-MM-dd'T'HH:mm:ss");


  useEffect(() => {
    callStatu();


  }, []);

  const resimToast = () => {
    Toast.show({
      type: "success",
      text1: "Başarılı",
      text2: "Güncelleme Başarıyla Gerçekleştirildi",
      topOffset: 100,
    });
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      storedService.ADDRESS1
    )}`;
    Linking.openURL(url);
  };


  const handleSave = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const formattedDate = format(now, "yyyy-MM-dd'T'HH:mm:ss");

      const isBdownerChanged =
        storedService.BDOWNER !== bdowner.NAME && bdowner.NAME !== null;
      const result = await UpdateSrv(
        storedService,
        stadate,
        isBdownerChanged ? formattedDate : null,
        bdowner.NAME
      );
      console.log("isBDowner change: ", isBdownerChanged);
      if (result) {
        console.log("update başarılı");
        resimToast();
        changeBdOwner(bdowner.NAME);
      } else {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
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
            CallStartService(1);
          },
        },
      ],
      { cancelable: true }
    );
  };

  //CallMnt007
  const callStatu = async () => {
    try {
      const result = await api.post("/CallMnt007");
      setStatuList(result.data.IASMNT007TMP.ROW);

    } catch (err) {
      console.log("bir tur error girdi")
      console.error(err);
    }
  };

  useEffect(() => {
    const matchingStatu = statuList.find(
      (statu) => statu.STATUSDETAIL == storedService.STATUSDETAIL
    );
    const statusDetailTextt = matchingStatu ? matchingStatu.STEXT : " ";

    setStatusDetailText(statusDetailTextt);
  }, [statu, statuList, modal3]);

  const CallStartService = async (piAction) => {
    //paction = 1 => status= 1 ve start date time = date now
    //2 =>  status = 2 ve enddate = date now
    //3 => işlem listesi gelmiş olacak

    //service num ve piAction mecburi

    try {
      if (piAction == 1) {
        const result = await startService(piAction, storedService.BREAKDOWNNUM);
        setStadate(result);
        changeStadate(result);
        setNewStadate(result);

        console.log( result);
        console.log("Güncellenen storedService:", storedService);

      }
    } catch (err) {
      Alert.alert("Uyarı", "Servisi Başlatılamadı!!");

      console.log(err);
    }
  };

  const callNumber = (phoneNumber) => {
    const url = `tel:0${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Telefon araması desteklenmiyor.");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Hata:", err));
  };

  const handleCallMntPersonel = async () => {
    try {
      const result = await callMntPersonel();
      
      if (result) {
        const ownerPersonel = result.filter((personel) => {
          return personel.MODULE == "SERVIS";
        });

        setPersonelList(result);
      } else {
        setPersonelList([]);
      }
    } catch (err) {
      console.log("error: ", err);
    }
  };

  return (
    <View style={styles.view}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent2}>
          <View style={{ flexDirection: "row" }}>
            <AntDesign name="playcircleo" size={24} color="black" />
            <Text style={styles.title}>İs Türü:</Text>
            <Text style={styles.text}>SERVİS</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setModal3(!modal3);
            }}
            style={{}}
          >
            <Text style={[styles.title, { textAlign: "center" }]}>
              Statü Durumu
            </Text>
            <Text style={{ textAlign: "center" }}>{statusDetailText}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <MaterialIcons name="topic" size={24} color="black" />
          <Text style={styles.title}>Arıza:</Text>
          <Text style={styles.text}>{storedService.PROBDESCRS}</Text>
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
              <Text style={{ fontWeight: "bold" }}>Servis Bilgileri</Text>
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
                <Text>{storedService.NAME1}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (currentPersonel.SYETKI == "1") {
                    handleCallMntPersonel();
                    setModal2(!modal2);
                  }
                }}
                style={styles.right}
              >
                <Text style={[styles.infoTitle, { textAlign: "right" }]}>
                  Personel
                </Text>
                <Text style={{ textAlign: "right" }}>
                  {bdowner ? bdowner.NAME : storedService.BDOWNER}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.infoTitle}>Kayıt Tarihi</Text>
                <Text>{storedService.CREATEDAT}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.infoTitle}>Servis Kaydı Açan Kişi</Text>
                <Text style={{ textAlign: "right" }}>
                  {storedService.REPORTEDTO}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.left}
                //  onPress={() => handleChange("tel")}
              >
                <Text style={styles.infoTitle}>Arayan Kişi Telefon</Text>
                <Text style={{ textAlign: "left" }}>
                  {storedService.ARAYANTELNUM}
                </Text>
              </TouchableOpacity>
              <View style={styles.right}>
                <Text style={[styles.infoTitle, { textAlign: "right" }]}>
                  Tel No
                </Text>
                <Text style={{ textAlign: "right" }}>
                  {storedService.TELNUM}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.infoTitle}>İşleme Başlandı mı</Text>
                <Text>
                  {storedService.STATUS === "0" && "Başlamadı"}
                  {storedService.STATUS === "1" && "Başladı"}
                  {storedService.STATUS === "2" && "Sonlandırıldı"}
                  {storedService.STATUS === "3" && "Tamamlandı"}
                </Text>
              </View>

              <View style={styles.right}>
                <Text style={[styles.infoTitle, { textAlign: "right" }]}>
                  Mail Adresi
                </Text>
                <Text style={{ textAlign: "right" }}>
                  {storedService.EMAIL}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.infoTitle}>İşleme Başlama Tarihi</Text>
                <Text>
                {storedService.STADATE && storedService.STADATE !== "01.01.1975 00:00:00" 
    ? storedService.STADATE 
    : ""}
                </Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.infoTitle}>İşlemi Bitirme Tarihi</Text>
                <Text style={{ textAlign: "right" }}>
                  {storedService.CLODATE == "01.01.1975 00:00:00"
                    ? ""
                    : storedService.CLODATE}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.left}></View> 

              <TouchableOpacity onPress={openGoogleMaps} style={styles.right}>
                <Text style={[styles.infoTitle, { textAlign: "right" }]}>
                  Adres
                </Text>
                <Text style={{ textAlign: "right" }}>
                  {storedService.ADDRESS1}
                </Text>
                {/* <Text style={{ textAlign: "right" }}>
                  {storedService.ADDRESS2}
                </Text> */}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modal}
        onRequestClose={() => {
          setModal(!modal);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModal(!modal)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  {data && (
                    <>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          marginBottom: 5,
                        }}
                      >
                        Garanti Durumu Seçiniz
                      </Text>
                      <Dropdown
                        style={[
                          styles.dropdown2,
                          isFocus && { borderColor: "blue" },
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data}
                        maxHeight={300}
                        labelField="text"
                        valueField="value"
                        placeholder={"Garanti Durumu Seçin"}
                        // value={degisenDeger}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(item) => {
                          setDegisenDeger(item);

                          setIsFocus(false);
                        }}
                      />
                    </>
                  )}
                  {!data && (
                    <>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          marginBottom: 5,
                        }}
                      >
                        Telefon Numarası Giriniz
                      </Text>
                      <TextInput
                        value={textData}
                        onChangeText={setTextData}
                        style={styles.input}
                        inputMode="tel"
                        placeholder="Telefon Numarası Giriniz"
                      />
                    </>
                  )}
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
                      handlechange();
                    }}
                  >
                    <Text style={styles.buttonText}>SEÇ</Text>
                  </TouchableOpacity>
                  {!data && (
                    <TouchableOpacity
                      style={[styles.buttons, { backgroundColor: "green" }]}
                      onPress={() => {
                        callNumber(storedService.ARAYANTELNUM);
                      }}
                    >
                      <Feather name="phone-call" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={{ flex: 1 }} />
      {storedService.STATUS == "0" && editable && (
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            backgroundColor: "green",
            padding: 10,
            borderRadius: 20,
            marginHorizontal: 50,
            flexDirection: "row",
            gap: 10,
          }}
          onPress={() => {
            handleStartService();
          }}
        >
          <AntDesign name="caretright" size={24} color="white" />
          <Text style={{ color: "white" }}>İŞE BAŞLA</Text>
        </TouchableOpacity>
      )}

      {/* {editable && (
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            backgroundColor: "#007bff",
            padding: 10,
            borderRadius: 20,
            marginHorizontal: 50,
            flexDirection: "row",
            gap: 10,
          }}
          onPress={() => {
            handleSave();
          }}
        >
          {!isLoading && <Feather name="save" size={24} color="white" />}
          {isLoading && <ActivityIndicator color={"white"} />}
          <Text style={{ color: "white" }}>Değişiklikleri Kaydet</Text>
        </TouchableOpacity>
      )} */}

      <Modal
        animationType="slide"
        transparent
        visible={modal2}
        onRequestClose={() => {
          setModal2(!modal2);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModal2(!modal2)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 5,
                      }}
                    >
                      Servisin Atanacağı Kişiyi Seçiniz
                    </Text>
                    <Dropdown
                      style={[
                        styles.dropdown2,
                        isFocus && { borderColor: "blue" },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={personelList}
                      maxHeight={300}
                      labelField="NAME"
                      valueField="USERS"
                      placeholder={"Atanacak Kişi Seçiniz"}
                      // value={degisenDeger}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={(item) => {
                        setBdowner(item);

                        setIsFocus(false);
                      }}
                    />
                  </>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#dc3545" }]}
                    onPress={() => {
                      setBdowner();
                      setModal2(!modal2);
                    }}
                  >
                    <Text style={styles.buttonText}>İptal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#007bff" }]}
                    onPress={() => {
                      //changeBdOwner(bdowner.NAME);
                      setModal2(!modal2);
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
      <Modal
        animationType="slide"
        transparent
        visible={modal3}
        onRequestClose={() => {
          setModal3(!modal3);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModal3(!modal3)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 5,
                      }}
                    >
                      Statü Durumunu Seçiniz
                    </Text>
                    <Dropdown
                      style={[
                        styles.dropdown2,
                        isFocus && { borderColor: "blue" },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={statuList}
                      maxHeight={300}
                      labelField="STEXT"
                      valueField="STEXT"
                      placeholder={"Statü Durumunu Seçiniz"}
                      // value={degisenDeger}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={(item) => {
                        setStatu(item);
                        setIsFocus(false);
                      }}
                    />
                  </>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#dc3545" }]}
                    onPress={() => setModal3(!modal3)}
                  >
                    <Text style={styles.buttonText}>İptal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#007bff" }]}
                    onPress={() => {
                      changeMntStatu(statu.STATUSDETAIL);
                      setModal3(!modal3);
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
}

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
