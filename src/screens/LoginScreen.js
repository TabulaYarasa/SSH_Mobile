import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import React, {useState } from "react";


import PersonelStore from "../Stores/PersonelStore";
import { callPersonelTablo } from "../../api/CallPersonelTablo";

export default function LoginScreen({ navigation }) {
  const [isim, setIsim] = useState("");
  const [sifre, setSifre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibility, setVisibility] = useState(true);
  const { setCurrentPersonel } = PersonelStore();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await callPersonelTablo(isim, sifre);

      if (result) {
        setCurrentPersonel(result);
        navigation.navigate("Home");
      } else {
        Alert.alert("Uyarı", "İsim veya Şifre Yanlış");
      }
    } catch (err) {
      console.log("error: ", err);
      Alert.alert("Uyarı", "Servise Bağlanılamadı");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <ActivityIndicator size="large" color="#393939" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/yemsa.jpeg")}
      />

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#6d6c83" />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Kullanıcı Adı"
          value={isim}
          onChangeText={(text) => setIsim(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Entypo name="lock" size={24} color="#6d6c83" />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Şifre"
          secureTextEntry={visibility}
          value={sifre}
          onChangeText={(text) => setSifre(text)}
        />
        <TouchableOpacity onPress={() => setVisibility(!visibility)}>
          <MaterialIcons
            name={visibility ? "visibility" : "visibility-off"}
            size={24}
            color="#6d6c83"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.marginTop}>Servis</Text>
    

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Çıkış",
              "Uygulamadan çıkmak istediğinizie emin misiniz?",
              [
                {
                  text: "Hayır",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "Evet", onPress: () => BackHandler.exitApp() },
              ],
              { cancelable: false }
            );
          }}
          style={styles.iconContainer}
        >
          <Entypo name="circle-with-cross" size={50} color="black" />
          <Text style={styles.marginTop}>Çıkış</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            handleLogin();
          }}
        >
          <AntDesign name="login" size={40} color="black" />
          <Text style={styles.marginTop}>Giriş</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container2}>
        <Text style={styles.text}>Bu uygulama</Text>
        <Image
          style={styles.logo2}
          source={require("../../assets/images/mdi.png")}
        />
        <Text style={styles.text}>tarafından yapılmıştır! ?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 10,
  },

 
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 50,
  },
  logo2: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginHorizontal:5
 
  },


  bottomContainer: {
    width: "80%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  iconContainer: {
    justifyContent: "space-around",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingVertical: 5,
  },
  inputContainer: {
    width: "80%",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    flex: 1,
  },

});
