import { FlatList, ListRenderItem, Pressable, Text, View } from "react-native"
import React, { useCallback, useState } from "react"


// React.memo + useCallback Demo for PERFORMANCE
// This component will NOT re-render unless its own state changes.
const CounterItem = React.memo(() => {
    const [counter, setCounter] = useState(0)

    // useCallback ensures 'add' keeps the same reference across re-renders.
    // Dependency array is empty → function is created only once.
    const add = useCallback(() => {
        setCounter(prev => prev + 1)
    }, [])

    return <>
        {/* Only this component re-renders when counter updates */}
        <Text>{counter}</Text>

        {/* Pressable calling memoized callback */}
        <Pressable onPress={add} style={{ backgroundColor: "red", padding: 10 }}>
            <Text>Add</Text>
        </Pressable>
    </>
})

// List wrapped in React.memo → will NOT re-render when CounterItem changes.
const MyFlatList = React.memo(() => {
    // Static list → safe to define here.
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]

    // Memoized renderItem → stable reference → FlatList doesn't re-render unnecessarily.
    const renderItem: ListRenderItem<number> = useCallback(({ item }) => {
        return <Text>{item}</Text>
    }, [])

    return <>
        <FlatList
            data={list}
            keyExtractor={item => item.toString()} // Stable keys
            renderItem={renderItem}              // Prevents re-renders
        />
    </>
})

export default function OptimizedCounterList() {
    return <View style={{ margin: 25 }}>
        {/* React.memo components below do NOT affect each other */}
        <CounterItem />
        <MyFlatList />
    </View>
}