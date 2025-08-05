import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StatusBar, View } from "react-native";

import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";

import { numberToCurrency } from "@/utils/number-to-currency";

import { Button } from "@/components/button";
import { HomeHeader, type HomeHeaderProps } from "@/components/home-header";
import { List } from "@/components/list";
import { Loading } from "@/components/loading";
import { Target, TargetProps } from "@/components/target";

export default function Index() {
  const [isFetching, setIsFetching] = useState(true);
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const [summary, setSummary] = useState<HomeHeaderProps>();

  const targetDatabase = useTargetDatabase();
  const transactionsDatabase = useTransactionsDatabase();

  async function fetchSummary(): Promise<HomeHeaderProps | undefined> {
    try {
      const response = await transactionsDatabase.summary();

      return {
        total: numberToCurrency(
          (response?.input ?? 0) + (response?.output ?? 0)
        ),
        input: {
          label: "Entradas",
          value: numberToCurrency(response?.input ?? 0),
        },
        output: {
          label: "Saídas",
          value: numberToCurrency(response?.output ?? 0),
        },
      };
    } catch (error) {
      Alert.alert("Erro");
      console.log(`Error: ${error}`);
    }
  }

  async function fetchTargets(): Promise<TargetProps[]> {
    try {
      const response = await targetDatabase.listByClosestTarget();

      return response.map((item) => ({
        id: String(item.id),
        name: item.name,
        current: numberToCurrency(item.current),
        percentage: item.percentage.toFixed(0) + "%",
        target: numberToCurrency(item.amount),
      }));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas.");
      console.log(`Error: ${error}`);

      return [];
    }
  }

  async function fetchData() {
    const targetDataPromise = fetchTargets();
    const dataSummaryPromise = fetchSummary();

    const [targetData, dataSummary] = await Promise.all([
      targetDataPromise,
      dataSummaryPromise,
    ]);

    setTargets(targetData);
    setSummary(dataSummary);

    setIsFetching(false);
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
      }}
    >
      <StatusBar barStyle="light-content" />

      {!summary ? <Loading /> : <HomeHeader data={summary} />}

      <List
        title="Metas"
        data={targets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Target
            data={item}
            onPress={() => router.navigate(`/in-progress/${item.id}`)}
          />
        )}
        emptyMessage="Nenhuma meta. Toque em nova meta para criar."
        containerStyle={{ paddingHorizontal: 24 }}
      />

      <View style={{ padding: 24, paddingBottom: 32 }}>
        <Button title="Nova meta" onPress={() => router.navigate("/target")} />
      </View>
    </View>
  );
}
