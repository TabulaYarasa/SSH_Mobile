import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import PersonelStore from "../../Stores/PersonelStore";
import api from "../../../api/api";
import { Feather, AntDesign } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import Signature from "react-native-signature-canvas";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import ServiceStore from "../../Stores/ServiceStore";
import MontajStore from "../../Stores/MontajStore";

export default function MontajOnayScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [imageSend, setImageSend] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [type, setType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imzalayanIsmi, setImzalayanIsmi] = useState("");
  const [modal2, setModal2] = useState(false);

  const { setImzalayanKisi } = PersonelStore();
  const { setStoredSignature } = ServiceStore();
  const {storedMontaj} = MontajStore()





  const [modal, setModal] = useState(false);
  const [count, setCount] = useState(0);

  const resimToast = () => {
    Toast.show({
      type: "success",
      text1: "Başarılı",
      text2: "Resim Başarıyla Yüklendi",
      topOffset: 100,
    });
  };
  const showImagePickerOptions = () => {
    Alert.alert(
      'Fotoğraf Yükle',
      'Fotoğrafınızı nereden yüklemek istersiniz?',
      [
        {
          text: 'Galeriden Seç',
          onPress: pickImageFromGallery,
        },
        {
          text: 'Kamerayı Kullan',
          onPress: takePhotoWithCamera,
        },
        {
          text: 'İptal',
          style: 'cancel',
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      setImage(localUri);

      setBase64(result.assets[0].base64);
      let type = result.assets[0].mimeType.split("/")[1];

      setType(type);
    }
  };

  const pickImageFromGallery = async () => {


    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      setImage(localUri);

      setBase64(result.assets[0].base64);
      let type = result.assets[0].mimeType.split("/")[1];

      setType(type);
    }else if(result.canceled){
      console.log("cancellandınız")
    }
  };



  //00(sabit)#03(sabit)
  //#P1(listelemede dönüyorum sana kolon adı potype)
  //#PRDORDER(listede dönüyorum iiş emri bilgisi aslında takip numarası bilgisi)

  const postImage = async () => {
    setIsLoading(true);

    try {
      const res = await api.post("/MntUpdateFile", {
        base64File: base64,
          docnameTmp: `00#03#01#${storedMontaj.POTYPE}#${storedMontaj.TRACKINGNO}`,
        doctype: type,
      });
      console.log("----------------")
   
      console.log(res.data)
      console.log("---------------")
      resimToast();
      setImage("");
       setBase64("");
    } catch (err) {
      console.log(err);
      Alert.alert("Bir hatayla karşılfaşılsdı", "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignature = () => {
    setModal2(!modal2);
    navigation.navigate("MontajFatura", {
      count:count
    });
  };
  const handleOK = (signature) => {
    if (imzalayanIsmi) {
      setImzalayanKisi(imzalayanIsmi);

      if (signature) {
        setStoredSignature(signature);
       
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

  return (
    <View style={{ flex: 1 }}>
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
        <TouchableOpacity style={styles.button} onPress={() => showImagePickerOptions()}>
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
              onPress={() =>
                 postImage()
          
              }
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
      </View>

      <Modal animationType="slide" transparent visible={modal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
              Bitirmek İstediğiniz Montaj Adedi
            </Text>

            <View style={styles.modalCounter}>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => setCount(Math.max(count - 1, 0))} // Sayıyı azalt
              >
                <Text style={styles.buttonText2}>-</Text>
              </TouchableOpacity>
              <Text style={styles.countText2}>{count}</Text>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => setCount(count + 1)} // Sayıyı artır
              >
                <Text style={styles.buttonText2}>+</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TextInput
                value={imzalayanIsmi}
                onChangeText={setImzalayanIsmi}
                style={styles.input}
                placeholder="İmza Atan Kişi İsmi"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.buttons, { backgroundColor: "#dc3545" }]}
                onPress={() => {
                  setCount(0);
                  setImzalayanIsmi("");
                  setModal(!modal);
                }}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModal(!modal);
                  setModal2(!modal2);

                }}
                style={[styles.buttons, { backgroundColor: "#007bff" }]}
              >
                <Text style={styles.buttonText}>Seç</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={modal2}>
        <View style={styles.centeredView}>
          <View style={{ elevation: 10 }}>
            <View style={{ backgroundColor: "white", width: 300, padding: 10 }}>
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
  button: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  modalCounter: {
    flexDirection: "row",
    padding: 10,
  },
  button2: {
    backgroundColor: "#007AFF", // Mavi renk
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    borderRadius: 20, // Düğmeleri yuvarlak yap
  },
  buttonText2: {
    color: "white",
    fontSize: 24,
  },
  countText2: {
    fontSize: 30,
    textAlignVertical: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
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
