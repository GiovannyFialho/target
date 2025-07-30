import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";

import { TransactionTypes } from "@/utils/transaction-types";

import { Button } from "@/components/button";
import { CurrencyInput } from "@/components/currency-input";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";
import { TransactionType } from "@/components/transaction-type";

export default function Transaction() {
  const params = useLocalSearchParams<{ id: string }>();

  const transactionsDatabase = useTransactionsDatabase();

  const [isCreating, setIsCreating] = useState(false);
  const [amount, setAmount] = useState<number | null>(0);
  const [observation, setObservation] = useState("");
  const [type, setType] = useState<TransactionTypes>(TransactionTypes.Input);

  async function handleCreate() {
    try {
      if (!amount || amount <= 0) {
        return Promise.reject(
          Alert.alert(
            "Atenção!",
            "Preencha o valor. A transação deve ser maior do que zero"
          )
        );
      }

      setIsCreating(true);

      await transactionsDatabase.create({
        target_id: Number(params.id),
        amount: type === TransactionTypes.Output ? amount * -1 : amount,
        observation,
      });

      Alert.alert("Sucesso!", "A transação foi salva com sucesso!", [
        {
          text: "Ok",
          onPress: router.back,
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a transação");
      console.log(`Error: ${error}`);

      setIsCreating(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
      }}
    >
      <PageHeader
        title="Nova transação"
        subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce para guardar e evitar retirar."
      />

      <View style={{ marginTop: 32, gap: 24 }}>
        <TransactionType selected={type} onChange={setType} />

        <CurrencyInput
          label="Valor (R$)"
          value={amount}
          onChangeValue={setAmount}
        />

        <Input
          label="Motivo"
          placeholder="Ex: Investir em CDB de 110% no banco XPTO"
          value={observation}
          onChangeText={setObservation}
        />

        <Button
          title="Salvar"
          isProcessing={isCreating}
          onPress={handleCreate}
        />
      </View>
    </View>
  );
}
