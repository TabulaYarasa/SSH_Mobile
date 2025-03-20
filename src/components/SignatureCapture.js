// import React, { useState } from "react";
// import { StyleSheet, Text, View, Image } from "react-native";
// import Signature from "react-native-signature-canvas";
import React, { useRef } from 'react';
import ExpoPixi from 'expo-pixi';
export  const SignatureCapture= () => {
  
     const signatureCanvas = useRef(null);

      const clearCanvas = () => {
        signatureCanvas.current.clear();
      };
    
      const saveCanvas = async () => {
        const signatureResult = await signatureCanvas.current.takeSnapshotAsync({
          format: 'jpeg',
          quality: 0.5,
          result: 'file'
        });
        console.log(signatureResult);
        // Burada elde edilen 'signatureResult.uri' kullanılarak dosya sunucuya kaydedilebilir.
      };
    console.log("ss")
      return (
        <ExpoPixi.Signature
          ref={signatureCanvas}
          strokeWidth={3}
          strokeAlpha={0.5}
        />
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
});


// // const styles = StyleSheet.create({})

// import React, { useRef } from 'react';
// import ExpoPixi from 'expo-pixi';

// export default function Signature() {
//   const signatureCanvas = useRef(null);

//   const clearCanvas = () => {
//     signatureCanvas.current.clear();
//   };

//   const saveCanvas = async () => {
//     const signatureResult = await signatureCanvas.current.takeSnapshotAsync({
//       format: 'jpeg',
//       quality: 0.5,
//       result: 'file'
//     });
//     console.log(signatureResult);
//     // Burada elde edilen 'signatureResult.uri' kullanılarak dosya sunucuya kaydedilebilir.
//   };
// console.log("ss")
//   return (
//     <ExpoPixi.Signature
//       ref={signatureCanvas}
//       strokeWidth={3}
//       strokeAlpha={0.5}
//     />
//   );
// };