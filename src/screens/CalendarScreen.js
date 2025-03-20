import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import "../utility/CalendarSetting";
import { DUMMY_DATES } from "../utility/Dummy_datas";


export default function CalendarScreen() {
  const [selected, setSelected] = useState("");
  const [selectedId, setSelectedId] = useState(null);

// arraydan gelen liste ve seçilen tarih eşleştirmesi yapıp
//flatlistin datasını oluşturur
  const flatListItems = DUMMY_DATES.filter((item) => {
    return item.date === selected;
  });

//takvim üstünde görünecek elemanları oluşturur
  const markedDates = {};
  DUMMY_DATES.forEach((item) => {
    markedDates[item.date] = { marked: true };
  });

  if (selected) {
    markedDates[selected] = { selected: true };
  }

  const dateList = ({ item }) => {
    const itemStyle =
      item == selectedId
        ? { backgroundColor: "#ccc", fontWeight: "bold" } 
        : { backgroundColor: "#fff", fontWeight: "normal" };

    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item)}
        style={[styles.listItem, itemStyle]}
      >
        {item.date === selected && (
          <View>
            <Text style={styles.customerText}>{item.name}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Calendar
        onDayPress={(day) => {
          setSelected(day.dateString);
          markedDates[day.dateString] = { selected: true };
        }}
        firstDay={1}
        markedDates={markedDates}
      />

      <View style={styles.listContainer}>
        <FlatList
          data={flatListItems}
          keyExtractor={(item) => item.name}
          renderItem={dateList}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    marginHorizontal: 2,
    elevation: 4,
    borderRadius: 3,
    borderColor: "#fff",
    padding: 10,
    backgroundColor: "#fff",
  },
  customerText: {
    textAlignVertical: "center",
  },
});
