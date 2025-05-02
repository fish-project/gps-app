import { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

const STREAM_INTERVAL = 2000;

const StreamButton = ({ userLatitude, userLongitude }) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [wsUrl, setWsUrl] = useState<string | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const intervalId = useRef<NodeJS.Timeout | null>(null);

    const shipId = '67c1d1c8281547336844ae62';
    // const email = 'khang.tran@hcmut.edu.vn'

    useEffect(() => {
        const prepareWebSocketUrl = async () => {
            const token = await SecureStore.getItemAsync("userToken");
            if (!token) return;

            try {
                const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
                const email = payload.sub;
                const url = `ws://${process.env.EXPO_PUBLIC_IP_ADDRESS}:8010/stream/${shipId}/${email}`;
                setWsUrl(url);
            } catch (e) {
                console.error("Invalid token format:", e);
                setError("Invalid stored token");
            }
        };
        prepareWebSocketUrl();
    }, []);

    const handleStreamToggle = () => {
        if (!wsUrl) return;

        if (isStreaming) {
            if (intervalId.current) clearInterval(intervalId.current);
            ws.current?.close();
            setIsStreaming(false);
        } else {
            try {
                ws.current = new WebSocket(wsUrl);

                ws.current.onopen = () => {
                    console.log("WebSocket connected");
                    Toast.show({
                        type: "success",
                        text1: "Streaming Started",
                        text2: "Your location is now being streamed.",
                    });
                    intervalId.current = setInterval(() => {
                        if (
                            userLatitude !== null &&
                            userLongitude !== null &&
                            !isNaN(userLatitude) &&
                            !isNaN(userLongitude)
                        ) {
                            const data = { latitude: userLatitude, longitude: userLongitude };
                            ws.current?.send(JSON.stringify(data));
                            console.log("Sent:", data);
                            Toast.show({
                                type: "success",
                                text1: "Location Sent",
                                text2: `Lat: ${userLatitude}, Lon: ${userLongitude}`,
                                visibilityTime: 1000,
                            });
                        } else {
                            console.warn("Invalid location data, skipping send.");
                        }
                    }, STREAM_INTERVAL);
                };

                ws.current.onclose = () => {
                    console.log("WebSocket closed");
                    if (intervalId.current) clearInterval(intervalId.current);
                    setIsStreaming(false);
                    Toast.show({
                        type: "error",
                        text1: "Closing streaming"
                    })
                };

                ws.current.onerror = (event) => {
                    console.error("WebSocket error event:", event);
                    if (intervalId.current) clearInterval(intervalId.current);
                    setIsStreaming(false);
                    setError("WebSocket connection error");
                };

                ws.current.onmessage = (event) => {
                    console.log("Received from server:", event.data);
                };

                setIsStreaming(true);
                setError(null);
            } catch (e) {
                console.error("WebSocket init failed:", e);
                setError("Failed to initialize WebSocket.");
            }
        }
    };

    useEffect(() => {
        return () => {
            if (intervalId.current) clearInterval(intervalId.current);
            ws.current?.close();
        };
    }, []);

    return (
        <TouchableOpacity
            className={`py-3 rounded-full shadow-lg items-center ${isStreaming ? "bg-red-500" : "bg-blue-500"} ${!wsUrl ? "opacity-50" : ""}`}
            onPress={handleStreamToggle}
            disabled={!wsUrl}
        >
            <Text className="text-white font-semibold text-lg">
                {isStreaming ? "Stop Streaming" : wsUrl ? "Start Streaming" : "Loading..."}
            </Text>
        </TouchableOpacity>
    );
};

export default StreamButton;