import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StatusBar, View } from "react-native";

import { useTargetDatabase } from "@/database/useTargetDatabase";

import { Button } from "@/components/button";
import { CurrencyInput } from "@/components/currency-input";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";

export default function Target() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | null>(0);

  const targetDatabase = useTargetDatabase();

  const params = useLocalSearchParams<{ id?: string }>();

  function handleSave() {
    if (!name.trim() || !amount || amount <= 0) {
      return Alert.alert(
        "Atenção",
        "Preencha nome e o valor precisa ser maior que zero."
      );
    }

    setIsProcessing(true);

    if (params.id) {
      update();
    } else {
      create();
    }
  }

  async function update() {
    try {
      if (!amount) {
        return Promise.reject();
      }

      await targetDatabase.update({ id: Number(params.id), name, amount });

      Alert.alert("Sucesso", "Meta atualizada com sucesso", [
        {
          text: "Ok",
          onPress: router.back,
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a meta");
      console.log(`Error: ${error}`);

      setIsProcessing(false);
    }
  }

  async function create() {
    try {
      if (name && amount) {
        await targetDatabase.create({ name, amount });
      }

      Alert.alert("Nova meta", "Meta criada com sucesso!", [
        {
          text: "Ok",
          onPress: router.back,
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a meta");
      console.log(`Error: ${error}`);

      setIsProcessing(false);
    }
  }

  async function fetchDetails(id: number) {
    try {
      const response = await targetDatabase.show(Number(params.id));

      if (!response) {
        return;
      }

      setName(response.name);
      setAmount(response.amount);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes da meta");
      console.log(`Error: ${error}`);
    }
  }

  function handleRemove() {
    if (!params.id) {
      return;
    }

    Alert.alert("Remover", "Deseja realmente remover?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: remove,
      },
    ]);
  }

  async function remove() {
    try {
      setIsProcessing(true);

      await targetDatabase.remove(Number(params.id));

      Alert.alert("Meta", "Meta removida!", [
        {
          text: "Ok",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover a meta");
      console.log(`Error: ${error}`);

      setIsProcessing(false);
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchDetails(Number(params.id));
    }
  }, [params.id]);

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
        rightButton={
          params.id ? { icon: "delete", onPress: handleRemove } : undefined
        }
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
          value={amount}
          onChangeValue={setAmount}
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
