import { Text, View } from "react-native";
import Input, { CurrencyInputProps } from "react-native-currency-input";

import { colors } from "@/theme";

import { styles } from "@/components/input/styles";

type InputProps = CurrencyInputProps & {
  label: string;
};

export function CurrencyInput({ label, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Input
        style={styles.input}
        placeholderTextColor={colors.gray[400]}
        delimiter="."
        separator=","
        precision={2}
        minValue={0}
        {...rest}
      />
    </View>
  );
}
