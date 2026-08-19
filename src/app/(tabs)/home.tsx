import CareCenterCard from "@/components/home/care-center";
import CareTipCard from "@/components/home/care-tip";
import ConditionOverviewCard from "@/components/home/condition-overview";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import LoadingScreen from "@/components/shared/loading";
import Button from "@/components/ui/Button";
import { useHomeData } from "@/hooks/home/useHomeData";
import { useProfileStore } from "@/stores/useProfileStore";
import { RefreshControl, ScrollView, Text, View } from "react-native";

const STORE_DATA = [
  {
    id: 1,
    title: "웰니스 서울",
    subTitle: "서울특별시 강남구 테헤란로 123",
    img: require("../../../assets/images/home/store1.png"),
  },
  {
    id: 2,
    title: "스웰니시",
    subTitle: "서울특별시 성동구 서울숲길 28",
    img: require("../../../assets/images/home/store2.png"),
  },
  {
    id: 3,
    title: "웰니스 서울",
    subTitle: "서울특별시 용산구 한남대로 42",
    img: require("../../../assets/images/home/store3.png"),
  },
];

export default function HomeScreen() {
  const storedNickname = useProfileStore((state) => state.profile.nickname);
  const { data, errorMessage, isLoading, reload } = useHomeData();
  const nickname = data?.nickname ?? storedNickname;

  if (isLoading && !data) {
    return (
      <View className="flex-1 px-8 pt-16">
        <LoadingScreen
          title="홈 화면을 준비하고 있어요."
          subTitle="현재 상태와 맞춤 정보를 확인하고 있어요."
          text="오늘의 러닝 정보를 불러오는 중이에요."
        />
      </View>
    );
  }

  if (errorMessage && !data) {
    return (
      <View className="flex-1 items-center justify-center px-8 gap-5">
        <Text className="text-[14px] text-neutral-700 text-center">
          {errorMessage}
        </Text>
        <Button onPress={reload}>다시 시도</Button>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <GradientScreenLayout offsetY={120} edges={["left", "right"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 32,
            paddingTop: 64,
            paddingBottom: 36,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => void reload()}
              colors={["#725AF5"]}
              tintColor="#725AF5"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* 타이틀 */}
          <View>
            <Text className="text-[22px] font-semibold text-black">
              {nickname}님의 현재 상태입니다.
            </Text>
            <Text className="text-[10px] font-medium text-neutral-300">
              오늘도 나를 위한 작은 습관을 이어나가요.
            </Text>
          </View>

          {/* 카드 컨텐츠 */}
          <View className="mt-5 gap-5">
            <ConditionOverviewCard
              achievementRate={data?.achievementRate ?? 0}
              daysRemaining={data?.daysRemaining ?? 0}
              scene={data?.scene ?? "설정된 미래 목표가 없습니다."}
              temp={data?.temp ?? 0}
            />
            <CareTipCard
              tip={data?.wellnessTip ?? "오늘도 가볍게 시작해보세요."}
            />
          </View>

          {/* 매장 */}
          <View className="mt-5">
            <Text className="text-[16px] font-semibold text-black">
              오프라인에서도 관리할 수 있어요!
            </Text>
            <ScrollView
              horizontal
              className="mt-5 -mr-8"
              contentContainerStyle={{ gap: 12, paddingRight: 32 }}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              snapToInterval={172}
            >
              {STORE_DATA.map((store) => (
                <CareCenterCard
                  key={store.id}
                  title={store.title}
                  subTitle={store.subTitle}
                  img={store.img}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </GradientScreenLayout>
    </View>
  );
}
