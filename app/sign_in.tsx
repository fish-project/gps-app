import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native"
import  React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import images from "@/constants/images"
import * as WebBrowser from "expo-web-browser"
import * as Linking from "expo-linking"
import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"

const SignIn = () => {
    const IP_ADDRESS = process.env.EXPO_PUBLIC_IP_ADDRESS
    const SSO_HOST = `http://${IP_ADDRESS}:8000`;
    const CALLBACK_URI = "myapp://callback"

    const handleLogin = async () => {
        const loginUrl = `${SSO_HOST}/login?redirect=${encodeURIComponent(CALLBACK_URI)}`;
        
        console.log("Attempting to open SSO login URL:", loginUrl);
        try {
            const result = await WebBrowser.openAuthSessionAsync(loginUrl, CALLBACK_URI);

            if (result.type === 'success' && result.url) {
                console.log(`Redirected URL: ${result.url}`)

                const { queryParams } = Linking.parse(result.url)
                if(queryParams?.token && typeof queryParams.token === 'string') {
                    const receivedToken = queryParams.token;
                    await SecureStore.setItemAsync('userToken', receivedToken)
                    router.replace("/Home")
                }
            } else {
                console.log("Auth session cancelled or failed", result)
            }
        } catch(e) {
                console.log("Failed to fetch open auth session: ", e)
        }
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