import { StyleSheet } from "react-native";

import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: colors.blue[500],
  },
  title: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.white,
  },
});
