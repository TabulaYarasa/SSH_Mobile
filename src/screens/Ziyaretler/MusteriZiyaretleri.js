import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import useZiyaretStore from "../../Stores/ZiyaretStore";
import { callListCustomer } from "../../../api/Ziyaretler/MüsteriListesi";
const MusteriZiyaretleri = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [musteriAdi, setMusteriAdi] = useState("");
  const [ziyaretTarihi, setZiyaretTarihi] = useState(new Date());
  const [notlar, setNotlar] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [musteriListesi, setMusteriListesi] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMusteri, setSelectedMusteri] = useState(null);

  const setMusteriStore = useZiyaretStore((state) => state.setMusteriStore);

  const musteriListesiSorgu = async () => {
    setIsLoading(true);

    try {
      const result = await callListCustomer(musteriAdi);
      if (result) {
        if (Array.isArray(result) && result.length > 0) {
          setMusteriListesi(result);
        } else if (result) {
          // If result is not an array but exists, make it an array
          setMusteriListesi([result]);
        }
      } else {
        setMusteriListesi([]);
      }
    } catch (err) {
      console.log(err);
      setMusteriListesi([]);
    } finally {
      setIsLoading(false);
      setModalVisible(true);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted");
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || ziyaretTarihi;
    setShowDatePicker(Platform.OS === "ios");
    setZiyaretTarihi(currentDate);
  };

  const resetForm = () => {
    setMusteriAdi("");
    setZiyaretTarihi(new Date());
    setNotlar("");
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="#393939" />
        </View>
      )}

      <View style={styles.centeredView}>
        <Text style={styles.modalTitle}>Müşteri Ziyareti</Text>

        <TextInput
          style={styles.input}
          placeholder="Müşteri Adı"
          value={musteriAdi}
          onChangeText={setMusteriAdi}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Müşteri Ara"
            onPress={musteriListesiSorgu}
            disabled={!musteriAdi}
            color="#007AFF"
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Müşteri Listesi</Text>
            <ScrollView style={styles.musteriListesi}>
              {musteriListesi && musteriListesi.length > 0 ? (
                musteriListesi.map((musteri, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.musteriItem,
                      selectedMusteri === musteri && styles.selectedMusteri,
                    ]}
                    onPress={() => setSelectedMusteri(musteri)}
                  >
                    <Text>{musteri.NAME1}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>Müşteri bulunamadı</Text>
              )}
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
               
                onPress={() => {
                  setModalVisible(false);
                  setSelectedMusteri(null);
                }}
                color="#FF3B30"
                style={{ with: 100 }}
              >
                İptal
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (selectedMusteri) {
                    setMusteriStore(selectedMusteri);
                    setModalVisible(false);
                    navigation.navigate("ZiyaretTabs", {
                      screen: "Bilgiler",
                    });
                  }
                }}
                style={[
                  styles.customButton,
                  {
                    backgroundColor: selectedMusteri ? "#007AFF" : "#a4cafb", // Disabled durumu için daha açık mavi
                    width: 100, // Genişliği buradan ayarlayabilirsiniz
                  },
                ]}
                disabled={!selectedMusteri}
              >
                <Text style={styles.buttonText}>Seç</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button2: {
    width: 300,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalView: {
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
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",

//     marginTop: 15,
//   },
  datePickerButton: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  musteriListesi: {
    width: "100%",
    maxHeight: 300,
  },
  musteriItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
  selectedMusteri: {
    backgroundColor: "#e3f2fd",
  },
  musteriText: {
    fontSize: 16,
  },
  customButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,

    // width burada değil, yukarıda doğrudan belirtildi
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // ButtonContainer stil güncellemesi
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
    alignItems: 'center', // Butonl
  }
});

export default MusteriZiyaretleri;
