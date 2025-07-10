import { StyleSheet } from "react-native";

import { colors, fontFamily } from "@/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 324,
    justifyContent: "flex-end",
    gap: 24,
    paddingHorizontal: 24,
    paddingBottom: 18,
  },
  label: {
    fontSize: 12,
    color: colors.white,
    fontFamily: fontFamily.regular,
  },
  total: {
    fontSize: 32,
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
});
