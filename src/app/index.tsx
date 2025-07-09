import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 30 }}>Hello, World</Text>

      <Button title="Target" onPress={() => router.navigate("/target")} />

      <Button
        title="Transação"
        onPress={() => router.navigate("/transaction/30")}
      />
    </View>
  );
}
