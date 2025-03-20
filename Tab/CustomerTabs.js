import CustomerCari from "../src/screens/Customer/CustomerCari";
import CustomerKayit from "../src/screens/Customer/CustomerKayit";
import CustomerCihaz from "../src/screens/Customer/CustomerCihaz";
import CustomerBakiye from "../src/screens/Customer/CustomerBakiye";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons,FontAwesome,MaterialIcons } from '@expo/vector-icons';

export default function CustomerTabs() {

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
          name="Cari"
          component={CustomerCari}
          options={{
            tabBarLabel: "Cari",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="people" size={20} color="black" />
            ),
          }}
        />
            <Tab.Screen
          name="Kayit"
          component={CustomerKayit}
          options={{
            tabBarLabel: "Kayıt",
            tabBarIcon: ({ color, size }) => (
                <FontAwesome name="th-list" size={20} color="black" />
            ),
          }}
        />
              <Tab.Screen
          name="Cihaz"
          component={CustomerCihaz}
          options={{
            tabBarLabel: "Cihaz",
            tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="devices" size={20} color="black" />
            ),
          }}
        />
              <Tab.Screen
          name="Bakiye"
          component={CustomerBakiye}
          options={{
            tabBarLabel: "Bakiye",
            tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="attach-money" size={20} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  