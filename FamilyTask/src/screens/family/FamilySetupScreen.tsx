import { router } from "expo-router";
import { View } from "react-native";
import { Hero } from "../../components/ui/header/Hero";
import { FamilyIcon } from "../../components/icons/FamilyIcon";
import { ActionFamilyCard } from "../../components/ui/ActionFamilyCard";
import { Divider } from "../../components/ui/Divider";
import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";

export function FamilySetupScreen() {
  return (
    <ScreenLayout>
      <View className="flex-1 justify-center gap-12">
        {/* HEADER */}
        <Hero
          title="Сімейний простір"
          subtitle="Створи свою сім'ю або приєднайся за кодом запрошення"
          icon={<FamilyIcon />}
        />
        <View>
          <ActionFamilyCard
            variant="primary"
            label="Створити сім'ю"
            description="Почни нову гру разом з родиною"
            icon="users"
            onPress={() => router.push('/create-family')}
          />
          <Divider text="або" />
          <ActionFamilyCard
            label="Ввести код запрошення"
            description="Приєднайся до існуючої сім'ї"
            icon="key"
            onPress={() => router.push('/join-family')}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}