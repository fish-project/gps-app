import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Profile = () => {
    const name = "James";
    const email = "james@example.com";
    const ship = "Navigator";

    return (
        <View className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="bg-blue-500 px-4 h-44 justify-end pb-4 relative">
                <View className="absolute top-12 right-4">
                    <Ionicons name="home-outline" size={30} color="white" />
                </View>
                <View className="items-center">
                    <View className="absolute -bottom-12">
                        <Image
                            source={{ uri: "https://i.pravatar.cc/150?img=10" }}
                            className="w-24 h-24 rounded-full border-4 border-white"
                        />
                    </View>
                </View>
            </View>

            <View className="items-center mt-10">
                <Text className="text-4xl font-semibold text-black">Hello, {name}</Text>
            </View>

            {/* Profile Info Section */}
            <View className="mt-6 px-4 space-y-4">
                <View className="bg-white rounded-t-xl p-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Ionicons name="mail-outline" size={20} color="gray"/>
                        <Text className="ml-3">Email</Text>
                    </View>
                    <Text className="ml-3 text-gray-700">{email}</Text>
                </View>

                <View className="bg-white p-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Ionicons name="boat-outline" size={20} color="gray" />
                        <Text className="ml-3 text-gray-700">Ship Belonged</Text>
                    </View>
                    <Text className="text-gray-500">{ship}</Text>
                </View>

                <TouchableOpacity className="bg-white rounded-b-xl p-4 flex-row items-center" onPress={() => { }}>
                    <Ionicons name="person-add-outline" size={20} color="gray" />
                    <Text className="ml-3 text-gray-700">Invite Others</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-white p-4 flex-row items-center" onPress={() => { }}>
                    <MaterialIcons name="logout" size={20} color="gray" />
                    <Text className="ml-3 text-gray-700">Log Out</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-white p-4 flex-row items-center" onPress={() => { }}>
                    <Ionicons name="exit-outline" size={20} color="red" />
                    <Text className="ml-3 text-red-500">Leave Ship</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Profile;