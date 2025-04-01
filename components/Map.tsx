import { useLocationStore } from "@/store"
import { Dimensions, View, ActivityIndicator } from "react-native"
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps"
import { forwardRef } from "react" // Add forwardRef import

const { width, height } = Dimensions.get("window")

const Map = forwardRef((props, ref) => { // Use forwardRef to pass ref to MapView
    const { userLongitude, userLatitude } = useLocationStore()

    if (userLatitude === null || userLongitude === null) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    return (
        <MapView
            ref={ref} // Pass the ref here
            style={{ width, height }}
            provider={PROVIDER_DEFAULT}
            className="w-full h-full"
            initialRegion={{
                latitude: userLatitude,
                longitude: userLongitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
            }}
            showsUserLocation={true}
            tintColor="black"
            showsPointsOfInterest={false}
            userInterfaceStyle="light"
        >
            <Marker coordinate={{ latitude: userLatitude, longitude: userLongitude }} />
        </MapView>
    )
})

export default Map