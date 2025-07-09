import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

export function App() {
  return (
    <View style={styles.container}>
      <StatusBar />

      <Text
        style={{ fontSize: 30, color: colors.gray[100], fontWeight: "700" }}
      >
        Hello World
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue[800],
    alignItems: "center",
    justifyContent: "center",
  },
});
