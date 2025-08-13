import { Text, TouchableOpacity, Platform } from "react-native";
import { MenuItem } from "@/type";
import { appwriteConfig } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { buildAppwriteImageUrl, prefetchImages } from "@/lib/image";

const MenuCard = ({
  item: { $id, image_url, name, price },
}: {
  item: MenuItem;
}) => {
  const imageUrl = buildAppwriteImageUrl(image_url, appwriteConfig.projectId);
  const { addItem } = useCartStore();
  const router = useRouter();

  // Prefetch on mount for snappier first paint
  prefetchImages([imageUrl]);

  const handleCardPress = () => {
    router.push(`/product/${$id}`);
  };

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
      onPress={handleCardPress}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{ position: "absolute", width: 128, height: 128, top: -40 }}
        contentFit="contain"
        transition={150}
        cachePolicy="memory-disk"
      />
      <Text
        className="mb-2 text-center base-bold text-dark-100"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="mb-4 text-gray-200 body-regular">From ${price}</Text>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // Prevent triggering the parent TouchableOpacity
          addItem({
            id: $id,
            name,
            price,
            image_url: imageUrl,
            customizations: [],
          });
        }}
      >
        <Text className="paragraph-bold text-primary">Add to Cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MenuCard;
