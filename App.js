import { StatusBar } from "expo-status-bar";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import JobListScreen from "./src/screens/JobListScreen";

import JobTabs from "./Tab/JobTabs";
import JobParcaEkle from "./src/screens/JobDetail/JobParcaEkle";
import MontajListScreen from "./src/screens/MontajListScreen";
import OldServicesScreen from "./src/screens/OldServicesScreen";
import EstimatedPriceScreen from "./src/screens/EstimatedPriceScreen";
import EstimatedTeklifScreen from "./src/screens/EstimatedTeklifScreen";
import Counter from "./src/Count";
import StokScreen from "./src/screens/StokScreen";
import FaturaScreen from "./src/screens/JobDetail/FaturaScreen";
import RaporlamaScreen from "./src/screens/RaporlamaScreen";
import Toast from "react-native-toast-message";
import MontajDetailScreen from "./src/screens/Montaj/MontajDetailScreen";
import MontajTabs from "./Tab/MontajTabs";
import BasePdfDeneme from "./src/screens/BasePdfDeneme";
import MontajFaturaScreen from "./src/screens/Montaj/MontajFaturaScreen";
import MusteriZiyaretleri from "./src/screens/Ziyaretler/MusteriZiyaretleri";
import ZiyaretTabs from "./Tab/ZiyaretTabs";
import AddMaterial from "./src/screens/JobDetail/AddMaterials";
const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
import * as Updates from "expo-updates";
import { useEffect } from "react";

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Calendar" component={CalendarScreen} />
    </Tab.Navigator>
  );
}
function EstimatedTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="EstimatedPrice"
        component={EstimatedPriceScreen}
        options={{ title: "Parça Ekle" }}
      />
      <Tab.Screen
        name="EstimatedTeklif"
        component={EstimatedTeklifScreen}
        options={{ title: "Teklif" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {

async function onFetchUpdateAsync(){
  try{
    const update = await Updates.checkForUpdateAsync();
    if(update.isAvailable){
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  }catch(err){
    alert("error fetching update",err);
  }
}

useEffect(()=>{
  onFetchUpdateAsync()
},[])

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Count" component={Counter} />
        <Stack.Screen name="Stok" component={StokScreen} />
        <Stack.Screen name="Fatura" component={FaturaScreen} />
        <Stack.Screen name="MontajFatura" component={MontajFaturaScreen} />
        <Stack.Screen name="Raporlama" component={RaporlamaScreen} />
        <Stack.Screen name="BasePdf" component={BasePdfDeneme} />
        <Stack.Screen
          name="MontajList"
          component={MontajListScreen}
          options={{ headerShown: true, title: "Montaj Listesi" }}
        />
        <Stack.Screen
          name="AddMaterial"
          component={AddMaterial}
          options={{ headerShown: true, title: "Parça Ekle" }}
        />
          <Stack.Screen
          name="ParcaEkle"
          component={JobParcaEkle}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="OldServices"
          component={OldServicesScreen}
          options={{ headerShown: true, title: "Eski Servisler" }}
        />
        <Stack.Screen
          name="EstimatedTabs"
          component={EstimatedTabs}
          options={{
            headerShown: true,

            title: "TAHMİNİ TEKLİF",
          }}
        />
        <Stack.Screen
          name="Tabs"
          component={MyTabs}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="Ziyaretler"
          component={MusteriZiyaretleri}
          options={{ headerShown: true, title: "Ziyaretler" }}
        />

        <Stack.Screen
          name="JobTabs"
          component={JobTabs}
          options={{ headerShown: true, title: "SERVİS" }}
        />
         <Stack.Screen
          name="ZiyaretTabs"
          component={ZiyaretTabs}
          options={{ headerShown: true, title: "MÜŞTERİ ZİYARETİ" }}
        />
        <Stack.Screen
          name="MontajTabs"
          component={MontajTabs}
          options={{ headerShown: true, title: "MONTAJ" }}
        />

        <Stack.Screen
          name="JobList"
          component={JobListScreen}
          options={{ headerShown: true, title: "Servis Listesi" }}
        />
        {/* <Stack.Screen
          name="MontajDetail"
          component={MontajDetailScreen}
          options={{ headerShown: true }}
        /> */}
      
      </Stack.Navigator>

      <Toast />
    </NavigationContainer>
  );
}
