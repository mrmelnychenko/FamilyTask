import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Pressable,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Typo } from "../ui/Typo";

import { ITaskFilters, TaskCategory, TaskPriority, TaskRecurrence } from "@/src/types/task";
import { RECURRENCE_OPTIONS, TASK_CATEGORIES, TASK_PRIORITIES } from "@/src/constants/tasks";
import { CategoryCard } from "../ui/CategoryCard";
import { Chip } from "../ui/Chip";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { colors } from "@/src/utils/colors";

const EMPTY_FILTERS: ITaskFilters = {
  recurrence: null,
  priority: null,
  categories: [],
};

export interface IFilterTaskBottom {
  visible: boolean;
  initialFilters?: ITaskFilters;
  onClose: () => void;
  onApply: (filters: ITaskFilters) => void;
}


export function FilterTaskBottom({
  visible,
  onClose,
  onApply,
  initialFilters,
}: IFilterTaskBottom) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  const [filters, setFilters] = useState<ITaskFilters>(
    initialFilters ?? EMPTY_FILTERS
  );

  const snapPoints = useMemo(() => ["85%"], []);

  const backdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
      />
    ),
    []
  );

  useEffect(() => {
    if (visible) {
      setFilters(initialFilters ?? EMPTY_FILTERS);
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const toggleRecurrence = (key: TaskRecurrence) => {
    setFilters((f) => ({
      ...f,
      recurrence: f.recurrence === key ? null : key,
    }));
  };

  const togglePriority = (key: TaskPriority) => {
    setFilters((f) => ({
      ...f,
      priority: f.priority === key ? null : key,
    }));
  };

  const toggleCategory = (key: TaskCategory) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(key)
        ? f.categories.filter((c) => c !== key)
        : [...f.categories, key],
    }));
  };

  const reset = () => setFilters(EMPTY_FILTERS);

  const apply = () => {
    onApply(filters);
    onClose();
  };
  
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={backdrop}
      onClose={onClose}
      topInset={insets.top}
      handleIndicatorStyle={{ backgroundColor: colors.cyanBg }}
      backgroundStyle={{ backgroundColor: colors.white }}
    >
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-5 py-3">
        <Typo className="text-xl font-bold">Filters</Typo>

        <Pressable onPress={onClose} className="p-2 rounded-full bg-white">
          <MaterialIcons name="close" size={20} />
        </Pressable>
      </View>

      {/* CONTENT */}
      <BottomSheetScrollView className="px-5 gap-6">
        {/* Recurrence */}
        <View className="gap-2">
          <Typo className="font-semibold">Recurrence</Typo>

          <View className="flex-row flex-wrap gap-2">
            {RECURRENCE_OPTIONS.map((o) => (
              <Chip
                key={o.key}
                label={o.label}
                active={filters.recurrence === o.key}
                onPress={() => toggleRecurrence(o.key)}
              />
            ))}
          </View>
        </View>

        {/* Priority */}
        <View className="gap-2">
          <Typo className="font-semibold">Priority</Typo>

          <View className="flex-row flex-wrap gap-2">
            {TASK_PRIORITIES.map((o) => (
              <Chip
                key={o.key}
                label={o.label}
                active={filters.priority === o.key}
                onPress={() => togglePriority(o.key)}
                color={o.color}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View className="gap-2">
          <Typo className="font-semibold">Categories</Typo>

          <View className="flex-row flex-wrap gap-2">
            {TASK_CATEGORIES.map((item) => (
              <CategoryCard
                key={item.key}
                item={item}
                active={filters.categories.includes(item.key)}
                onPress={() => toggleCategory(item.key)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </BottomSheetScrollView>

      {/* FOOTER */}
      <View
        className="flex-row gap-3 px-5 py-3 border-t border-background bg-white"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <Pressable
          onPress={reset}
          className="flex-1 py-3 rounded-full bg-background items-center"
        >
          <Typo>Reset</Typo>
        </Pressable>

        <Pressable
          onPress={apply}
          className="flex-[2] py-3 rounded-full bg-primary items-center"
        >
          <Typo className="text-white font-semibold">Apply</Typo>
        </Pressable>
      </View>
    </BottomSheet>
  );
}