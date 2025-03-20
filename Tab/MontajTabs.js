
import { Foundation, AntDesign, FontAwesome } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MontajDetailScreen from "../src/screens/Montaj/MontajDetailScreen";
import MontajMatListScreen from "../src/screens/Montaj/MontajMatListScreen";
import MontajOnayScreen from "../src/screens/Montaj/MontajOnayScreen";


export default function MontajTabs() {

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
          name="MontajInfo"
          component={MontajDetailScreen}
         
          options={{
            tabBarLabel: "Bilgiler",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="infocirlceo" size={20} color="black" />
            ),
          }}
        />
            <Tab.Screen
          name="MontajMatList"
          component={MontajMatListScreen}
         
          options={{
            tabBarLabel: "Malzemeler",
            tabBarIcon: ({ color, size }) => (
              <Foundation name="list" size={20} color="black" />
            ),
          }}
        />
      
      <Tab.Screen
          name="MontajOnay"
          component={MontajOnayScreen}
         
          options={{
            tabBarLabel: "Onay",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="check" size={24} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  