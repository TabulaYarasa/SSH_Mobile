import JobsInfo from "../src/screens/JobDetail/JobsInfo";
import JobsProccess from "../src/screens/JobDetail/JobsProccess";
import JobsPrice from "../src/screens/JobDetail/JobsPrice";
import JobAriza from "../src/screens/JobDetail/FinishService";
import { Foundation, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Bilgiler from "../src/screens/Ziyaretler/Tabs/Bilgiler";
import Ikinci from "../src/screens/Ziyaretler/Tabs/Ikinci";
import EskiZiyaretler from "../src/screens/Ziyaretler/Tabs/EskiZiyaretler";
import YeniZiyaret from "../src/screens/Ziyaretler/Tabs/YeniZiyaret";


export default function ZiyaretTabs() {

const Tab = createMaterialTopTabNavigator();

    return (
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 12, // Etiket yazı tipi boyutunu ayarlayın
          },
          tabBarIconStyle: {
            width: 20, // Simge genişliğini ayarlayın
            height: 20,
            alignItems: "center",
            // Simge yüksekliğini ayarlayın
          },
        }}
      >
        <Tab.Screen
          name="Bilgiler"
          component={Bilgiler}
         
          options={{
            tabBarLabel: "Bilgiler",
            tabBarIcon: ({ color, size }) => (
              <Foundation name="list" size={20} color="black" />
            ),
          }}
        />
          <Tab.Screen
          name="EskiZiyaretler"
          component={EskiZiyaretler}
         
          options={{
            tabBarLabel: "Eski Ziyaretler",
            tabBarIcon: ({ color, size }) => (
              <Foundation name="list" size={20} color="black" />
            ),
          }}
        />
        {/* <Tab.Screen
          name="Proccess"
          component={Ikinci}
          options={{
            tabBarLabel: "Parçalar",
            tabBarIcon: ({ color, size }) => (
              <Foundation name="clipboard-pencil" size={20} color="black" />
            ),
          }}
        /> */}
             <Tab.Screen
          name="YeniZiyaret"
          component={YeniZiyaret}
          options={{
            tabBarLabel: "Yeni Ziyaret",
            tabBarIcon: ({ color, size }) => (
              <Foundation name="clipboard-pencil" size={20} color="black" />
            ),
          }}
        />
        {/* <Tab.Screen
          name="Price"
          component={JobsPrice}
          options={{
            tabBarLabel: "Ücret",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="attach-money" size={20} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Ariza"
          component={JobAriza}
          options={{
            tabBarLabel: "Servis Bitir",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="wrench" s size={20} color="black" />
            ),
          }}
        /> */}
      </Tab.Navigator>
    );
  }
  