import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import ServiceStore from "../../Stores/ServiceStore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
// API fonksiyonlarını import edeceğiz
import {
  getAllWorkers,
  getServiceWorkers,
  addWorkerToService,
} from "../../../api/Workers";

const ServiceWorkers = () => {
  const [state, setState] = useState({
    modalVisible: false,
    isLoading: false,
    error: null,
    refreshing: false,
    allWorkers: [], // Tüm çalışanlar listesi
    serviceWorkers: [], // Bu serviste çalışanlar
    selectedWorkers: [], // Modal'da seçilen çalışanlar
    searchText: "", 
  });
  const [datePicker, setDatePicker] = useState({
    isVisible: false,
    mode: "start", // 'start' or 'end'
    worker: null, // Seçili çalışan
  });
  const { storedService } = ServiceStore();
  const isFocused = useIsFocused();
  const hasLoadedOnce = useRef(false); 


  useEffect(() => {
    if (isFocused && !hasLoadedOnce.current) {
      fetchServiceWorkers();
      hasLoadedOnce.current = true;
    }
  }, [isFocused]);


  // Servisteki çalışanları getir
  const fetchServiceWorkers = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const workers = await getServiceWorkers(
        storedService.BREAKDOWNTYPE,
        storedService.BREAKDOWNNUM
      );

     
      const workersArray = Array.isArray(workers) ? workers : [];

      setState((prev) => ({
        ...prev,
        serviceWorkers: workersArray,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
        serviceWorkers: [], 
      }));
    }
  };

  // Tüm çalışanları getir
  const fetchAllWorkers = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const workers = await getAllWorkers();
      setState((prev) => ({ ...prev, allWorkers: workers || [] }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message,allWorkers: workers || []  }));
    }
    finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };


  // Modal açıldığında tüm çalışanları getir
  useEffect(() => {
    if (state.modalVisible) {
      fetchAllWorkers();
    }
  }, [state.modalVisible]);

  const onRefresh = useCallback(() => {
    setState((prev) => ({ ...prev, refreshing: true }));
    fetchServiceWorkers().finally(() =>
      setState((prev) => ({ ...prev, refreshing: false }))
    );
  }, []);

  // Çalışan seçme/seçimi kaldırma
  const toggleWorkerSelection = (worker) => {
    setState((prev) => {
      const isSelected = prev.selectedWorkers.some(
        (selectedWorker) => selectedWorker.PASSW === worker.PASSW
      );

      if (isSelected) {
        // Eğer seçiliyse, listeden çıkar
        return {
          ...prev,
          selectedWorkers: prev.selectedWorkers.filter(
            (selectedWorker) => selectedWorker.PASSW !== worker.PASSW
          ),
        };
      } else {
        // Seçili değilse, tüm worker objesini listeye ekle
        return {
          ...prev,
          selectedWorkers: [...prev.selectedWorkers, worker],
        };
      }
    });
  };
  const filteredWorkers = state.allWorkers.filter(
    worker => 
      !state.serviceWorkers.find(sw => sw.PASSW === worker.PASSW) &&
      (worker.PERSONNELNAME?.toLowerCase().includes(state.searchText.toLowerCase()) ||
       worker.PERSONNELNUM?.toLowerCase().includes(state.searchText.toLowerCase()))
  );
  const validateWorkerDates = () => {
    const invalidWorkers = state.selectedWorkers.filter(
      (worker) => !worker.startTime || !worker.endTime
    );

    if (invalidWorkers.length > 0) {
      Alert.alert(
        "Eksik Bilgi",
        "Bazı çalışanların başlangıç veya bitiş tarihleri seçilmemiş. Lütfen tüm tarihleri seçin.",
        [{ text: "Tamam" }]
      );
      return false;
    }
    return true;
  };

  // Seçili çalışanları servise ekle
  const addSelectedWorkers = async () => {
    if (!validateWorkerDates()) {
      return;
    }

    const requestBody = {
      breakdowntype: storedService.BREAKDOWNTYPE,
      breakdownnum: storedService.BREAKDOWNNUM,
      calisanlar: state.selectedWorkers.map((worker) => ({
        personnelnum: worker.PERSONNELNUM, // Çalışanın numarası
        personnelname: worker.PERSONNELNAME, // Çalışanın adı
        startdate: worker.startTime ? new Date(worker.startTime.getTime() - (worker.startTime.getTimezoneOffset() * 60000)).toISOString() : null,
        enddate: worker.endTime ? new Date(worker.endTime.getTime() - (worker.endTime.getTimezoneOffset() * 60000)).toISOString() : null,
        status: worker.status || "", // Durum (opsiyonel)
        statusdetail: worker.statusdetail || "", // Durum detayları (opsiyonel)
        stext: worker.stext || "", // Ek metin (opsiyonel)
      })),
    };
    console.log("---")
    console.log(requestBody)
    console.log("---")
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Her seçili çalışan için API çağrısı - artık tüm worker bilgileri mevcut
        const response = await addWorkerToService(requestBody);
   //   console.log(response)
      setState((prev) => ({
        ...prev,
        modalVisible: false,
        selectedWorkers: [], // Seçimleri temizle
        isLoading: false,
      }));

      fetchServiceWorkers();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  };

  const handleDateConfirm = (date) => {
    setState((prev) => {
      const updatedWorkers = prev.selectedWorkers.map((worker) => {
        if (worker.PASSW === datePicker.worker.PASSW) {
          return {
            ...worker,
            [datePicker.mode === "start" ? "startTime" : "endTime"]: date,
          };
        }
        return worker;
      });
    
      return { ...prev, selectedWorkers: updatedWorkers };
    });
    setDatePicker({ ...datePicker, isVisible: false });
  };
  // Çalışan kartı bileşeni
  const WorkerCard = ({ worker, selectable, selected }) => {
    // Seçili çalışanın güncel bilgilerini alın
    const selectedWorker = state.selectedWorkers.find(
      (selectedWorker) => selectedWorker.PASSW === worker.PASSW
    );

    return (
      <TouchableOpacity
        style={[styles.workerCard, selected && styles.selectedWorkerCard]}
        onPress={() => selectable && toggleWorkerSelection(worker)}
      >
        <Text style={styles.workerName}>{worker.PERSONNELNAME}</Text>
        <Text style={styles.workerTitle}>{worker.PERSONNELNUM}</Text>
        <Text style={styles.workerTitle}>Başlangıç : {worker.STARTDATE}</Text>
        <Text style={styles.workerTitle}>Bitiş : {worker.ENDDATE}</Text>

        {selected && (
      <View style={styles.dateContainer}>
      <TouchableOpacity
        style={[
          styles.dateButton,
          !selectedWorker?.startTime && styles.dateButtonWarning
        ]}
        onPress={() =>
          setDatePicker({ isVisible: true, mode: "start", worker })
        }
      >
                 <Text style={styles.dateButtonText}>
                Başlangıç:{" "}
                {selectedWorker?.startTime
                  ? selectedWorker.startTime.toLocaleString('tr-TR')
                  : "Seç"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dateButton,
                !selectedWorker?.endTime && styles.dateButtonWarning
              ]}
              onPress={() =>
                setDatePicker({ isVisible: true, mode: "end", worker })
              }
            >
              <Text style={styles.dateButtonText}>
                Bitiş:{" "}
                {selectedWorker?.endTime
                  ? selectedWorker.endTime.toLocaleString('tr-TR')
                  : "Seç"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Servisteki çalışanlar listesi */}
      <FlatList
        data={state.serviceWorkers}
        keyExtractor={(item) => item.PERSONNELNUM + item.STARTDATE}
        renderItem={({ item }) => (
          <WorkerCard worker={item} selectable={false} />
        )}
        refreshControl={
          <RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Servisteki Çalışanlar</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                setState((prev) => ({ ...prev, modalVisible: true }))
              }
            >
              <Text style={styles.addButtonText}>Çalışan Ekle</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Serviste çalışan bulunmamaktadır</Text>
        }
      />

      <DateTimePickerModal
        isVisible={datePicker.isVisible}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePicker({ ...datePicker, isVisible: false })}
      />

      {/* Çalışan ekleme modalı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={state.modalVisible}
        onRequestClose={() =>
          setState((prev) => ({
            ...prev,
            modalVisible: false,
            selectedWorkers: [],
            searchText: "",
          }))
        }
      >
     
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          {state.isLoading && (
          <View >
            <ActivityIndicator size="large" color="#488130" />
          </View>
        )}
            <Text style={styles.modalTitle}>Çalışan Ekle</Text>
            <View style={styles.searchContainer}>
    <TextInput
      style={styles.searchInput}
      placeholder="Çalışan Ara..."
      value={state.searchText}
      onChangeText={(text) => setState(prev => ({ ...prev, searchText: text }))}
    />
  </View>
            <FlatList
              // data={state.allWorkers.filter(
              //   (worker) =>
              //     !state.serviceWorkers.find((sw) => sw.PASSW === worker.PASSW)
              // )}
              data={filteredWorkers}
              keyExtractor={(item) => item.PASSW}
              extraData={state.selectedWorkers}
              renderItem={({ item }) => (
                <WorkerCard
                  worker={item}
                  selectable={true}
                  selected={state.selectedWorkers.some(
                    (selectedWorker) => selectedWorker.PASSW === item.PASSW
                  )}
                />
              )}
              style={styles.modalList}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() =>
                  setState((prev) => ({
                    ...prev,
                    modalVisible: false,
                    selectedWorkers: [],
                    searchText: "",
                  }))
                }
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.saveButton,
                  state.selectedWorkers.length === 0 && styles.disabledButton,
                ]}
                onPress={addSelectedWorkers}
                disabled={state.selectedWorkers.length === 0}
              >
                <Text style={styles.buttonText}>Ekle</Text>
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
    backgroundColor: "white",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  workerCard: {
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  selectedWorkerCard: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  workerTitle: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    padding: 16,
    color: "#666",
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalList: {
    maxHeight: "70%",
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
  },
  dateContainer: {
    marginTop: 10,
    gap: 8,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonWarning: {
    backgroundColor: '#ffffff',
    borderColor: '#ffeeba',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  searchContainer: {
    padding: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default ServiceWorkers;
