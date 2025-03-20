// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { LineChart,BarChart  } from 'react-native-chart-kit';

// export default function DenemeScreen() {
//     const tarihler = [
//         '2023-01-15', '2023-02-20', '2023-02-11',
//         // ... diğer tarihler
//       ];

//       // Ay bazında gruplama yapmak için bir fonksiyon
//       const gruplaVeSay = (tarihler) => {
//         return tarihler.reduce((acc, tarih) => {
//           const ay = new Date(tarih).getMonth(); // Ayı al (0-11)
//           acc[ay] = (acc[ay] || 0) + 1; // Ayın değerini artır veya 1 olarak başlat
//           return acc;
//         }, {});
//       };

//       // Ay değerlerine göre gruplanmış ve sayılmış veriler
//       const gruplanmisVeriler = gruplaVeSay(tarihler);

//       // Grafikte kullanmak üzere verileri hazırlama
//       const veriSetleri = {
//         labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
//         datasets: [{
//           data: Object.values(gruplanmisVeriler),
//           color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Opsiyonel
//         }]
//       };

//   return (
//     <BarChart
//     data={veriSetleri}
//     width={400} // Ekran genişliğiniz
//     height={220}
//     chartConfig={{
//       backgroundColor: '#e26a00',
//       backgroundGradientFrom: '#fb8c00',
//       backgroundGradientTo: '#ffa726',
//       decimalPlaces: 2, // Ondalık sayı hassasiyeti
//       color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//       labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//       style: {
//         borderRadius: 20
//       },
//       propsForDots: {
//         r: '6',
//         strokeWidth: '2',
//         stroke: '#ffa726'
//       }
//     }}
//     bezier // Eğri çizgiler için
//     style={{
//       marginVertical: 8,
//       borderRadius: 16
//     }}
//     verticalLabelRotation={315}
//   />

//   )
// }

// const styles = StyleSheet.create({})

// // Tarihlerinizi içeren array

