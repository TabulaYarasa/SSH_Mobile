import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { montajList } from '../../../api/MontajList';
import MontajStore from '../../Stores/MontajStore';
import PersonelStore from '../../Stores/PersonelStore';
import {
  AntDesign,
  MaterialIcons,
  Entypo,
  EvilIcons,
  Feather
} from "@expo/vector-icons";
export default function MontajDetailScreen() {
  const [isInfoVisible, setIsInfoVisible] = useState(true);

    const {storedMontaj,setStoredmontaj,setStoredmontajMaterial} = MontajStore()
    const {currentPersonel} = PersonelStore()


  
    useEffect(() => {
        handleCallMontajList();
      }, []);
      
    console.log("tracking no",storedMontaj.TRACKINGNO)
      const handleCallMontajList = async () => {
        try {
          const result = await montajList(2,storedMontaj.TRACKINGNO,currentPersonel.CONTACT);
          if (result) {
            if (result.length > 0) {
           
                setStoredmontajMaterial(result)
            } else {
              
                setStoredmontajMaterial([result])
            }
          } else {
            //setServices([])
          }
        } catch (err) {
          console.log(err);
        }
      };

  return (

    <View style={styles.view}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <AntDesign name="playcircleo" size={24} color="black" />
          <Text style={styles.title}>İs Türü:</Text>
          <Text style={styles.text}>MONTAJ</Text>
        </View>
        <View style={styles.headerContent}>
          <MaterialIcons name="topic" size={24} color="black" />
          <Text style={styles.title}>Bilgi:</Text>
          <Text style={styles.text}>{storedMontaj.STOCKDESCRIPTION}</Text>
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
              <Text style={{ fontWeight: "bold" }}>Montaj Bilgileri</Text>
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
                <Text style={styles.infoTitle}>Müşteri Açıklama</Text>
                <Text>{storedMontaj.MUSTERIACIKLAMA}</Text>
              </View>
              <View style={styles.right}>
                <Text style={[styles.infoTitle, { textAlign: "right" }]}>
                  {/* Personel */}
                </Text>
                <Text style={{ textAlign: "right" }}>
                  {/* {storedService.BDOWNER} */}
                </Text>
              </View>
            </View>
           

            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.infoTitle}>İşleme Başlandı mı</Text>
                <Text>
                  {storedMontaj.ISBASLANGICTARIHI  == "01.01.1975 00:00:00" ? "Başlanmadı" : "Başlandı"}
                 
                </Text>
              </View>
              <View style={styles.right}>
              <Text style={styles.infoTitle}>İşleme Başlama Tarihi</Text>
                <Text>
                  {" "}
                  {storedMontaj.ISBASLANGICTARIHI == "01.01.1975 00:00:00"
                    ? ""
                    : storedMontaj.ISBASLANGICTARIHI}
                </Text>
              </View>
            </View>
          
       
         
         
          </>
        )}
      </View>

   


       
    </View>
  )
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
  customerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
})