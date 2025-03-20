import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Button, Alert } from "react-native";
import Signature from "react-native-signature-canvas";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";


export const SignatureCanvasScreen = () => {
  const [signature, setSign] = useState(null);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [qrData, setQrData] = useState(null);

  // const html = `
  // <html>
  //   <head>
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  //   </head>
  //   <body style="width: 7cm; height: 8cm; position: relative;border: 1px solid black; font-size: 12; padding-left: 5; ">
  //   <p style="position: absolute;right: 5; ;"></p>
  // <h1 style="margin-top: 20;margin-bottom: 0;"></h1>
  // <p style="margin-top: 0; margin-bottom: 20;"></p>
  // <img src="${signature}" alt="Barkod" width="250"
  // height="80">

  // <div  style="position: relative;">

  // <p style="margin-top: 20; margin-bottom:5;">IE No: </p>
  // <p style="margin-top: 5; margin-bottom:5;">Ie Adedi: </p>
  // <h3 style="margin-top: 5; margin-bottom:5;"> Teslimat Lokasyonu: </h3>
  // <p style="position: absolute; right: 100; top: 5">ABC Kodu</p>
  // </div>
  // <div style="position: absolute; right: 5;">

  //     <h2 style="margin-top: 0; margin-bottom:0;">ADET</h2>
  //     <h2 style="margin-top: 0; margin-bottom:0;"></h2>
  // </div>

  //   </body>

  // </html>
  // `;

  // const html = `
  // <html>
  //   <head>
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  //   </head>
  //   <body >

  // <img src="${signature}" alt="Barkod" width="500" height="500"
  // height="80">

  //   </body>

  // </html>
  // `;
  // useEffect(() => {
  //   const getDataMata = async () => {
  //     let result = null;
  //     try {
  //       const fileUri = `${FileSystem.documentDirectory}Original.png`;
  //       result = await FileSystem.readAsStringAsync(require("./Original.png"), {
  //         encoding: FileSystem.EncodingType.Base64,
  //       });
  //       setQrData("data:image/png;base64," + result);
  //     } catch (err) {
  //       console.log(err);
  //     }
      
  //     return result;
  //   };
  //   getDataMata();
  // }, [signature]);
  // console.log("qr")
  // console.log(qrData);

  const html = `
  <!DOCTYPE html>
  <html lang="tr">
    <head>
      <meta charset="UTF-8" />
      <title>Fatura</title>
      <style>
        body {
          font-family: "Arial", sans-serif;
        }
        .invoice-box {
          max-width: 800px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        }
        .header-section {
          background: #f7f7f7;
          padding: 10px;
        }
        .header-section h2 {
          margin: 0;
        }
        .content-section {
          margin-top: 20px;
        }
        .content-section table {
          width: 100%;
          line-height: inherit;
          text-align: left;
        }
        .content-section table td {
          padding: 5px;
          vertical-align: top;
        }
        .content-section table tr td:nth-child(2) {
          text-align: right;
        }
        .content-section table tr.top table td {
          padding-bottom: 20px;
        }
        .content-section table tr.top table td.title {
          font-size: 45px;
          line-height: 45px;
          color: #333;
        }
        .content-section table tr.information table td {
          padding-bottom: 40px;
        }
        .content-section table tr.heading td {
          background: #eee;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }
        .content-section table tr.details td {
          padding-bottom: 20px;
        }
        .content-section table tr.item td {
          border-bottom: 1px solid #eee;
        }
        .content-section table tr.item.last td {
          border-bottom: none;
        }
        .content-section table tr.total td:nth-child(2) {
          border-top: 2px solid #eee;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header-section">
          <h2>Fatura</h2>
        </div>
        <div class="content-section">
          <table cellpadding="0" cellspacing="0">
            <tr class="top">
              <td colspan="2">
                <table>
                  <tr>
                    <td class="title">
                   
                   
                    </td>
  
                    <td>
                      Fatura #: 123<br />
                      Oluşturulma Tarihi: 15 Mart 2024<br />
                      Ödeme Tarihi: 30 Mart 2024
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <tr class="information">
              <td colspan="2">
                <table>
                  <tr>
                    <td>
                      Fatura Sahibi Şirket.<br />
                      12345 MDI Yazılım<br />
                      Konya, Selçuklu
                    </td>
  
                    <td>
                      Müşteri Şirket.<br />
                      Furkan Çöker<br />
                      m.furkancoker@gmail.com<br />

                      <img src="${signature}" alt="Barkod" width="100" height="100"
                 
                  </td>
  
                  </tr>
                </table>
              </td>
            </tr>
  
            <tr class="heading">
              <td>Ödeme Metodu</td>
  
              <td>Miktar #</td>
            </tr>
  
            <tr class="details">
              <td>Kredi Kartı</td>
  
              <td>1000</td>
            </tr>
  
            <tr class="heading">
              <td>Ürün</td>
  
              <td>Fiyat</td>
            </tr>
  
            <tr class="item">
              <td>Servis Ücreti</td>
  
              <td>300.00</td>
            </tr>
  
            <tr class="item">
              <td>Yedek Parça Ücreti</td>
  
              <td>100.00</td>
            </tr>
  
            <tr class="item last">
             
            </tr>
  
            <tr class="total">
              <td></td>
  
              <td>Toplam: 400.00</td>
            </tr>
          </table>
        </div>
      </div>
    </body>
  </html>
  
  `;

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };
  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  const handleOK = (signature) => {
    //console.log(signature);
    setSign(signature);
    Alert.alert("İmza kaydedildi", "", [
      { text: "OK", onPress: () => console.log("başarılı") },
    ]);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  const style = `.m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }`;
  return (
    <View style={{ flex: 1 }}>
      {/* <View style={styles.preview}>
        {signature ? (
          <Image
            resizeMode={"contain"}
            style={{ width: 335, height: 114 }}
            source={{ uri: signature }}
          />
        ) : null}
      </View> */}
      <Signature
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText="Sign"
        clearText="Clear"
        confirmText="Save"
        webStyle={style}
      />
      {/* <Image
        source={ require("./Original.png") }
        style={styles.logo}
      /> */}
      <Button title="Print" onPress={print} />
      <Button title="Print to PDF file" onPress={printToFile} />
    </View>
  );
};