// // Grafik bileşenini render etme
// Öncelikle, kütüphaneyi ve gerekli olan react-native-svg'yi yükleyin:
// npm install react-native-chart-kit react-native-svg
// veya
// yarn add react-native-chart-kit react-native-svg
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart, LineChart } from "react-native-chart-kit";
import { callService } from "../../api/CallService";
import PersonelStore from "../Stores/PersonelStore";
import { subMonths, formatISO } from "date-fns";
export default function App() {
  const [totalServices, setTotalServices] = useState(0);

  const [selectedPeriod, setSelectedPeriod] = useState("1");
  const { currentPersonel } = PersonelStore();
  const [services, setServices] = useState([]);
  const [totalServicesCount, setTotalServicesCount] = useState();
  const [didntStarted, setDidnStarted] = useState(0);
  const [openServices, setOpenServices] = useState(0);
  const [closedServices, setClosedServices] = useState(0);
  const [finishedServices, setFinishedServices] = useState(null);
  const windowWidth = Dimensions.get("window").width;
  const [monthlyData, setMonthlyData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const data = {
    labels: [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };
  const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2,
    decimalPlaces: 0,

    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  //   useEffect(() => {
  //     // Veri işleme fonksiyonu
  //     const processData = () => {
  //       // Örnek veriyi gerçek veriyle değiştirin
  //       if (finishedServices.length > 0) {
  //         console.log("length 0 dan büyük")
  //         const realData = finishedServices;

  //         const monthlyCounts = Array(12).fill(0);

  //         realData.forEach((item) => {

  //           const date = new Date(item.CLODATE.split(" ")[0]);
  //           const month = date.getMonth();
  //           console.log(month)
  //           monthlyCounts[month]++;
  //         });

  //         setMonthlyData(monthlyCounts);
  //       } else {
  //         setMonthlyData([]);
  //       }
  //     };

  //     processData();
  //   }, [finishedServices]);

  // console.log("monthly data: ", monthlyData)

  //------------ BURASI GÜZEL ÇALIŞIYOR TEKRAR KULLANILABİLİR ----------------
//   const countServicesPerMonth = (data) => {
//     const serviceCounts = {};
//     //const serviceCounts = Array(12).fill(0);

//     data.forEach((item) => {
//       const month = parseInt(item.CLODATE.split(".")[1],10);
//       if (serviceCounts[month]) {
//         serviceCounts[month] += 1;
//       } else {
//         serviceCounts[month] = 1;
//       }
//     });
// console.log("service Count: " , serviceCounts);
//     return serviceCounts;
//   };
//   const prepareChartData = (serviceCounts) => {
//       const labels = Object.keys(serviceCounts).sort();
//       const values = labels.map((month) => serviceCounts[month]);

//       return {
//         labels,
//         datasets: [{ data: values }],
//       };
//     };

  //------------ BURASI GÜZEL ÇALIŞIYOR TEKRAR KULLANILABİLİR ----------------

    const countServicesPerMonth = (data, startMonth, startYear) => {
      const serviceCounts = Array(12).fill(0); // 12 aylık bir dizi oluşturuluyor

      data.forEach((item) => {
        const [day, month, year] = item.CLODATE.split(" ")[0].split(".");
       
        const date = new Date(year, month - 1, day);
        console.log(`Yıl: ${date.getFullYear()}, Ay: ${date.getMonth() + 1}, startyear: ${startYear}, startMonth: ${startMonth}`)
        const monthDiff =
          (date.getFullYear() - startYear) * 12 + (date.getMonth() - startMonth);
          console.log(monthDiff)
        if (monthDiff >= 0 && monthDiff < 12) {
          serviceCounts[monthDiff]++;
        }
      });
console.log("serviceCounts: ", serviceCounts)
      return serviceCounts;
    };

  const prepareChartData = (serviceCounts, startMonth) => {
    const labels = Array.from({ length: 12 }, (_, i) => {
      const month = (startMonth + i) % 12 || 12;
      const monthName = new Date(0, month - 1).toLocaleString("default", {
        month: "short",
      });
      return monthName;
    });
  
   console.log("labels: ", labels)
   console.log("datasets: ", serviceCounts)
    
    return {
      labels,
      datasets: [{ data: serviceCounts }],
    };
  };

  useEffect(() => {
    const now = new Date();
    let date = "";
    if (selectedPeriod == "1") {
      date = subMonths(now, 1);
    } else if (selectedPeriod == "3") {
      date = subMonths(now, 3);
    } else if (selectedPeriod == "6") {
      date = subMonths(now, 6);
    } else if (selectedPeriod == "12") {
      date = subMonths(now, 12);
    }
    handleCallServices(date);
  }, [selectedPeriod]);

  const handleCall1YearServices = async () => {
    let personelSorguName = currentPersonel.PASSW;
    if (currentPersonel.YETKI == "1") {
      personelSorguName = "%";
    }
    try {
      const now = new Date();
      date = subMonths(now, 12);
      const result = await callService(5, "%", date, personelSorguName);
      if (result) {
        if (result.length > 0) {
          setFinishedServices(
            result.filter(
              (service) => service.STATUS == "2" || service.STATUS == "3"
            )
          );
        } else {
          console.log("lol");
        }
      } else {
        //setServices([])
      }
    } catch (err) {
      console.log(err);
    }
  };

  
  useEffect(() => {
    handleCall1YearServices();

    
  }, []);



  const countJobsInAugust = (finishedServices) => {
    // Ağustos ayı için ay değeri 8'dir
    const augustMonth = 10;
    let augustCount = 0;
  
    finishedServices.forEach((job) => {
      const month = parseInt(job.CLODATE.split(".")[1], 10);
      if (month === augustMonth) {
        augustCount++;
      }
    });
  
    return augustCount;
  };
  //   useEffect(() => {
  //     if (finishedServices) {

  //       const sortedServices = finishedServices.sort(
  //         (a, b) => new Date(a.CLODATE) - new Date(b.CLODATE)
  //       );

  //       const serviceCounts = countServicesPerMonth(sortedServices);
  //       console.log("buralara tekrar girdi mi");

  //       setChartData(prepareChartData(serviceCounts));
  //     }
  //   }, [finishedServices]);

  useEffect(() => {
    if (finishedServices) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const serviceCounts = countServicesPerMonth(finishedServices, currentYear, currentMonth);
   
   //   const newChartData = prepareChartData(serviceCounts);
      const newChartData = prepareChartData(serviceCounts, currentMonth + 1);
  //    console.log(newChartData);
        //setChartData(newChartData);
//          const augustJobsCount = countJobsInAugust(finishedServices);
//  console.log(`Ağustos ayında tamamlanan iş sayısı: ${augustJobsCount}`);
    }
  }, [finishedServices]);

  //console.log("char data: ", chartData);
  const handleCallServices = async (stadate) => {
    let personelSorguName = currentPersonel.PASSW;
    if (currentPersonel.YETKI == "1") {
      personelSorguName = "%";
    }
    try {
      const result = await callService(5, "%", stadate, personelSorguName);
      if (result) {
        if (result.length > 0) {
          setServices(result);
        } else {
          setServices([result]);
        }
      } else {
        //setServices([])
      }
    } catch (err) {
      console.log(err);
    }
  };
  //   useEffect(() => {
  //     const gruplaVeSay = (tarihler) => {
  //                 return tarihler.reduce((acc, tarih) => {
  //                   const ay = new Date(tarih).getMonth(); // Ayı al (0-11)
  //                   acc[ay] = (acc[ay] || 0) + 1; // Ayın değerini artır veya 1 olarak başlat
  //                   return acc;
  //                 }, {});
  //               };
  //   },[finishedServices])
  useEffect(() => {
    setTotalServicesCount(services.length);
    setDidnStarted(services.filter((service) => service.STATUS == "0").length);
    setOpenServices(services.filter((service) => service.STATUS == "1").length);

    setClosedServices(
      services.filter(
        (service) => service.STATUS == "2" || service.STATUS == "3"
      ).length
    );
  }, [services]);
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Teknik Servis Raporlama Ekranı
      </Text>

      <Text>Kullanıcı Bilgileri:</Text>
      <Text>Kullanıcı Adı: {currentPersonel.USERS}</Text>

      <View style={styles.containerDatePicker}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "1" && styles.selectedButton,
          ]}
          onPress={() => setSelectedPeriod("1")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === "1" && styles.selectedText,
            ]}
          >
            Son 1 Ay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "3" && styles.selectedButton,
          ]}
          onPress={() => setSelectedPeriod("3")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === "3" && styles.selectedText,
            ]}
          >
            Son 3 Ay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "6" && styles.selectedButton,
          ]}
          onPress={() => setSelectedPeriod("6")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === "6" && styles.selectedText,
            ]}
          >
            Son 6 Ay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "12" && styles.selectedButton,
          ]}
          onPress={() => setSelectedPeriod("12")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === "12" && styles.selectedText,
            ]}
          >
            Son 1 Yıl
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 18 }}>
        Servis İstatistikleri:
      </Text>
      <Text>Toplam Servis Sayısı: {totalServicesCount}</Text>
      <Text>Başlanmamış Servis Sayısı: {didntStarted}</Text>
      <Text>Açık Servis Sayısı: {openServices}</Text>
      <Text>Tamamlanan Servis Sayısı: {closedServices}</Text>
      {chartData.length != 0 && (
        <>
          <Text style={{ fontWeight: "bold", marginTop: 20, fontSize: 20 }}>
            Son 1 Yıllık Servis Bitirme Grafiği
          </Text>
          <LineChart
            data={chartData}
            width={windowWidth}
            height={300}
            fromZero={true}
            yAxisInterval={2}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            verticalLabelRotation={270}
            xLabelsOffset={25}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
  },
  selectedText: {
    color: "white",
  },
  containerDatePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginVertical: 8,
  },
});
