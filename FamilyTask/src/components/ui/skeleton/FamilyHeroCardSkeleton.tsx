import { colors } from "@/src/utils/colors";
import { View } from "react-native";
import { Skeleton } from "../Skeleton";

export function FamilyHeroCardSkeleton() {
    return (
        <View
        className="mx-4 mt-4 rounded-3xl p-5 gap-4"
        style={{ backgroundColor: colors.primaryLight }}
      >
        {/* TOP */}
        <View className="flex-row items-center justify-between">
          <View className="gap-2 flex-1 pr-4">
            <Skeleton width={100} height={12} borderRadius={6} />
            <Skeleton width={160} height={22} borderRadius={8} />
          </View>
          <Skeleton width={56} height={56} borderRadius={16} />
        </View>
  
        {/* DIVIDER */}
        <Skeleton  height={1} borderRadius={0} />
  
        {/* BOTTOM */}
        <View className="flex-row items-center justify-between">
          <Skeleton width={100} height={14} borderRadius={6} />
          <Skeleton width={90} height={32} borderRadius={12} />
        </View>
      </View>
    );
  }