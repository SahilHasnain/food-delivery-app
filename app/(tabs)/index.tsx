import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Fragment } from "react";
import cn from "clsx";
import CartButton from "@/components/CartButton";
import { images, offers } from "@/constants";
import useAppwrite from "@/lib/useAppwrite";
import { getCategories } from "@/lib/appwrite";
import { Category } from "@/type";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const { data: categories } = useAppwrite({ fn: getCategories });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={offers}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          const handleOfferPress = () => {
            if (!categories) return;
            const match = (categories as Category[]).find((cat) =>
              item.name.toLowerCase().includes(cat.name.toLowerCase())
            );
            const params = match ? { category: match.$id } : {};
            router.push({ pathname: "/search", params });
          };
          return (
            <View>
              <Pressable
                onPress={handleOfferPress}
                className={cn(
                  "offer-card",
                  isEven ? "flex-row-reverse" : "flex-row"
                )}
                style={{ backgroundColor: item.color }}
                android_ripple={{ color: "#fffff22" }}
              >
                <Fragment>
                  <View className="w-1/2 h-full">
                    <Image
                      source={item.image}
                      className="size-full"
                      resizeMode="contain"
                    />
                  </View>

                  <View
                    className={cn(
                      "offer-card__info",
                      isEven ? "pl-10" : "pr-10"
                    )}
                  >
                    <Text className="leading-tight text-white h1-bold">
                      {item.title}
                    </Text>
                    <Image
                      source={images.arrowRight}
                      className="size-10"
                      resizeMode="contain"
                      tintColor="#ffffff"
                    />
                  </View>
                </Fragment>
              </Pressable>
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          <View>
            <View className="flex-row w-full my-5 flex-between">
              <View className="flex-start">
                <Text className="small-bold text-primary">DELIVER TO</Text>
                <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-bold text-dark-100">Giridih</Text>
                  <Image
                    source={images.arrowDown}
                    className="size-3"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <CartButton />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
