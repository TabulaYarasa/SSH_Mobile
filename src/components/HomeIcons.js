import { useNavigation } from "@react-navigation/native";
import { View,Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const DeviceWidth = Dimensions.get("window").width;
const iconSize = DeviceWidth * 0.3;


export default function Icon({name, children, onPress}) {
    const navigation = useNavigation()
  return (
    <TouchableOpacity
    
    onPress={() => {
      navigation.navigate(onPress)
    }}
    style={styles.button}
  >
    {children}
    <Text style={styles.text}>{name}</Text>
  </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
 
    button: {
      padding: 20,
      backgroundColor: "#fff",
      elevation: 10,
      shadowColor: "#000",
      borderRadius: 10,
      alignContent: "center",
      alignItems: "center",
      width: iconSize,
      maxWidth:300
    },
    text: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: "bold",
      color: "#000",
      textAlign: "center",
    },
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  });
  