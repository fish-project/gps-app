import {
    View,
    Modal,
    Text,
    TextInput,
    Button,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useState } from "react";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

const InviteModal = ({ visible, onClose, shipId }: {
    visible: boolean;
    onClose: () => void;
    shipId: string;
}) => {
    const [inviteEmail, setInviteEmail] = useState("");

    const handleInvite = async () => {
        if (!inviteEmail.trim()) {
            Toast.show({ type: "error", text1: "Email is required" });
            return;
        }

        try {
            const token = await SecureStore.getItemAsync("userToken");
            const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:8080/ship`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ shipId, mail: inviteEmail.trim() }),
            });

            const result = await res.json();
            if (res.ok) {
                Toast.show({ type: "success", text1: "Invitation Sent" });
                setInviteEmail("");
                onClose();
            } else {
                Toast.show({ type: "error", text1: "Failed to Invite", text2: result.message || "Unknown error" });
            }
        } catch (e) {
            console.error("Invite error", e);
            Toast.show({ type: "error", text1: "Error sending invite" });
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-11/12"
                    >
                        <View className="bg-white rounded-xl p-4 space-y-4">
                            <Text className="text-xl font-semibold text-black">Invite by Email</Text>
                            <TextInput
                                className="border border-gray-300 p-2 rounded text-black"
                                placeholder="Enter email address"
                                value={inviteEmail}
                                onChangeText={setInviteEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <View className="flex-row justify-between">
                                <Button title="Cancel" onPress={onClose} />
                                <Button title="Invite" onPress={handleInvite} />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default InviteModal;
