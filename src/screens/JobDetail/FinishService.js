import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import ServiceStore from "../../Stores/ServiceStore";
import api from "../../../api/api";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import ParcalarStore from "../../Stores/ParcalarStore";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { callMntPersonel } from "../../../api/CallMntPersonel";
import { Dropdown } from "react-native-element-dropdown";
import { Feather, AntDesign } from "@expo/vector-icons";
import Signature from "react-native-signature-canvas";
import EditableStore from "../../Stores/EditableStore";
import PersonelStore from "../../Stores/PersonelStore";
import WebView from "react-native-webview";

export default function JobAriza({ navigation }) {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const { storedService, setStoredSignature, changeStatus, changeWarranty } =
    ServiceStore();
  const { editable } = EditableStore();
  const { servisHizmetleri, materials } = ParcalarStore();
  const { setCurrentSecondPersonel, setImzalayanKisi } = PersonelStore();

  const [image, setImage] = useState(null);
  const [imageSend, setImageSend] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [type, setType] = useState(null);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [personelList, setPersonelList] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [personel, setPersonel] = useState([]);
  const [signature, setSign] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imzalayanIsmi, setImzalayanIsmi] = useState("");
  const [oldPdfList, setOldPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState([]);
  const combinedData = materials.concat(servisHizmetleri);

  const resimToast = () => {
    Toast.show({
      type: "success",
      text1: "Başarılı",
      text2: "Resim Başarıyla Yüklendi",
      topOffset: 100,
    });
  };

  const pdfToast = () => {
    Toast.show({
      type: "error",
      text1: "Başarısız",
      text2: "Pdf Bulunamadı",
      topOffset: 100,
    });
  };


  const showImagePickerOptions = () => {
    Alert.alert(
      "Fotoğraf Yükle",
      "Fotoğrafınızı nereden yüklemek istersiniz?",
      [
        {
          text: "Galeriden Seç",
          onPress: pickImageFromGallery,
        },
        {
          text: "Kamerayı Kullan",
          onPress: takePhotoWithCamera,
        },
        {
          text: "İptal",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const takePhotoWithCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      //aspect: [3, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      let localUri = result.assets[0].uri;
      setSelectedImage(result.assets[0].uri);
      //setSelectedImage(result.assets[0]);

      setImageSend(result);
      setImage(result.assets[0].uri);

      setBase64(result.assets[0].base64);

      setType(result.assets[0].mimeType?.split("/")[1] || "jpeg");
    }
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      //aspect: [3, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      let localUri = result.assets[0].uri;
      setSelectedImage(result.assets[0].uri);
      //setSelectedImage(result.assets[0]);

      setImageSend(result);
      setImage(result.assets[0].uri);

      setBase64(result.assets[0].base64);

      setType(result.assets[0].mimeType?.split("/")[1] || "jpeg");
    } else if (result.canceled) {
      console.log("cancellandınız");
    }
  };

  const postImage = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/UpdateFile", {
        base64File: base64,
        docnameTmp: `00#01#01#${storedService.BREAKDOWNTYPE}#${storedService.BREAKDOWNNUM}`,
        doctype: type,
      });

      resimToast();
      setImage(null);
      setBase64(null);
    } catch (err) {
      console.log(err);
      Alert.alert("Bir hatayla karşılfaşıldı", "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignature = () => {
    setModal2(!modal2);
    navigation.navigate("Fatura");
  };
  const handleOK = (signature) => {
    if (imzalayanIsmi) {
      setImzalayanKisi(imzalayanIsmi);

      if (signature) {
        setStoredSignature(signature);
        setSign(signature);
        Alert.alert("İmza kaydedildi", "", [
          { text: "OK", onPress: () => handleSignature() },
        ]);
      } else {
        Alert.alert("İmza Atınız", "", [
          { text: "OK", onPress: () => console.log("imza yok") },
        ]);
      }
    } else {
      Alert.alert("İmzalayan İsmi Giriniz", "", [{ text: "OK" }]);
    }
  };

  const handlePdf = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/ListDocs", {
        SourceObject: `00#01#01#${storedService.BREAKDOWNTYPE}#${storedService.BREAKDOWNNUM}`,
      });

      if (res.data == "Liste Bulunamadı") {
        console.log("liste bbb");
        pdfToast();
      } else if (res.data.length > 0) {
        setOldPdfList(res.data.TMPDOCLIST.ROW);
      } else {
        setOldPdfList([res.data.TMPDOCLIST.ROW]);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Bir hatayla karşılfaşıldı", "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPDF = async (id) => {
    setIsLoading(true);
    console.log(id);
    try {
      const res = await api.post("/ViewDoc", {
        docId: id,
      });
      setSelectedPdf(res.data);

      base64ToPdf(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Bir hatayla karşılfaşıldı", "");
    } finally {
      setIsLoading(false);
    }
  };

  async function base64ToPdf(base64Data) {
    try {
      const filePath = FileSystem.documentDirectory + "pdf_dosyasi.pdf";

      await FileSystem.writeAsStringAsync(filePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // PDF dosyasını yazdır veya göster
      await Print.printAsync({ uri: filePath });

      return filePath; // PDF dosyasının yolu döndürülür
    } catch (error) {
      console.error("Hataewrwet:", error);
      return null;
    }
  }

  const handleEmpty = () => {
    console.log("Empty");
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

  const style = `.m-signature-pad--footer
  .button {
    background-color: red;
    color: #FFF;
  }`;

  const oldPdfRenderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleShowPDF(item.DOCID);
        }}
      >
        <Text>{item.DOCID}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {editable && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            backgroundColor: "white",
          }}
        >
          <Text style={styles.header}>Fotoğraf Yüklemek İçin</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => showImagePickerOptions()}
          >
            <AntDesign name="camerao" size={24} color="white" />
            <Text style={styles.buttonText}>Fotoğraf Çek</Text>
          </TouchableOpacity>

          {image && (
            <>
              <Image
                source={{ uri: image }}
                style={{ width: 300, height: 300, resizeMode: "contain" }}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={() => postImage()}
              >
                <Feather name="upload" size={24} color="#fff" />
                <Text style={styles.buttonText}>Yükle</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
     
              setModal(!modal);
            }}
          >
            <Feather name="check" size={24} color="#fff" />
            <Text style={styles.buttonText}>Servisi Bitir</Text>
          </TouchableOpacity>

          <Modal animationType="slide" transparent visible={modal}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                

                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}
                >
                  İmza Atacak Kişinin İsmini Giriniz
                </Text>

                <TextInput
                  value={imzalayanIsmi}
                  onChangeText={setImzalayanIsmi}
                  style={styles.input}
                  placeholder="İmza Atan Kişi İsmi"
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.buttons, { backgroundColor: "#dc3545" }]}
                    onPress={() => {
                      changeStatus("1");
                      setPersonel([]);
                      setModal(!modal);
                    }}
                  >
                    <Text style={styles.buttonText}>İptal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      if (imzalayanIsmi) {
                        changeStatus("3");
                        setModal(!modal);
                        setModal2(!modal2);
                      
                      } else {
                        setModal(!modal);
                        navigation.navigate("Fatura");
                      }
                    }}
                    style={[styles.buttons, { backgroundColor: "#007bff" }]}
                  >
                    <Text style={styles.buttonText}>SEÇ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal animationType="slide" transparent visible={modal2}>
            <View style={styles.centeredView}>
              <View style={{ elevation: 10 }}>
                <View
                  style={{ backgroundColor: "white", width: 300, padding: 10 }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 5,
                      textAlign: "center",
                    }}
                  >
                    Lütfen İmzanızı Atın
                  </Text>
                </View>

                <View style={{ height: 400, width: 300 }}>
                  <Signature
                    onOK={handleOK}
                    onEmpty={handleEmpty}
                    descriptionText=""
                    clearText="Sil"
                    confirmText="Kaydet"
                    webStyle={style}
                  />

                  <Button title="kapat" onPress={() => setModal2(!modal2)} />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {!editable && (
        <>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              backgroundColor: "white",
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handlePdf();
              }}
            >
              <Feather name="check" size={24} color="#fff" />
              <Text style={styles.buttonText}>Pdf Göster</Text>
            </TouchableOpacity>

            <FlatList data={oldPdfList} renderItem={oldPdfRenderItem} />
            {selectedPdf && (
              <View style={{ height: 300 }}>
                <WebView
                  // originWhitelist={["*"]}
                  source={{ uri: `data:application/pdf;base64,${selectedPdf}` }}
                  style={{ flex: 1 }}
                />
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
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
