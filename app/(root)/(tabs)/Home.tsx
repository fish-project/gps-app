// import { Text, View, Button, TextInput, Image } from "react-native"
// import { StatusBar } from "expo-status-bar"
// import { StyleSheet } from "react-native"
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
// import * as Location from "expo-location"
// import React, {useState, useEffect} from "react"

// export default function Home() {
//     const [location, setLocation] = useState(null);
//     const [errorMsg, setErrorMsg] = useState(null);
//     const [time, setTime] = useState(new Date())
//     let locationSubscription = null;

//     useEffect(() => {
//         (
//             async () => {
//                 let {status} = await Location.requestForegroundPermissionsAsync()
//                 if (status !== 'granted') {
//                     setErrorMsg("Quyền truy cập vị trí bị từ chối!");
//                     return;
//                 }

//                 try {
//                     locationSubscription = await Location.watchPositionAsync(
//                         {
//                             accuracy: Location.Accuracy.High,
//                             timeInterval: 500, 
//                             distanceInterval: 1, 
//                         },
//                         (newLocation) => {
//                             setLocation(newLocation);
//                         }
//                     );
//                 } catch (e) {
//                     setErrorMsg(e.message)
//                 }
//             }               
//         )()

//         return () => {
//             if (locationSubscription) {
//                 locationSubscription.remove(); 
//             }
//         };
//     }, [])

//     return(
//         <SafeAreaProvider>
//             <SafeAreaView>
//                 <View>
//                     <TextInput style={style.input}
//                         value="Bro"
//                     />

//                     {location ? (
//                         <Text>
//                         📍 Kinh độ: {location.coords.longitude} {"\n"}
//                         📍 Vĩ độ: {location.coords.latitude}
//                         </Text>
//                     ) : (
//                         <Text>{errorMsg || "Đang lấy vị trí..."}</Text>
//                     )}
//                 </View>
//             </SafeAreaView>
//         </SafeAreaProvider>
//     )
// }

// const style = StyleSheet.create({
//     test: {
//         flex: 1,
//         backgroundColor: "grey"
//     },
//     input: {
//         height: 40,
//         margin: 5,
//         borderWidth: 1,
//         padding: 10
//     }
// })