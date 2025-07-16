import { StatusBar, View } from "react-native";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";

export default function Target() {
  return (
    <View
      style={{
        flex: 1,
        padding: 24,
      }}
    >
      <StatusBar barStyle="dark-content" />

      <PageHeader
        title="Meta"
        subtitle="Economize para alcançar sua meta financeira."
      />

      <View style={{ marginTop: 32, gap: 24 }}>
        <Input
          label="Nova meta"
          placeholder="Ex: Viagem para praia, Apple Watch"
        />
        <Button title="Salvar" />
      </View>
    </View>
  );
}
