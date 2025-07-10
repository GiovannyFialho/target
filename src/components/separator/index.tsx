import { type ColorValue, View } from "react-native";

import { styles } from "@/components/separator/styles";

type SeparatorProps = {
  color: ColorValue;
};

export function Separator({ color }: SeparatorProps) {
  return <View style={[styles.container, { backgroundColor: color }]} />;
}
