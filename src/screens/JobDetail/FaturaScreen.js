import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import WebView from "react-native-webview";
import { Feather, Ionicons } from "@expo/vector-icons";
import ServiceStore from "../../Stores/ServiceStore";
import ParcalarStore from "../../Stores/ParcalarStore";
import { shareAsync } from "expo-sharing";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";

import { SaveSrv } from "../../utility/SaveSrv";
import PersonelStore from "../../Stores/PersonelStore";

import api from "../../../api/api";
import { finishService } from "../../../api/FinishService";
import { CallMaterialList } from "../../../api/CallMaterialList";

export default function FaturaScreen({ navigation, route }) {
  const { storedService, storedSignature, stadate } = ServiceStore();
  const [state, setState] = useState({
    isLoading: true,
    error: null,
    refreshing: false,
    materialList: [], // API'den gelen malzeme listesi
  });

  const [materialRows, setMaterialRows] = useState([]);
  const { materials, servisHizmetleri, arizaSebep, arizaSebepAciklama } =
    ParcalarStore();
  const { currentPersonel, currentSecondPersonel, imzalayanKisi } =
    PersonelStore();

  const [pdfData, setPdfData] = useState("");
  const date = new Date();



  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formattedDate2 = new Intl.DateTimeFormat("tr-TR", options).format(date);



  useEffect(() => {
    printToFile();
  }, [materialRows]);


  const fetchMaterialList = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await CallMaterialList(
        storedService.BREAKDOWNTYPE,
        storedService.BREAKDOWNNUM
      );

      setState((prev) => ({
        ...prev,
        materialList: response || [],
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
      fetchMaterialList();
      
  }, []);

  console.log(storedService)

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
  const shareToFile = async () => {
    const { uri } = await Print.printToFileAsync({ html });

    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };



  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table,
        th,
        td {
          font-size: 12px;
          font-weight: 500;
        }
        .left-aligned {
          text-align: left;
        }
        .right-aligned {
          text-align: right;
        }
        .title {
          font-weight: bold;
        }
        .main-title {
          font-weight: bold;
          font-size: 20px;
        }
        .space {
          width: 20%; /* Orta boşluğu ayarlamak için yüzdeyi değiştirebilirsiniz */
        }
        .invoice-box {
          max-width: 800px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        }
  
        .heading {
          background: #eee;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }
        .item {
          border-bottom: 1px solid #eee;
        }
        .borderTopWidth {
          border-top: 1px solid #ccc;
        }
         .borderBottomWidth {
          border-bottom: 1px solid #ccc;
        }
        .total {
          border-top: 2px solid #eee;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <table>
          <tr>
              <th colspan="5" class="main-title">YEMSA TEKNİK SERVİS FORMU</th>
          </tr>
          <tr>
              <td colspan="5">&nbsp;</td>
            
            </tr>
          <tr>
            <th class="left-aligned title">BİLDİREN KİŞİ <br /></th>
            <td class="space"></td>
            <td class="space"></td>
            <!-- Bu hücre boş bırakıldı -->
            <th class="right-aligned">BİLDİRİM TARİHİ</th>
            <th class="right-aligned">${storedService.REPORTEDAT}</th>
          </tr>
  
          <tr>
            <th class="left-aligned">ADI SOYADI</th>
            <th class="left-aligned">${storedService.CUSTPERSONNEL}</th>
            <td class="space"></td>
            <!-- Bu hücre boş bırakıldı -->
            <th class="right-aligned">BİLDİRİM ALAN</th>
            <th class="right-aligned">${storedService.REPORTEDTO}</th>
          </tr>
          <tr>
            <th class="left-aligned">TELEFON</th>
            <th class="left-aligned">${storedService.TELNUM}</th>
            <td class="space"></td>
            <!-- Bu hücre boş bırakıldı -->
            <th class="right-aligned">BİLDİRİM METODU</th>
            <th class="right-aligned"></th>
          </tr>
     
  
          <!-- Daha fazla satır ekleyebilirsiniz -->
          <tr>
            <td colspan="5">&nbsp;</td>
            <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
          </tr>
          <tr>
            <td colspan="5">&nbsp;</td>
            <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
          </tr>
  
          <tr>
            <th class="left-aligned title">MÜŞTERİNİN <br /></th>
            <td class="space"></td>
            <td class="space"></td>
            <!-- Bu hücre boş bırakıldı -->
            <th class="right-aligned"></th>
            <th class="right-aligned"></th>
          </tr>
  
          <tr>
            <th class="left-aligned">FİRMA ÜNVANI</th>
            <th class="left-aligned" colspan="2">
            ${storedService.NAME1}
            </th>
  
           
            
          </tr>
          <tr>
            <th class="left-aligned">FİRMA ADRESİ</th>
            <th class="left-aligned" colspan="2">
            ${storedService.ADDRESS1}
            </th>
  
          
         
          </tr>
         
          <tr>
            <th class="left-aligned">EMAİL</th>
            <th class="left-aligned">${storedService.EMAIL}</th>
            <td class="space"></td>
            <!-- Bu hücre boş bırakıldı -->
            <th class="right-aligned"></th>
            <th class="right-aligned"></th>
          </tr>
  
          <tr>
            <td colspan="5">&nbsp;</td>
            <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
          </tr>
          <tr>
            <td colspan="5">&nbsp;</td>
            <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
          </tr>
  
          <tr>
            <th class="left-aligned title">ARIZA TANIMI</th>
            <td class="space">${storedService.PROBDESCRS}</td>
            <td class="space"></td>
            <!-- Bu hücre boş bırakıldı -->
            <th class="right-aligned"></th>
            <th class="right-aligned"></th>
          </tr>
  
          <tr>
            <th class="left-aligned">ÜRÜN CİNSİ- MODEL</th>
            <th class="left-aligned"></th>
  
            <th class="right-aligned"></th>
            <th class="right-aligned"></th>
          </tr>
          <tr>
            <th class="left-aligned">ÜRÜN SERİ NUMARSI</th>
            <th class="left-aligned"></th>
  
            <th class="right-aligned"></th>
            <th class="right-aligned"></th>
          </tr>
  
          <tr>
            <th class="title" colspan="5">SERVİS NOTU</th>
          </tr>
          <tr>
            <td colspan="5">&nbsp;</td>
            <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
          </tr>
          <tr>
            <td colspan="5">&nbsp;</td>
            <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
          </tr>
          <tr>
            <th class="left-aligned title">YAPILAN İŞLEM</th>
            <th class="left-aligned ">${arizaSebepAciklama}</th>
          </tr>
        </table>
  
        <table>
          <tr class="heading">
            <td></td>
            <td>ÜRÜN KODU</td>
            <td>ÜRÜN AÇIKLAMASI</td>
            <td>MİKTAR</td>
            <td>BİRİM</td>
          
          </tr>
  
         
          ${materialRows}

          <tr class="total">
          <td></td>
          <td></td>

          <td></td>
          <td></td>
          
          <td> </td>
          <td> </td>
        </tr>

          <tr class="total">
          <td></td>
          <td></td>

          <td></td>
          <td></td>
          
          
        </tr>
        <tr class="total">
        <td></td>
          <td></td>
          <td></td>

          <td></td>
          
         
      </tr>
      <tr class="total">
      <td></td>
      <td></td>
      <td></td>

      <td></td>
      
     
    </tr>
          
          <!-- Daha fazla satır ekleyebilirsiniz -->
          <tr>
            <td colspan="5">&nbsp;</td>
            <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
          </tr>
          <tr>
            <td colspan="5">&nbsp;</td>
            <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
          </tr>
          <tr class="margin-top">
            <td class="left-aligned">BAŞLANGIÇ TARİHİ</td>
            <td class="left-aligned">${stadate}</td>
          </tr>
          <tr>
            <td class="left-aligned">BİTİŞ TARİHİ</td>
            <td class="left-aligned">${formattedDate2}</td>
          </tr>
         
   
        
        </table>
        <table>
          <tr>
              <td colspan="5">&nbsp;</td>
              <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
            </tr>
            <tr>
              <td colspan="5">&nbsp;</td>
              <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
              <tr class="borderTopWidth">
              <th class="title">TEKNİKER</th>
              
              <th class="title "">KULLANICI</th>
            </tr>
            <tr>
                <th >&nbsp;</th>
             
            </tr>
    
            <tr>
                <th>${currentPersonel.DISPLAY}</th>
                <th>${imzalayanKisi} <br/> <img src="${storedSignature}" alt="Barkod" width="100" height="100"</th>
            </tr>
         
        </table>
  
       
        <table class="borderBottomWidth">
          <tr>
              <td colspan="5">&nbsp;</td>
              <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
            </tr>
            <tr>
              <td colspan="5">&nbsp;</td>
              <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
            </tr>
            <tr>
              <td colspan="5">&nbsp;</td>
              <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
            </tr>
            <tr>
              <td colspan="5">&nbsp;</td>
              <!-- 'colspan' tüm sütunları kapsayacak şekilde ayarlanır -->
            </tr>
         
        </table>
      
      </div>
    </body>
  </html>
  
    
    `;

  useEffect(() => {
    let count = 0;
    const rows = state.materialList.map((row) => {
      count++;
      return `
          <tr class="item">
          <td>${count}</td>
          <td>${row.MATERIAL}</td>
          <td>${row.STEXT}</td>
          <td>${row.QUANTITY}</td>
          <td>${row.QUNIT}</td>
       
          </tr>`;
    });

    setMaterialRows(rows);
  }, [state.materialList]);

  const postImage = async () => {
    try {
      const res = await api.post("/UpdateFile", {
        base64File: pdfData,
        docnameTmp: `00#01#01#${storedService.BREAKDOWNTYPE}#${storedService.BREAKDOWNNUM}`,
        doctype: "pdf",
      });
      console.log("başarılı");
    } catch (err) {
      console.log(err);
      Alert.alert("Bir hatayla karşılaşıldı", "");
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

              postImage()
            handleEndJob();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEndJob = async () => {
    try {
      const result = await finishService(
        storedService.BREAKDOWNTYPE,
        storedService.BREAKDOWNNUM
      );
      if (result) {
        Alert.alert(
          "Başarılı",
          "Servisi Başarıyla Kapatıldı!",
          [
            {
              text: "Tamam",
              onPress: () => {
                navigation.navigate("Home");
              },
            },
          ],
          { cancelable: true }
        );
      } else {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (state.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#488130" />
      </View>
    );
  }

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
        {storedSignature && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleFinish()}
          >
            <Feather name="check" size={24} color="#fff" />
           
            <Text style={styles.buttonText}>İşi Bitir</Text>
          </TouchableOpacity>)}
        </View>
      </View>
    </View>
  );
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
});
