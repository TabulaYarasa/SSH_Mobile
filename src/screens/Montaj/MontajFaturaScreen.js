import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MontajStore from '../../Stores/MontajStore';
import { shareAsync } from "expo-sharing";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import api from '../../../api/api';
import PersonelStore from '../../Stores/PersonelStore';
import { Feather, Ionicons } from "@expo/vector-icons";
import WebView from 'react-native-webview';

export default function MontajFaturaScreen({route}) {
  const { count } = route.params;
  const {
    storedMontaj,
 
  } = MontajStore();
  const [pdfData, setPdfData] = useState("");
  const { currentPersonel,  imzalayanKisi } =
    PersonelStore();

  console.log("count: ", count)


  useEffect(() => {
    printToFile();
  }, []);

const html = `
<!DOCTYPE html>
<html>
<body>
<p></p>
</body>

</html>
`

const shareToFile = async () => {
  const { uri } = await Print.printToFileAsync({ html });

  await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
};
  const printToFile = async () => {
    const { uri } = await Print.printToFileAsync({ html });

    pdfToBase64(uri);

    // await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  async function pdfToBase64(pdfUri) {
    try {
      // PDF dosyasını oku
      const pdfData = await FileSystem.readAsStringAsync(pdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setPdfData(pdfData);
      return pdfData; // Base64 formatındaki PDF verisini döndür
    } catch (error) {
      console.error("Hata:", error);
      return null;
    }
  }
  const postImage = async () => {
    try {
      const res = await api.post("/UpdateFile", {
        base64File: pdfData,
        docnameTmp: `00#03#01#${storedService.BREAKDOWNTYPE}#${storedService.BREAKDOWNNUM}`,
        doctype: "pdf",
      });
      console.log("başarılı");
    } catch (err) {
      console.log(err);
      Alert.alert("Bir hatayla karşılfaşıldı", "");
    }
  };


  const MontajOnay = async () => {
    console.log("MontajOnay");

    try {
      const response = await api
        .post("/Montaj/MontajOnay", {
          psconfirmation: storedMontaj.WORKORDERSNO,
          psworkcenter: storedMontaj.WORKSTATIONCODE,
          pdcoutput: count,
          pspersonnel: currentPersonel.CONTACT,
          psconfstext: "Açıklama",
        })
        .then((response) => {
          console.log("response bu: ", response.data);
        });
    } catch (err) {
      console.log("Montaj Onay: ", err);
    }
  };

  const handleFinish = () => {
    Alert.alert(
      "Uyarı",
      "Servisi Bitirmek istediğinize emin misiniz?",
      [
        {
          text: "Hayır",
          onPress: () => console.log("iptal edildi"),
          style: "cancel",
        },
        {
          text: "Evet",
          onPress: () => {
           // postImage();

            //  postImage()
            MontajOnay();
          },
        },
      ],
      { cancelable: true }
    );
  };



  return (
    <View style={styles.container}>
    <View style={{ alignItems: "flex-end", marginRight: 24 }}>
      <TouchableOpacity style={styles.icon} onPress={shareToFile}>
        <Ionicons name="share-social" size={20} color="white" />
      </TouchableOpacity>
    </View>
    <View style={{ height: 500 }}>
      <WebView originWhitelist={["*"]} source={{ html: html }} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => 
            handleFinish()
        //  console.log("deneme bitir")
          }
        >
          <Feather name="check" size={24} color="#fff" />

          <Text style={styles.buttonText}>İşi Bitir</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    backgroundColor: "#1e90ff",
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
});
