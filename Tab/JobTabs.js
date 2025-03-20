import JobsInfo from "../src/screens/JobDetail/JobsInfo";
import JobsProccess from "../src/screens/JobDetail/JobsProccess";
import JobsPrice from "../src/screens/JobDetail/JobsPrice";
import JobAriza from "../src/screens/JobDetail/FinishService";
import { Foundation, MaterialIcons, FontAwesome,Octicons  } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ServicesNotes from "../src/screens/JobDetail/ServicesNotes";
import { ActivityIndicator, View } from "react-native";
import { add } from "date-fns";
import AddWorkers from "../src/screens/JobDetail/AddWorkers";

export default function JobTabs() {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 12, // Sekme etiket yazı tipi boyutu
        },
        tabBarIconStyle: {
          width: 20, // Simge genişliği
          height: 20, // Simge yüksekliği
          alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="Info"
        component={JobsInfo}
        options={{
          tabBarLabel: "Bilgiler",
          tabBarIcon: () => <Foundation name="list" size={20} color="black" />,
        }}
      />
      <Tab.Screen
        name="Proccess"
        component={JobsProccess}
        options={{
          tabBarLabel: "Parçalar",
          tabBarIcon: () => (
            <Foundation name="clipboard-pencil" size={20} color="black" />
          ),
        }}
      />

      <Tab.Screen
        name="Notes"
        component={ServicesNotes}
        options={{
          tabBarLabel: "Notlar",
          tabBarIcon: () => (
            <MaterialIcons name="notes" size={24} color="black" />
          ),
        }}
      />

      <Tab.Screen
        name="Workers"
        component={AddWorkers}
        options={{
          tabBarLabel: "Çalışan Ekle",
          tabBarIcon: () => (
            <Octicons name="person-add" size={24} color="black" />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Proccess"
        component={JobsProccess}
        options={{
          tabBarLabel: "Parçalar",
          tabBarIcon: () => (
            <Foundation name="clipboard-pencil" size={20} color="black" />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Ariza"
        component={JobAriza}
        options={{
          tabBarLabel: "Servis Bitir",
          tabBarIcon: () => (
            <FontAwesome name="wrench" size={20} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