const styles = StyleSheet.create({
  preview: {
    width: 335,
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

// import React, { useRef } from 'react';
// import { View, Button } from 'react-native';
// import Signature from 'react-native-signature-canvas';

// export  const SignatureCanvasScreen = () => {
//   const signatureRef = useRef();

//   const handleOK = (signature) => {
//     console.log(signature); // imza base64 olarak konsola yazdırılır
//   };

//   const handleClear = () => {
//     signatureRef.current.clearSignature();
//   };

//   const handleConfirm = () => {
//     console.log('İmza kaydedildi.');
//     signatureRef.current.readSignature();
//   };

//   const style = `.m-signature-pad--footer
//     .button {
//       background-color: red;
//       color: #FFF;
//     }`;

//   return (
//     <View>
//       <Signature
//         ref={signatureRef}
//         onOK={handleOK}
//         onClear={handleClear}
//         onConfirm={handleConfirm}
//         descriptionText="İmzanızı buraya çizin"
//         clearText="Temizle"
//         confirmText="Onayla"
//         webStyle={style}
//       />
//       <Button title="Temizle" onPress={handleClear} />
//       <Button title="Onayla" onPress={handleConfirm} />
//     </View>
//   );
// };

// const html = `
// <!DOCTYPE html>
// <html lang="tr">
//   <head>
//     <meta charset="UTF-8" />
//     <title>Fatura</title>
//     <style>
//       body {
//         font-family: "Arial", sans-serif;
//       }
//       .invoice-box {
//         max-width: 800px;
//         margin: auto;
//         padding: 30px;
//         border: 1px solid #eee;
//         box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
//       }
//       .header-section {
//         background: #f7f7f7;
//         padding: 10px;
//       }
//       .header-section h2 {
//         margin: 0;
//       }
//       .content-section {
//         margin-top: 20px;
//       }
//       .content-section table {
//         width: 100%;
//         line-height: inherit;
//         text-align: left;
//       }
//       .content-section table td {
//         padding: 5px;
//         vertical-align: top;
//       }
//       .content-section table tr td:nth-child(2) {
//         text-align: right;
//       }
//       .content-section table tr.top table td {
//         padding-bottom: 20px;
//       }
//       .content-section table tr.top table td.title {
//         font-size: 45px;
//         line-height: 45px;
//         color: #333;
//       }
//       .content-section table tr.information table td {
//         padding-bottom: 40px;
//       }
//       .content-section table tr.heading td {
//         background: #eee;
//         border-bottom: 1px solid #ddd;
//         font-weight: bold;
//       }
//       .content-section table tr.details td {
//         padding-bottom: 20px;
//       }
//       .content-section table tr.item td {
//         border-bottom: 1px solid #eee;
//       }
//       .content-section table tr.item.last td {
//         border-bottom: none;
//       }
//       .content-section table tr.total td:nth-child(2) {
//         border-top: 2px solid #eee;
//         font-weight: bold;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="invoice-box">
//       <div class="header-section">
//         <h2>Fatura</h2>
//       </div>
//       <div class="content-section">
//         <table cellpadding="0" cellspacing="0">
//           <tr class="top">
//             <td colspan="2">
//               <table>
//                 <tr>
//                   <td class="title">
//                     <img
//                       src="../assets/images/Original.png"
//                       style="width: 100%; max-width: 100px"
//                     />
//                   </td>

//                   <td>
//                     Fatura #: 123<br />
//                     Oluşturulma Tarihi: 15 Mart 2024<br />
//                     Ödeme Tarihi: 30 Mart 2024
//                   </td>
//                 </tr>
//               </table>
//             </td>
//           </tr>

//           <tr class="information">
//             <td colspan="2">
//               <table>
//                 <tr>
//                   <td>
//                     Fatura Sahibi Şirket.<br />
//                     12345 MDI Yazılım<br />
//                     Konya, Selçuklu
//                   </td>

//                   <td>
//                     Müşteri Şirket.<br />
//                     Furkan Çöker<br />
//                     m.furkancoker@gmail.com<br />
//                     <img
//                     src="../../assets/images/Original.png"
//                     style="width: 100%; max-width: 100px"
//                   />
//                 </td>

//                 </tr>
//               </table>
//             </td>
//           </tr>

//           <tr class="heading">
//             <td>Ödeme Metodu</td>

//             <td>Miktar #</td>
//           </tr>

//           <tr class="details">
//             <td>Kredi Kartı</td>

//             <td>1000</td>
//           </tr>

//           <tr class="heading">
//             <td>Ürün</td>

//             <td>Fiyat</td>
//           </tr>

//           <tr class="item">
//             <td>Servis Ücreti</td>

//             <td>300.00</td>
//           </tr>

//           <tr class="item">
//             <td>Yedek Parça Ücreti</td>

//             <td>100.00</td>
//           </tr>

//           <tr class="item last">
//             <td>Alan adı kaydı</td>

//             <td>10.00</td>
//           </tr>

//           <tr class="total">
//             <td></td>

//             <td>Toplam: 410.00</td>
//           </tr>
//         </table>
//       </div>
//     </div>
//   </body>
// </html>

// `;
