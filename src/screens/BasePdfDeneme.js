import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WebView from 'react-native-webview';
import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from "expo-file-system";

export default function BasePdfDeneme({route}) {
    const { base64 } = route.params;
    const [fileUri, setFileUri] = useState(null);

    console.log("basepd deeme ekranı")
    console.log(base64)
    console.log("basepd deeme ekranı")
    const pdfUrl = `data:application/pdf;base64,${base64}`;

    // useEffect(() => {
    //     // Base64 verisini bir dosyaya yaz
    //    console.log(base64ToPdf(base64)) ;
    //   }, [base64]);
    

    //   async function base64ToPdf(base64Data) {
     
    //     try {
  
    //       const filePath = FileSystem.documentDirectory + 'pdf_dosyasi.pdf';
      
    //       await FileSystem.writeAsStringAsync(filePath, base64Data, {
    //         encoding: FileSystem.EncodingType.Base64,
    //       });
      
    //       // PDF dosyasını yazdır veya göster
    //     //   await Print.printAsync({ uri: filePath });
    //       return filePath; // PDF dosyasının yolu döndürülür
    //     } catch (error) {
    //       console.error("Hataewrwet:", error);
    //       return null;
    //     }
    //   }

  return (
    <View>
        <Text>selam</Text>
        <WebView
      source={{ uri: base64 }}
      style={{ flex: 1 }}
    />
    </View>
  )
}

const styles = StyleSheet.create({})