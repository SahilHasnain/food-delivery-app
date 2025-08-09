import { Text, TouchableOpacity, Image, Platform } from "react-native";
import { MenuItem } from "@/type";
import { appwriteConfig } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "expo-router";

const MenuCard = ({
  item: { $id, image_url, name, price },
}: {
  item: MenuItem;
}) => {
  const imageUrl = encodeURI(
    `${image_url}?project=${appwriteConfig.projectId}`,
  );
  const { addItem } = useCartStore();
  const router = useRouter();

  console.log(imageUrl);

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
        className="absolute size-32 -top-10"
        resizeMode="contain"
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
