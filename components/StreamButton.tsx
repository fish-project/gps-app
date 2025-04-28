import { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Text } from "react-native";
import * as Network from "expo-network";

const STREAM_INTERVAL = 2000; // 2 seconds

const StreamButton = ({ userLatitude, userLongitude }) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null); // Track errors
    const ws = useRef<WebSocket | null>(null);
    const intervalId = useRef<NodeJS.Timeout | null>(null);

    const shipId = '67c1d1c8281547336844ae62'
    const email = 'khang.tranminh047@gmail.com'
    const wsUrl = `ws://${process.env.EXPO_PUBLIC_IP_ADDRESS}:8010/stream/${shipId}/${email}`

    const handleStreamToggle = () => {
        if (isStreaming) {
            // Stop streaming
            if (intervalId.current) clearInterval(intervalId.current);
            ws.current?.close();
            ws.current = null;
            setIsStreaming(false);
        } else {
            // Start streaming
            try {
                ws.current = new WebSocket(wsUrl);

                ws.current.onopen = () => {
                    console.log("WebSocket connected");
                    setError(null); // Clear any previous errors

                    intervalId.current = setInterval(() => {
                        if (userLatitude !== null && userLongitude !== null) {
                            const data = {
                                latitude: userLatitude,
                                longitude: userLongitude,
                            };
                            ws.current?.send(JSON.stringify(data));
                            console.log("Sent:", data);
                        }
                    }, STREAM_INTERVAL);
                };

                ws.current.onclose = () => {
                    console.log("WebSocket closed");
                    if (intervalId.current) clearInterval(intervalId.current);
                    setIsStreaming(false);
                    setError(null);
                };

                ws.current.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    if (intervalId.current) clearInterval(intervalId.current);
                    setIsStreaming(false);
                    setError("Failed to connect to the server. Please check the server and try again.");
                };

                ws.current.onmessage = (event) => {
                    console.log("Received from server:", event.data);
                };

                setIsStreaming(true);
            } catch (error) {
                console.error("Failed to initialize WebSocket:", error);
                setError("Failed to initialize WebSocket connection.");
            }
        }
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (intervalId.current) clearInterval(intervalId.current);
            ws.current?.close();
        };
    }, []);

    return (
        <TouchableOpacity
            className={`py-3 rounded-full shadow-lg items-center ${isStreaming ? "bg-red-500" : "bg-blue-500"
                } ${!wsUrl ? "opacity-50" : ""}`}
            onPress={handleStreamToggle}
            disabled={!wsUrl} // Disable button until wsUrl is ready
        >
            <Text className="text-white font-semibold text-lg">
                {isStreaming ? "Stop Streaming" : wsUrl ? "Start Streaming" : "Loading..."}
            </Text>
            {error && <Text className="text-red-500 mt-2">{error}</Text>}
        </TouchableOpacity>
    );
};

export default StreamButton;