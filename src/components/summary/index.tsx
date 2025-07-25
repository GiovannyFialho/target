import { MaterialIcons } from "@expo/vector-icons";
import { ColorValue, Text, View } from "react-native";

import { styles } from "@/components/summary/styles";

export type SummaryProps = {
  label: string;
  value: string;
};

type Props = {
  data: SummaryProps;
  icon: {
    name: keyof typeof MaterialIcons.glyphMap;
    color: ColorValue;
  };
  isRight?: boolean;
};

export function Summary({ data, icon, isRight = false }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.header, isRight && { justifyContent: "flex-end" }]}>
        <MaterialIcons name={icon.name} color={icon.color} size={16} />

        <Text style={styles.label}>{data.label}</Text>
      </View>

      <Text style={styles.value}>{data.value}</Text>
    </View>
  );
}
