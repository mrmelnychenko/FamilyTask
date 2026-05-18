import { ScrollView, View } from "react-native";

export function TasksScreen() {
    return (
        <View className="flex-1">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 112, paddingHorizontal: 20, paddingTop: 16 }}
                showsVerticalScrollIndicator={false}
            >


            </ScrollView>
        </View>
    )
}