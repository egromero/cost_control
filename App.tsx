import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import IndexScreen from "./app/index"
import CostsScreen from "./app/costs"

export type RootStackParamList = {
  Index: undefined
  Costs: { month: number; year: number }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
        <Stack.Screen name="Index" component={IndexScreen} options={{ title: "home" }} />
        <Stack.Screen name="Costs" component={CostsScreen} options={{ title: "costs" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
