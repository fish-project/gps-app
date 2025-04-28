import { Stack, useRouter } from "expo-router";
import "../global.css";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
    const router = useRouter();

    useEffect(() => {
        const handleDeepLink = async ({ url }: { url: string }) => {
            console.log("Deep link received:", url);
            const { queryParams } = Linking.parse(url);

            if (queryParams?.token && typeof queryParams.token === "string") {
                const receivedToken = queryParams.token;

                console.log("Token received:", receivedToken);
                try {
                    await SecureStore.setItemAsync("userToken", receivedToken);
                    console.log("Token stored securely!");
                    router.replace("/Home");
                } catch (error) {
                    console.error("Failed to store token securely:", error);
                    alert("Login Failed: Could not save session.");
                }
            } else {
                console.warn("Deep link received without a valid token:", queryParams);
            }
        };

        const subscription = Linking.addEventListener("url", handleDeepLink);

        // Check for initial URL (if app opened via deep link)
        Linking.getInitialURL()
            .then((url) => {
                if (url) {
                    console.log("Initial URL detected:", url);
                    handleDeepLink({ url });
                }
            })
            .catch((err) => console.error("Failed to get initial URL", err));

        return () => {
            console.log("Removing deep link listener");
            subscription.remove();
        };
    }, [router]);

    useEffect(() => {
        const checkExistingToken = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync("userToken");
                if (storedToken) {
                    console.log("Found existing token on app load.");
                    router.replace("/Home");
                } else {
                    console.log("No existing token found on app load.");
                }
            } catch (error) {
                console.error("Error checking for existing token:", error);
            }
        };
        checkExistingToken();
    }, [router]);

    return <Stack screenOptions={{ headerShown: false }} />;
}