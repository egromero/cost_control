"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native"
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
    Alert.alert("Add New Cost", "This would open a form to add a new cost item")
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
          Costs for {month}/{year}
        </Text>
      </View>

      {/* Total Display */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Costs</Text>
        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
      </View>

      {/* Add New Cost Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddNewCost}>
        <Text style={styles.addButtonText}>Add New Cost</Text>
      </TouchableOpacity>

      {/* Costs Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Item</Text>
          <Text style={styles.headerText}>Cost</Text>
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
})
