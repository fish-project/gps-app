import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Map from "@/components/Map"
import { useLocationStore } from "@/store"
import { useEffect, useRef, useState } from "react"
import * as Location from "expo-location"
import { MapPin } from "lucide-react-native"
import MapView from "react-native-maps"

const Home = () => {
    const { setUserLocation, userLatitude, userLongitude } = useLocationStore()
    const [hasPermissions, setHasPermissions] = useState(false)
    const mapRef = useRef<MapView>(null)

    const handleRecenter = () => {
        if(mapRef.current && userLatitude && userLongitude) {
            mapRef.current.animateToRegion({
                latitude: userLatitude,
                longitude: userLongitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
            }, 2000)
        }
    }

    const handleDestinationPress = () => {
        console.log("something")
    }

    useEffect(() => {
        let isMounted = true 

        const requestLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()

            if (status !== 'granted') {
                setHasPermissions(false)
                return
            }

            let location = await Location.getCurrentPositionAsync()

            if (!isMounted) return

            const addressData = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })

            const formattedAddress = addressData.length > 0 
                ? `${addressData[0].name}, ${addressData[0].region}` 
                : "Unknown Location"

            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                address: formattedAddress
            })
        }

        requestLocation()

        return () => {
            isMounted = false
        }
    }, [setUserLocation])

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="flex-1">
                <Map ref={mapRef}/> 

                {/* Current location button */}
                <View className="absolute bottom-24 right-5">
                    <TouchableOpacity className="bg-blue-500 p-4 rounded-full shadow-lg" onPress={handleRecenter}>
                        <MapPin color="white"/>
                    </TouchableOpacity>
                </View>

                {/* Send my location button */}
                <View className="absolute bottom-0 left-4 right-4">
                    <TouchableOpacity 
                        className="bg-blue-500 py-3 rounded-full shadow-lg items-center"
                        // onPress={handleShareLocation}
                    >
                        <Text className="text-white font-semibold text-base">Send My Location</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Home
