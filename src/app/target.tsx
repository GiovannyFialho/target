import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StatusBar, View } from "react-native";

import { Button } from "@/components/button";
import { CurrencyInput } from "@/components/currency-input";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";

export default function Target() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");
  const [amout, setAmout] = useState<number | null>(0);

  const params = useLocalSearchParams<{ id?: string }>();

  function handleSave() {
    if (!name.trim() || !amout || amout <= 0) {
      return Alert.alert(
        "Atenção",
        "Preencha nome e o valor precisa ser maior que zero."
      );
    }

    setIsProcessing(true);

    if (params.id) {
    } else {
      create();
    }
  }

  async function create() {
    try {
      Alert.alert("Nova meta", "Meta criada com sucesso!", [
        {
          text: "Ok",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a meta");

      console.log(`Error: ${error}`);

      setIsProcessing(false);
    }
  }

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
          label="Nome da meta"
          value={name}
          placeholder="Ex: Viagem para praia, Apple Watch"
          onChangeText={setName}
        />

        <CurrencyInput
          label="Valor alvo (R$)"
          value={amout}
          onChangeValue={setAmout}
        />

        <Button
          title="Salvar"
          isProcessing={isProcessing}
          onPress={handleSave}
        />
      </View>
    </View>
  );
}
