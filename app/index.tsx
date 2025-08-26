"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../App"

const { width } = Dimensions.get("window")
const ITEM_HEIGHT = 50

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Index">

export default function IndexScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const navigation = useNavigation<NavigationProp>()

  const monthScrollRef = useRef<ScrollView>(null)
  const yearScrollRef = useRef<ScrollView>(null)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Generate years from 1950 to 2050
  const years = Array.from({ length: 101 }, (_, i) => 1950 + i)

  const handleMonthScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y
    const index = Math.round(y / ITEM_HEIGHT)
    setSelectedMonth(index)
  }

  const handleYearScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y
    const index = Math.round(y / ITEM_HEIGHT)
    setSelectedYear(years[index])
  }

  const formatSelectedDate = () => {
    return `${months[selectedMonth]} ${selectedYear}`
  }

  const handleButtonPress = () => {
    const selectedDate = formatSelectedDate()
    console.log("Selected date:", selectedDate)

    navigation.navigate("Costs", {
      month: selectedMonth + 1,
      year: selectedYear,
    })
  }

  const renderPickerItem = (item: string | number, index: number, isSelected: boolean) => (
    <View key={index} style={[styles.pickerItem, isSelected && styles.selectedItem]}>
      <Text style={[styles.pickerText, isSelected && styles.selectedText]}>{item}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Date Selector</Text>

      <View style={styles.dateSection}>
        <Text style={styles.label}>Selected Month & Year:</Text>
        <Text style={styles.selectedDate}>{formatSelectedDate()}</Text>
      </View>

      <View style={styles.pickerContainer}>
        <View style={styles.pickerColumn}>
          <Text style={styles.columnLabel}>Month</Text>
          <View style={styles.pickerWrapper}>
            <ScrollView
              ref={monthScrollRef}
              style={styles.picker}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onMomentumScrollEnd={handleMonthScroll}
              contentContainerStyle={styles.pickerContent}
            >
              {months.map((month, index) => renderPickerItem(month, index, index === selectedMonth))}
            </ScrollView>
            <View style={styles.selectionIndicator} />
          </View>
        </View>

        <View style={styles.pickerColumn}>
          <Text style={styles.columnLabel}>Year</Text>
          <View style={styles.pickerWrapper}>
            <ScrollView
              ref={yearScrollRef}
              style={styles.picker}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onMomentumScrollEnd={handleYearScroll}
              contentContainerStyle={styles.pickerContent}
            >
              {years.map((year, index) => renderPickerItem(year, index, year === selectedYear))}
            </ScrollView>
            <View style={styles.selectionIndicator} />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Confirm Selection</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 40,
  },
  dateSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: "#888888",
    marginBottom: 10,
  },
  selectedDate: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "600",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: width * 0.8,
    marginBottom: 40,
  },
  pickerColumn: {
    alignItems: "center",
  },
  columnLabel: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 10,
    fontWeight: "500",
  },
  pickerWrapper: {
    position: "relative",
    height: 150,
    width: 120,
  },
  picker: {
    height: 150,
  },
  pickerContent: {
    paddingVertical: 50,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  pickerText: {
    fontSize: 16,
    color: "#cccccc",
  },
  selectedText: {
    color: "#000000",
    fontWeight: "600",
  },
  selectionIndicator: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    pointerEvents: "none",
  },
  actionButton: {
    backgroundColor: "#000000",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})
