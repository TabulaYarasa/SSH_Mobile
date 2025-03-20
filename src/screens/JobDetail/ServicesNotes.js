import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { callNotes } from "../../../api/CallNotes";
import ServiceStore from "../../Stores/ServiceStore";
import { useIsFocused } from "@react-navigation/native";
import { SendNotes } from "../../../api/SendNotes";
import Toast from "react-native-toast-message";
import EditableStore from "../../Stores/EditableStore";

const { height } = Dimensions.get("window");

// Not tiplerini merkezi bir yerde tanımlayalım
const NOTE_TYPES = {
  DAMDESCRL: {
    id: "DAMDESCRL",
    title: "Hasar Açıklaması",
    color: "#4CAF50",
    placeholder: "Servis notlarınızı buraya yazın...",
  },
  PROBDESCRL: {
    id: "PROBDESCRL",
    title: "Problem Açıklaması",
    color: "#F44336",
    placeholder: "Arıza notlarınızı buraya yazın...",
  },
  SOLNDESCRL: {
    id: "SOLNDESCRL",
    title: "Çözüm Açıklaması",
    color: "#2196F3",
    placeholder: "Genel notlarınızı buraya yazın...",
  },
};

const ServicesNotes = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeNoteType, setActiveNoteType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notes, setNotes] = useState(
    Object.keys(NOTE_TYPES).reduce((acc, key) => ({ ...acc, [key]: "" }), {})
  );
  const [tempNote, setTempNote] = useState("");
  const { editable } = EditableStore();

  const { storedService } = ServiceStore();

  const isFocused = useIsFocused();
  const isInitialLoad = useRef(true);
  const hasLoadedOnce = useRef(false); // Yeni ref ekleyelim

  useEffect(() => {
    if (!hasLoadedOnce.current && isFocused) {
      handleCallNotes();
      hasLoadedOnce.current = true;
    }
  }, [isFocused]);

  const handleCallNotes = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await callNotes(
        storedService.BREAKDOWNTYPE,
        storedService.BREAKDOWNNUM
      );
      if (result) {
        const newNotes = { ...notes };

        if (typeof result === "object" && !Array.isArray(result)) {
          // Direkt obje olarak gelen veriler için
          Object.keys(NOTE_TYPES).forEach((key) => {
            newNotes[key] = result[key] || "";
          });
        } else if (Array.isArray(result)) {
          // Array olarak gelen veriler için
          result.forEach((note) => {
            if (note.NOTETYPE && note.NOTETYPE in NOTE_TYPES) {
              newNotes[note.NOTETYPE] = note.NOTE || "";
            }
          });
        }

        setNotes(newNotes);
      }
    } catch (err) {
      setError(err.message || "Notlar yüklenirken bir hata oluştu");
      console.error("Not yükleme hatası:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleCallNotes().finally(() => setRefreshing(false));
  }, []);



  const openModal = (type) => {
    setActiveNoteType(type);
    setTempNote(notes[type]);
    setModalVisible(true);
  };

  const saveNote = async () => {
    setIsLoading(true);
    try {
      const result = await SendNotes(
        activeNoteType,
        tempNote,
        storedService.BREAKDOWNTYPE,
        storedService.BREAKDOWNNUM
      );

      setNotes((prev) => ({
        ...prev,
        [activeNoteType]: tempNote,
      }));

      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Kayıt Başarılı",
        topOffset: 100,
      });
    } catch (err) {
      setError("Not kaydedilirken bir hata oluştu");
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Not kaydedilirken bir hata oluştu",
        topOffset: 100,
      });
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  const cancelEdit = () => {
    setTempNote("");
    setModalVisible(false);
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error && !notes) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleCallNotes}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.view}>
        {Object.values(NOTE_TYPES).map((note) => (
          <View
            key={note.id}
            style={[styles.card, { backgroundColor: note.color }]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{note.title}</Text>
              {editable && (

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openModal(note.id)}
              >
                <Text style={styles.editButtonText}>Düzenle</Text>
              </TouchableOpacity>
               )}
            </View>
            <ScrollView
              style={styles.cardContent}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.noteText}>
                {notes[note.id] || "Not eklemek için tıklayın"}
              </Text>
            </ScrollView>
          </View>
        ))}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cancelEdit}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {NOTE_TYPES[activeNoteType]?.title}
              </Text>

              <TextInput
                style={styles.input}
                multiline
                placeholder={NOTE_TYPES[activeNoteType]?.placeholder}
                value={tempNote}
                onChangeText={setTempNote}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={cancelEdit}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.saveButton,
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={saveNote}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Kaydet</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default ServicesNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  view: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#F44336",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    height: height / 4,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  cardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  editButtonText: {
    color: "white",
    fontWeight: "500",
  },
  cardContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  noteText: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    maxHeight: 400,
    textAlignVertical: "top",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 45,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
