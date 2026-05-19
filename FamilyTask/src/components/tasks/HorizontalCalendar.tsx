import React, { useMemo, useRef, useEffect } from "react";
import { View, Pressable, FlatList } from "react-native";
import { format, addDays, isSameDay } from "date-fns";
import { cn } from "@/src/utils/cn";
import { Typo } from "../ui/Typo";


interface DayItem {
  date: Date;
  dayName: string;  
  dayNumber: string; 
}

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function HorizontalCalendar({ selectedDate, onDateChange }: Props) {
  const flatListRef = useRef<FlatList>(null);

  const days: DayItem[] = useMemo(() => {
    const startFrom = addDays(new Date(), -7); 
    return Array.from({ length: 21 }).map((_, index) => {
      const date = addDays(startFrom, index);
      return {
        date,
        dayName: format(date, "EEE"),     
        dayNumber: format(date, "d"),    
      };
    });
  }, []);

  const selectedIndex = days.findIndex((item) => isSameDay(item.date, selectedDate));

  useEffect(() => {
    if (selectedIndex !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: selectedIndex,
          animated: true,
          viewPosition: 0.5, 
        });
      }, 100);
    }
  }, [selectedIndex]);

  return (
    <View className="w-full py-3 bg-white border-b border-border">
      <FlatList
        ref={flatListRef}
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.date.toISOString()}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        onScrollToIndexFailed={() => {}} 
        renderItem={({ item }) => {
          const isSelected = isSameDay(item.date, selectedDate);
          const isTodayDate = isSameDay(item.date, new Date());

          return (
            <Pressable
              onPress={() => onDateChange(item.date)}
              className={cn(
                "w-[54px] h-[74px] items-center justify-center rounded-2xl border transition-all duration-150 active:scale-95",
                isSelected 
                  ? "bg-primary border-primary shadow-sm shadow-primary/30" 
                  : "bg-background border-border",
                isTodayDate && !isSelected && "border-primary/40"
              )}
            >
              <Typo
                className={cn(
                  "text-[11px] font-bold tracking-wider uppercase",
                  isSelected ? "text-white/80" : "text-muted"
                )}
              >
                {item.dayName}
              </Typo>

              <Typo
                className={cn(
                  "text-[18px] font-black mt-1",
                  isSelected ? "text-white" : "text-text"
                )}
              >
                {item.dayNumber}
              </Typo>

              {isTodayDate && (
                <View 
                  className={cn(
                    "w-1.5 h-1.5 rounded-full absolute bottom-1.5",
                    isSelected ? "bg-white" : "bg-primary"
                  )}
                />
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}