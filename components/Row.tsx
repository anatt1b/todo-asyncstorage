import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Task } from '../types/Todo'

interface TodoItemProps {
  item: Task
  deleteTodo: (id: number) => Promise<void>
  toggleTodo: (id: number, completed: number) => Promise<void>
}

export default function Row({ item, deleteTodo, toggleTodo }: TodoItemProps) {
  return (
    <View style={styles.todoItem}>
      {/* Tekstin painaminen vaihtaa tehty / kesken */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => toggleTodo(item.id, item.completed)}
      >
        <Text style={[styles.todoText, item.completed === 1 && styles.completedText]}>
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTodo(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  todoText: {
    color: '#000',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
})