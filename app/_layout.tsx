import { Stack, useRouter } from "expo-router";
import "../global.css";
import { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message"
import { StatusBar } from "react-native";

export default function RootLayout() {
    const router = useRouter();
    const [data, setData] = useState(null);

    const verifyToken = async (token: string) => {
        try {
            const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:8000/api/verifyToken.php?token=${token}`);
            const json = await res.json();
            console.log(json)
            setData(json);
            return json;
        } catch (e) {
            console.error("Token verification failed:", e);
            return { code: 500 };
        }
    };

    useEffect(() => {
        const handleDeepLink = async ({ url }: { url: string }) => {
            const { queryParams } = Linking.parse(url);

            if (queryParams?.token && typeof queryParams.token === "string") {
                const receivedToken = queryParams.token;
                const result = await verifyToken(receivedToken);

                if (result.code === 200) {
                    try {
                        await SecureStore.setItemAsync("userToken", receivedToken);
                        console.log("Token stored securely!");
                        router.replace("/Home");
                    } catch (error) {
                        console.error("Failed to store token securely:", error);
                        alert("Login Failed: Could not save session.");
                    }
                } else {
                    alert("Invalid or expired token.");
                }
            } else {
                console.warn("Deep link received without a valid token:", queryParams);
            }
        };

        const subscription = Linking.addEventListener("url", handleDeepLink);

        Linking.getInitialURL()
            .then((url) => {
                if (url) {
                    handleDeepLink({ url });
                }
            })
            .catch((err) => console.error("Failed to get initial URL", err));

        return () => {
            subscription.remove();
        };
    }, [router]);

    useEffect(() => {
        const checkExistingToken = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync("userToken");
                if (storedToken) {
                    const result = await verifyToken(storedToken);
                    if (result.code === 200) {
                        router.replace("/Home");
                    } else {
                        await SecureStore.deleteItemAsync("userToken");
                        router.replace("/sign_in");
                    }
                } else {
                    router.replace("/sign_in");
                }
            } catch (error) {
                console.error("Error checking for existing token:", error);
            }
        };
        checkExistingToken();
    }, [router]);

    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast/>
        </>
    )
    
}
