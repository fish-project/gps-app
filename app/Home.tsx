import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Map from "@/components/Map"
import { useLocationStore } from "@/store"
import { useEffect, useRef, useState } from "react"
import * as Location from "expo-location"
import { MapPin } from "lucide-react-native"
import MapView from "react-native-maps"
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"
import StreamButton from "@/components/StreamButton"
import { User } from "lucide-react-native"

const Home = () => {
    const { setUserLocation, userLatitude, userLongitude } = useLocationStore()
    const [hasPermissions, setHasPermissions] = useState(false)
    const mapRef = useRef<MapView>(null)

    const handleRecenter = () => {
        if (mapRef.current && userLatitude && userLongitude) {
            mapRef.current.animateToRegion({
                latitude: userLatitude,
                longitude: userLongitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
            }, 2000)
        }
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

    // For testing purpose only
    const clearToken = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken')
            router.replace("/")

        } catch (e) {
            console.log('Failed to clear token')
        }
    }

    return (
        <View className="flex-1 bg-gray-100">
            <View className="absolute top-10 right-5 z-[10]">
                <TouchableOpacity
                    className="bg-white p-2 rounded-full shadow-lg"
                    onPress={() => router.push("/profile")}
                >
                    <User size={30} color="black" strokeWidth={2} />
                </TouchableOpacity>
            </View>
            <View className="flex-1">
                <Map ref={mapRef} />

                {/* Current location button */}
                <SafeAreaView className="absolute bottom-20 right-5">
                    <TouchableOpacity className="bg-blue-500 p-4 rounded-full shadow-lg" onPress={handleRecenter}>
                        <MapPin color="white" />
                    </TouchableOpacity>
                </SafeAreaView>

                {/* Send my location button */}
                <SafeAreaView className="absolute bottom-0 left-4 right-4">
                    <StreamButton userLatitude={userLatitude} userLongitude={userLongitude} />

                    {/* This is the button for the clearing token to get back to home screen*/}
                    {/* <TouchableOpacity className="bg-red-100 shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5" onPress={clearToken}>
                        <View className="flex flex-row items-center justify-center ">
                            <Text className="text-lg font-medium text-red-500">Clear Token (For Testing)</Text>
                        </View>
                    </TouchableOpacity> */}
                </SafeAreaView>
            </View>
        </View>
    )
}

export default Home
