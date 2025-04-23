import { ScrollView, Text, View, Image, TouchableOpacity, Platform, Linking } from "react-native"
import  React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import images from "@/constants/images"
import { Link, useRouter } from "expo-router"
import Constants from "expo-constants"

const SignIn = () => {
    const IP_ADDRESS = "10.229.109.165"
    const SSO_HOST = `http://${IP_ADDRESS}:8000`;
    const CALLBACK_URI = "myapp://callback"
    const LOGIN_ROUTE = `http://localhost:8000/receive`

    const handleLogin = () => {
        const loginUrl = `${SSO_HOST}/receive?redirect=${encodeURIComponent(CALLBACK_URI)}`;
        
        console.log("Attempting to open SSO login URL:", loginUrl);
        Linking.openURL(loginUrl).catch(err => {
            console.error("Failed to open URL:", err);
            alert("Could not open the login page. Please check the server address and network connection.");
        });
    }

     return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerClassName="h-full"> 
                <Image source={images.prow} className="w-full h-4/6" resizeMode="contain"/>

                <View className="px-10">
                    <Text className="text-base text-center uppercase text-black-200">Welcome to GPS App</Text>

                    <Text className="text-3xl font-bold text-black-300 text-center mt-2">
                        Let's know your {"\n"}
                        <Text className="text-blue-500">Location</Text>
                    </Text>

                    <Text className="text-lg text-black-200 text-center mt-10">Login to GPS App with SSO</Text>
                    <TouchableOpacity className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5" onPress={handleLogin}>
                        <View className="flex flex-row items-center justify-center ">
                            <Image 
                                source={images.cloud_password}
                                className="w-7 h-7"
                                resizeMode="contain"
                            />
                            <Text className="text-lg font-medium text-black-300 ml-2">Continue with SSO</Text>
                        </View>
                        
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
     )
}

export default SignIn