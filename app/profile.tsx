import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store"
import { useEffect, useState } from "react";
import InviteModal from "@/components/InviteModal";

const Profile = () => {
    const name = "um...";
    const email = "um...@example.com";
    const ship = "Navigator";
    const [userName, setUserName] = useState(null)
    const [userEmail, setUserEmail] = useState(null)
    const [shipId, setShipId] = useState<string|null>(null)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        const getUserName = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:8080/api/info`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const json = await res.json(); 
                console.log("User info:", json);

                if (res.ok && json.message) {
                    setUserName(json.message.displayName);
                    setUserEmail(json.message.email)
                } else {
                    console.error("Failed to fetch user info:", json);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        const getShip = async () => {
            const token = await SecureStore.getItemAsync("userToken");
            const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:8080/ship`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const json = await res.json();
            setShipId(json.message[0].id);
        };
        getUserName();
        getShip()
    }, []);

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken')
            router.replace("/")

        } catch (e) {
            console.log('Failed to clear token')
        }
    }

    return (
        <View className="flex-1 bg-gray-100">
            <InviteModal visible={modalVisible} onClose={() => setModalVisible(false)} shipId={shipId || ""} />

            {/* Header */}
            <View className="bg-blue-500 px-4 h-44 justify-end pb-4 relative">
                <TouchableOpacity onPress={() => router.replace("/Home")} className="absolute top-12 right-4">
                    <Ionicons name="home-outline" size={30} color="white" />
                </TouchableOpacity>
                <View className="items-center">
                    <View className="absolute -bottom-12 p-6 bg-white rounded-full">
                        <Ionicons name="person-outline" size={32} color="black" />
                    </View>
                </View>
            </View>

            <View className="items-center mt-10">
                <Text className="text-4xl font-semibold text-black">Hello, {userName ?? name}</Text>
            </View>

            {/* Profile Info Section */}
            <View className="mt-10 px-4 space-y-4">
                <View className="bg-white rounded-t-xl p-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Ionicons name="mail-outline" size={24} color="gray" />
                        <Text className="text-lg ml-3 text-gray-700 font-medium">Email</Text>
                    </View>
                    <Text className="text-lg text-gray-500 font-medium">{userEmail ?? email}</Text>
                </View>

                <View className="bg-white p-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Ionicons name="boat-outline" size={24} color="gray" />
                        <Text className="text-lg font-medium ml-3 text-gray-700">Ship Belonged</Text>
                    </View>
                    <Text className="text-lg font-medium text-gray-500">{ship}</Text>
                </View>

                <TouchableOpacity className="bg-white p-4 flex-row items-center" onPress={() => setModalVisible(true)}>
                    <Ionicons name="person-add-outline" size={24} color="gray" />
                    <Text className="text-lg font-medium ml-3 text-gray-700">Invite Others</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-white p-4 flex-row items-center" onPress={() => { }}>
                    <Ionicons name="map-outline" size={24} color="gray" />
                    <Text className="text-lg font-medium ml-3 text-gray-700">Logs</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-white p-4 flex-row items-center" onPress={() => logout()}>
                    <MaterialIcons name="logout" size={24} color="gray" />
                    <Text className="ml-3 font-medium text-lg text-gray-700">Log Out</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-white p-4 flex-row items-center rounded-b-xl" onPress={() => { }}>
                    <Ionicons name="exit-outline" size={24} color="red" />
                    <Text className="font-medium text-lg ml-3 text-red-500">Leave Ship</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Profile;