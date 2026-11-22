import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Task } from './types/Todo'
import Row from './components/Row'

const STORAGE_KEY = 'tasks'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState<string>('')

  // Haetaan tallennetut tehtävät kun sovellus käynnistyy
  useEffect(() => {
    const loadTodos = async () => {
      const savedText = await AsyncStorage.getItem(STORAGE_KEY)
      if (savedText !== null) {
        setTasks(JSON.parse(savedText))
      }
    }
    loadTodos()
  }, [])

  // Päivitetään lista näytölle ja tallennetaan se puhelimen muistiin
  const saveTodos = async (newTasks: Task[]) => {
    setTasks(newTasks)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks))
  }

  const addTodo = async () => {
    if (!input.trim()) return
    const newTask: Task = { id: Date.now(), text: input, completed: 0 }
    await saveTodos([...tasks, newTask])
    setInput('')
  }

  const deleteTodo = async (id: number) => {
    await saveTodos(tasks.filter((task) => task.id !== id))
  }

  const toggleTodo = async (id: number, completed: number) => {
    const newCompleted = completed === 1 ? 0 : 1
    await saveTodos(
      tasks.map((task) => (task.id === id ? { ...task, completed: newCompleted } : task))
    )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Todo list</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            placeholder="Enter task"
            onChangeText={setInput}
            onSubmitEditing={addTodo}
          />
          <Button title="Save" onPress={addTodo} />
        </View>

        <FlatList<Task>
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Row item={item} deleteTodo={deleteTodo} toggleTodo={toggleTodo} />
          )}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 8,
  },
})