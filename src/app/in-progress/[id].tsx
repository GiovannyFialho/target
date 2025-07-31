import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StatusBar, View } from "react-native";

import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";

import { numberToCurrency } from "@/utils/number-to-currency";

import { Button } from "@/components/button";
import { List } from "@/components/list";
import { Loading } from "@/components/loading";
import { PageHeader } from "@/components/page-header";
import { Progress } from "@/components/progress";
import { type TransactionProps, Transaction } from "@/components/transaction";
import dayjs from "dayjs";
import { TransactionTypes } from "../../utils/transaction-types";

export type TargetDetails = {
  name: string;
  current: string;
  target: string;
  percentage: number;
};

export default function InProgress() {
  const params = useLocalSearchParams<{ id: string }>();

  const targetDatabase = useTargetDatabase();
  const transactionsDatabase = useTransactionsDatabase();

  const [isFetching, setIsFetching] = useState(true);
  const [targetDetails, setTargetDetails] = useState<TargetDetails>({
    name: "",
    current: "R$ 0,00",
    target: "R$ 0,00",
    percentage: 0,
  });
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);

  async function fetchTransactions() {
    try {
      const response = await transactionsDatabase.listByTargetId(
        Number(params.id)
      );

      setTransactions(
        response.map((item) => ({
          id: String(item.id),
          value: numberToCurrency(item.amount),
          date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
          description: item.observation,
          type:
            item.amount < 0 ? TransactionTypes.Output : TransactionTypes.Input,
        }))
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as transações");
      console.log(`Error: ${error}`);
    }
  }

  async function fetchTargetDetails() {
    try {
      const response = await targetDatabase.show(Number(params.id));

      if (!response) {
        return;
      }

      setTargetDetails({
        name: response.name,
        current: numberToCurrency(response.current),
        target: numberToCurrency(response.amount),
        percentage: response.percentage,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes da meta");
      console.log(`Error: ${error}`);
    }
  }

  async function fetchData() {
    const fetchTargetDetailsPromise = fetchTargetDetails();
    const fetchTransactionsPromise = fetchTransactions();

    await Promise.all([fetchTargetDetailsPromise, fetchTransactionsPromise]);

    setIsFetching(false);
  }

  function handleTransactionRemove(id: string) {
    Alert.alert("Remover", "Deseja realmente remover?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => transactionRemove(id) },
    ]);
  }

  async function transactionRemove(id: string) {
    try {
      await transactionsDatabase.remove(Number(id));

      fetchData();
      Alert.alert("Transação", "Transação removida com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover a transação");
      console.log(`Error: ${error}`);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (isFetching) {
    return <Loading />;
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        gap: 32,
      }}
    >
      <StatusBar barStyle="dark-content" />

      <PageHeader
        title={targetDetails.name}
        rightButton={{
          icon: "edit",
          onPress: () => router.navigate(`/target?id=${params.id}`),
        }}
      />

      <Progress data={targetDetails} />

      <List
        title="Transações"
        data={transactions}
        renderItem={({ item }) => (
          <Transaction
            data={item}
            onRemove={() => handleTransactionRemove(item.id)}
          />
        )}
        emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
      />

      <Button
        title="Nova transação"
        onPress={() => router.navigate(`/transaction/${params.id}`)}
      />
    </View>
  );
}
