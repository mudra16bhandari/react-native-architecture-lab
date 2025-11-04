/**
 * 📘 Day 1 — Optimized FlatList Example
 * Goal: Demonstrate how React.memo + useCallback reduce unnecessary re-renders.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

/**
 * 🧠 Mock data (useMemo prevents recreation on each render)
 */
const useMockData = () =>
  useMemo(
    () =>
      Array.from({ length: 1000 }, (_, i) => ({
        id: i.toString(),
        name: `Item ${i + 1}`,
      })),
    []
  );

/**
 * 🧩 Individual List Item (memoized to prevent re-render)
 * React.memo shallow-compares props and skips re-render if unchanged
 */
const ListItem = React.memo(({ item, onPress }: any) => {
  console.log('Render:', item.name); // ✅ Observe how often items render

  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );
});

/**
 * ⚡ Main Screen Component
 * Demonstrates useCallback + memoization + FlatList best practices
 */
export default function OptimizedFlatList() {
  const data = useMockData();
  const [selected, setSelected] = useState<string | null>(null);

  /**
   * 🔄 Memoize handler — recreated only when dependency changes
   */
  const handlePress = useCallback((item: { id: string }) => {
    setSelected((prev) => (prev === item.id ? null : item.id));
  }, []);

  /**
   * 🔧 Key extractor (stable keys = smoother scroll)
   */
  const keyExtractor = useCallback((item: { id: string }) => item.id, []);

  /**
   * 🧮 Item renderer — memoized with useCallback
   */
  const renderItem = useCallback(
    ({ item }: any) => <ListItem item={item} onPress={handlePress} />,
    [handlePress]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Optimized FlatList Demo</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={15}
        windowSize={10}
        removeClippedSubviews
        maxToRenderPerBatch={20}
        showsVerticalScrollIndicator={false}
      />
      {selected && (
        <View style={styles.footer}>
          <Text style={styles.selectedText}>
            Selected: {data.find((d) => d.id === selected)?.name}
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * 🎨 Styles
 */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: { fontSize: 16 },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  selectedText: { textAlign: 'center', fontWeight: '500' },
});
