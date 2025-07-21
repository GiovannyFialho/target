import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { TransactionTypes } from "@/utils/transaction-types";

import { Button } from "@/components/button";
import { CurrencyInput } from "@/components/currency-input";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";
import { TransactionType } from "@/components/transaction-type";
import { useState } from "react";

export default function Transaction() {
  const params = useLocalSearchParams<{ id: string }>();

  const [type, setType] = useState<TransactionTypes>(TransactionTypes.Input);

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

        <CurrencyInput label="Valor (R$)" value={0} />

        <Input
          label="Motivo"
          placeholder="Ex: Investir em CDB de 110% no banco XPTO"
        />

        <Button title="Salvar" />
      </View>
    </View>
  );
}
