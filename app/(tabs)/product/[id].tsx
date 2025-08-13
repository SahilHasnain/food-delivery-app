import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MenuItem } from "@/type";
import { appwriteConfig, databases } from "@/lib/appwrite";
import { images } from "@/constants";
import { Query } from "react-native-appwrite";
import { useCartStore } from "@/store/cart.store";
import FocusAwareStatusBar from "@/components/FocusAwareStatusBar";

const ProductDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.menuCollectionId,
          [Query.equal("$id", id)]
        );

        if (response.documents.length > 0) {
          setProduct(response.documents[0] as MenuItem);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const imageUrl = encodeURI(
        `${product.image_url}?project=${appwriteConfig.projectId}`
      );

      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.$id,
          name: product.name,
          price: product.price,
          image_url: imageUrl,
          customizations: [],
        });
      }

      router.back();
    }
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#FE8C00" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <Text className="text-center body-bold text-dark-100">
          Product not found
        </Text>
      </View>
    );
  }

  const imageUrl = encodeURI(
    `${product.image_url}?project=${appwriteConfig.projectId}`
  );

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <FocusAwareStatusBar
        style="dark"
        backgroundColor="#ffffff"
        translucent={true}
      />
      <View className="flex-1 p-4 pt-12">
        {/* Header with back button and search */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Image
              source={images.arrowBack}
              className="size-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/search")}
            className="p-2"
          >
            <Image
              source={images.search}
              className="size-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row mb-6">
          {/* Product info */}
          <View className="flex-1 pr-2">
            <Text className="mb-1 font-bold base-bold  text-dark-100 !text-2xl">
              {product.name}
            </Text>
            <Text className="mb-2 text-gray-200 body-medium !text-[16px] font-medium">
              {product.categories.name}
            </Text>

            {/* Rating */}
            <View className="flex-row items-center mb-2">
              <View className="flex-row">
                {[...Array(Math.floor(product.rating))].map((_, i) => (
                  <Image
                    key={i}
                    source={images.star}
                    className="mr-1 size-4"
                    resizeMode="contain"
                  />
                ))}
              </View>
              <Text className="ml-1 text-gray-200 body-regular">
                {product.rating}/5
              </Text>
            </View>

            {/* Price */}
            <Text className="mb-3 base-bold text-primary">
              ${product.price.toFixed(2)}
            </Text>

            {/* Nutrition info */}
            <View className="flex-row gap-8 mb-3">
              <View>
                <Text className="text-gray-200 body-medium">Calories</Text>
                <Text className="body-bold text-dark-100">
                  {product.calories} cal
                </Text>
              </View>
              <View>
                <Text className="text-gray-200 body-medium">Protein</Text>
                <Text className="body-bold text-dark-100">
                  {product.protein}g
                </Text>
              </View>
            </View>

            {/* Bun Type (assuming this is part of description or could be added to the MenuItem type) */}
            <View className="mb-2">
              <Text className="text-gray-200 body-medium">Bun Type</Text>
              <Text className="body-bold text-dark-100">Brioche</Text>
            </View>
          </View>

          {/* Product image */}
          <View className="items-center justify-center flex-1">
            <Image
              source={{ uri: imageUrl }}
              className="size-48"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Delivery info */}
        <View className="flex-row justify-between mb-6">
          <View className="flex-row items-center">
            <Image
              source={images.dollar}
              className="mr-2 size-5"
              resizeMode="contain"
            />
            <Text className="body-medium text-dark-100">Free Delivery</Text>
          </View>
          <View className="flex-row items-center">
            <Image
              source={images.clock}
              className="mr-2 size-5"
              resizeMode="contain"
            />
            <Text className="body-medium text-dark-100">20-30 mins</Text>
          </View>
          <View className="flex-row items-center">
            <Image
              source={images.star}
              className="mr-2 size-5"
              resizeMode="contain"
            />
            <Text className="body-medium text-dark-100">{product.rating}</Text>
          </View>
        </View>

        {/* Description */}
        <View className="mb-8">
          <Text className="mb-2 base-bold text-dark-100">Description</Text>
          <Text className="text-gray-200 body-regular">
            {product.description}
          </Text>
        </View>

        {/* Add to cart section */}
        <View className="justify-end flex-1 py-12">
          <View className="flex-row items-center bg-white shadow px-[18px] py-4 rounded-[20px]">
            <View className="flex-row items-center mr-4">
              <TouchableOpacity onPress={decrementQuantity} className="p-2">
                <Image
                  source={images.minus}
                  className="size-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text className="mx-3 text-xl font-bold font-quicksand-bold text-dark-100">
                {quantity}
              </Text>
              <TouchableOpacity onPress={incrementQuantity} className="p-2">
                <Image
                  source={images.plus}
                  className="size-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              className="flex-row items-center justify-center flex-1 px-6 py-4 rounded-full bg-primary"
            >
              <Image
                source={images.bag}
                className="mr-2 size-5"
                resizeMode="contain"
                tintColor="#fff"
              />
              <Text className="text-white body-bold">
                Add to Cart (${(product.price * quantity).toFixed(2)})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;
