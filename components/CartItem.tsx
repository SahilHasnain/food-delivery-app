import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { Image as RNImage, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { images } from "@/constants";

const CartItem = ({ item }: { item: CartItemType }) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();

  return (
    <View className="cart-item">
      <View className="flex flex-row items-center gap-x-3">
        <View className="cart-item__image">
          <Image
            source={{ uri: item.image_url }}
            style={{ width: "80%", height: "80%", borderRadius: 8 }}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
          />
        </View>

        <View>
          <Text className="base-bold text-dark-100">{item.name}</Text>
          <Text className="mt-1 paragraph-bold text-primary">
            ${item.price}
          </Text>

          <View className="flex flex-row items-center mt-2 gap-x-4">
            <TouchableOpacity
              onPress={() => decreaseQty(item.id, item.customizations!)}
              className="cart-item__actions"
            >
              <RNImage
                source={images.minus}
                className="size-1/2"
                resizeMode="contain"
                tintColor={"#FF9C01"}
              />
            </TouchableOpacity>

            <Text className="base-bold text-dark-100">{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => increaseQty(item.id, item.customizations!)}
              className="cart-item__actions"
            >
              <RNImage
                source={images.plus}
                className="size-1/2"
                resizeMode="contain"
                tintColor={"#FF9C01"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => removeItem(item.id, item.customizations!)}
        className="flex-center"
      >
        <RNImage
          source={images.trash}
          className="size-5"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;
