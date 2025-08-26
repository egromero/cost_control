"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from "react-native"
import { useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../App"

interface CostItem {
  item: string
  cost: number
}

type CostsRouteProp = RouteProp<RootStackParamList, "Costs">

export default function CostsScreen() {
  const [costs, setCosts] = useState<CostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [newItem, setNewItem] = useState("")
  const [newCost, setNewCost] = useState("")

  const route = useRoute<CostsRouteProp>()
  const { month, year } = route.params

  // Fetch costs from endpoint
  useEffect(() => {
    fetchCosts()
  }, [month, year]) // Added month and year as dependencies

  // Calculate total whenever costs change
  useEffect(() => {
    const newTotal = costs.reduce((sum, item) => sum + item.cost, 0)
    setTotal(newTotal)
  }, [costs])

  const fetchCosts = async () => {
    try {
      setLoading(true)
      // Replace with your actual endpoint URL - now includes month and year params
      const response = await fetch(`https://your-api-endpoint.com/costs?month=${month}&year=${year}`)
      const data = await response.json()
      setCosts(data)
    } catch (error) {
      console.error("Error fetching costs:", error)
      // Mock data for demonstration - showing different data based on month/year
      setCosts([
        { item: `Coffee (${month}/${year})`, cost: 5.5 },
        { item: `Lunch (${month}/${year})`, cost: 12.0 },
        { item: `Gas (${month}/${year})`, cost: 45.0 },
        { item: `Groceries (${month}/${year})`, cost: 78.25 },
        { item: `Movie ticket (${month}/${year})`, cost: 15.0 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddNewCost = () => {
    setModalVisible(true)
  }

  const handleSendNewCost = async () => {
    if (!newItem.trim() || !newCost.trim()) {
      Alert.alert("Error", "Please fill in both item and cost fields")
      return
    }

    const costValue = Number.parseFloat(newCost)
    if (isNaN(costValue)) {
      Alert.alert("Error", "Please enter a valid cost amount")
      return
    }

    try {
      // Make POST request to add new cost
      const response = await fetch(`https://your-api-endpoint.com/costs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: newItem.trim(),
          cost: costValue,
          month,
          year,
        }),
      })

      if (response.ok) {
        // Close modal and reset form
        setModalVisible(false)
        setNewItem("")
        setNewCost("")
        // Refresh the costs list
        fetchCosts()
      } else {
        Alert.alert("Error", "Failed to add new cost")
      }
    } catch (error) {
      console.error("Error adding new cost:", error)
      Alert.alert("Error", "Failed to add new cost")
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setNewItem("")
    setNewCost("")
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading costs...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {month}/{year}
        </Text>
      </View>

      {/* Total Display */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>total</Text>
        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
      </View>

      {/* Add New Cost Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddNewCost}>
        <Text style={styles.addButtonText}>add new cost</Text>
      </TouchableOpacity>

      {/* Costs Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>stuffs</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
          {costs.map((costItem, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.itemText}>{costItem.item}</Text>
              <Text style={styles.costText}>${costItem.cost.toFixed(2)}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>add new cost</Text>

            <TextInput
              style={styles.input}
              placeholder="item"
              placeholderTextColor="#888888"
              value={newItem}
              onChangeText={setNewItem}
            />

            <TextInput
              style={styles.input}
              placeholder="cost"
              placeholderTextColor="#888888"
              value={newCost}
              onChangeText={setNewCost}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sendButton} onPress={handleSendNewCost}>
                <Text style={styles.sendButtonText}>send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    marginTop: 50,
  },
  totalContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: "#888888",
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
  },
  addButton: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  costText: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    textAlign: "right",
  },
  dateContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000000",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#888888",
  },
  sendButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#000000",
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
})
