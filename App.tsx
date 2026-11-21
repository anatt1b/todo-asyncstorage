import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import * as SQLite from 'expo-sqlite'
import type { Task } from './types/Todo'
import Row from './components/Row'

export default function App() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState<string>('')

  // Avataan tietokanta ja luodaan taulu kun sovellus käynnistyy
  useEffect(() => {
    const initDB = async () => {
      const database = await SQLite.openDatabaseAsync('tasks.db')
      setDb(database)
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          completed INTEGER DEFAULT 0
        );
      `)
      loadTodos(database)
    }
    initDB()
  }, [])

  // Haetaan kaikki tehtävät tietokannasta
  const loadTodos = async (database: SQLite.SQLiteDatabase) => {
    const result = await database.getAllAsync<Task>('SELECT * FROM todos')
    setTasks(result)
  }

  const addTodo = async () => {
    if (!input.trim() || !db) return
    await db.runAsync('INSERT INTO todos (text) VALUES (?)', input)
    setInput('')
    loadTodos(db)
  }

  const deleteTodo = async (id: number) => {
    if (!db) return
    await db.runAsync('DELETE FROM todos WHERE id = ?', id)
    loadTodos(db)
  }

  const toggleTodo = async (id: number, completed: number) => {
    if (!db) return
    const newCompleted = completed === 1 ? 0 : 1
    await db.runAsync('UPDATE todos SET completed = ? WHERE id = ?', newCompleted, id)
    loadTodos(db)
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
