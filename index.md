# Food Ordering App - Detailed Code Documentation

## File-by-File Analysis

### 1. Root Layout (`app/_layout.tsx`)

```typescript
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import "./globals.css";
import * as Sentry from "@sentry/react-native";
import useAuthStore from "@/store/auth.store";
```

**Line-by-line explanation:**

1. Imports critical components:
   - `SplashScreen`: Shows loading screen during app initialization
   - `Stack`: Main navigation container from Expo Router
   - `useFonts`: Hook for loading custom fonts
   - `useEffect`: React hook for side effects
   - `Sentry`: Error tracking and monitoring
   - `useAuthStore`: Custom auth state management hook

```typescript
Sentry.init({
  dsn: "https://94edd17ee98a307f2d85d750574c454a@o4506876178464768.ingest.us.sentry.io/4509588544094208",
  sendDefaultPii: true,
  replaysSessionSampleRate: 1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});
```

**Sentry Configuration:**

- Sets up error tracking with a specific project DSN
- Enables PII (Personally Identifiable Information) sending
- Configures session replay for debugging
- Integrates mobile replay and feedback features

```typescript
export default Sentry.wrap(function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  });
```

**Root Layout Component:**

1. Wraps the entire app in Sentry error tracking
2. Gets authentication state and user fetching function
3. Loads custom QuickSand font family with different weights

```typescript
useEffect(() => {
  if (error) throw error;
  if (fontsLoaded) SplashScreen.hideAsync();
}, [fontsLoaded, error]);

useEffect(() => {
  fetchAuthenticatedUser();
}, []);
```

**Effects:**

1. First effect:
   - Throws any font loading errors
   - Hides splash screen once fonts are loaded
2. Second effect:
   - Fetches authenticated user on app start
   - Runs only once due to empty dependency array

```typescript
  if(!fontsLoaded || isLoading) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
```

**Rendering Logic:**

1. Shows nothing while fonts are loading or auth is checking
2. Renders headerless Stack navigator when ready

This root layout is crucial as it:

- Initializes error tracking
- Loads custom fonts
- Manages authentication state
- Sets up navigation structure
- Handles loading states

### 2. Auth Layout (`app/(auth)/_layout.tsx`)

```typescript
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
} from "react-native";
import { Redirect, Slot } from "expo-router";
import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
```

**Line-by-line explanation:**

1. Imports React Native core components:
   - `View`: Basic container component
   - `KeyboardAvoidingView`: Handles keyboard behavior
   - `ScrollView`: Scrollable container
   - `ImageBackground`: Image with child content
   - `Image`: Basic image component
2. Imports Expo Router components:
   - `Redirect`: Navigation redirect component
   - `Slot`: Renders child routes
3. Imports project assets and state:
   - `images`: Constants for image assets
   - `useAuthStore`: Authentication state management

```typescript
export default function AuthLayout() {
    const { isAuthenticated } = useAuthStore();

    if(isAuthenticated) return <Redirect href="/" />
```

**Authentication Check:**

1. Gets authentication status from auth store
2. Redirects to home if user is already authenticated

```typescript
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
                <View className="w-full relative" style={{ height: Dimensions.get('screen').height / 2.25}}>
                    <ImageBackground source={images.loginGraphic} className="size-full rounded-b-lg" resizeMode="stretch" />
                    <Image source={images.logo} className="self-center size-48 absolute -bottom-16 z-10" />
                </View>
                <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
    )
```

**Layout Structure:**

1. `KeyboardAvoidingView`:
   - Adjusts layout when keyboard appears
   - Uses different behaviors for iOS and Android
2. `ScrollView`:
   - Makes content scrollable
   - White background
   - Handles keyboard interaction
3. Top section:
   - Takes up roughly half the screen
   - Shows login graphic as background
   - Displays logo overlapping bottom edge
4. `Slot`:
   - Renders child routes (sign-in or sign-up)
   - Positioned below the graphic section

This auth layout provides:

- Authentication protection
- Consistent visual structure for auth screens
- Platform-specific keyboard handling
- Scrollable content area
- Beautiful login graphic with overlapping logo

### 3. Sign In Screen (`app/(auth)/sign-in.tsx`)

```typescript
import { View, Text, Button, Alert } from "react-native";
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useState } from "react";
import { signIn } from "@/lib/appwrite";
import * as Sentry from "@sentry/react-native";
```

**Import Analysis:**

1. React Native components:
   - Core UI components for structure and alerts
2. Navigation components:
   - `Link`: For sign-up page navigation
   - `router`: For programmatic navigation
3. Custom components:
   - `CustomInput`: Reusable input field
   - `CustomButton`: Styled button component
4. State and utilities:
   - `useState`: For form state management
   - `signIn`: Appwrite authentication function
   - `Sentry`: Error tracking

```typescript
const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    const submit = async () => {
        const { email, password } = form;

        if(!email || !password) return Alert.alert('Error', 'Please enter valid email address & password.');

        setIsSubmitting(true)
```

**Component Setup:**

1. State management:
   - `isSubmitting`: Tracks form submission state
   - `form`: Holds email and password values
2. Submit function:
   - Validates required fields
   - Shows error alert if validation fails
   - Sets loading state

```typescript
try {
  await signIn({ email, password });
  router.replace("/");
} catch (error: any) {
  Alert.alert("Error", error.message);
  Sentry.captureEvent(error);
} finally {
  setIsSubmitting(false);
}
```

**Authentication Logic:**

1. Attempts to sign in with Appwrite
2. On success: Navigates to home screen
3. On error:
   - Shows error message to user
   - Logs error to Sentry
4. Always cleans up loading state

```typescript
    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label="Email"
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                label="Password"
                secureTextEntry={true}
            />
```

**Form UI:**

1. Container styling:
   - White background
   - Rounded corners
   - Consistent spacing
2. Email input:
   - Email-specific keyboard
   - Label and placeholder
   - Value binding to form state
3. Password input:
   - Secure text entry
   - Label and placeholder
   - Value binding to form state

```typescript
            <CustomButton
                title="Sign In"
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Don't have an account?
                </Text>
                <Link href="/sign-up" className="base-bold text-primary">
                    Sign Up
                </Link>
            </View>
```

**Action Elements:**

1. Sign In button:
   - Shows loading state
   - Triggers submit function
2. Sign Up link:
   - Helps new users navigate to registration
   - Styled with primary color
   - Uses Link for navigation

This sign-in screen provides:

- Clean, professional form layout
- Form validation and error handling
- Loading states for better UX
- Easy navigation to sign-up
- Error tracking integration
- Secure password handling

### 4. Sign Up Screen (`app/(auth)/sign-up.tsx`)

```typescript
import { View, Text, Button, Alert } from "react-native";
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useState } from "react";
import { createUser } from "@/lib/appwrite";
```

**Import Analysis:**

1. Core components:
   - Same basic UI components as sign-in
   - Navigation utilities from Expo Router
2. Custom components:
   - Reusable input and button components
3. State and backend:
   - React's useState for form management
   - createUser function from Appwrite

```typescript
const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const submit = async () => {
        const { name, email, password } = form;

        if(!name || !email || !password) return Alert.alert('Error', 'Please enter valid email address & password.');

        setIsSubmitting(true)
```

**Component Setup:**

1. State initialization:
   - Loading state tracker
   - Form state with name, email, password
2. Submit handler:
   - Destructures form values
   - Validates all required fields
   - Shows error if validation fails
   - Manages loading state

```typescript
try {
  await createUser({ email, password, name });
  router.replace("/");
} catch (error: any) {
  Alert.alert("Error", error.message);
} finally {
  setIsSubmitting(false);
}
```

**Registration Logic:**

1. Attempts user creation with Appwrite
2. On success:
   - Automatically navigates to home
3. On error:
   - Shows error message to user
4. Always resets loading state

```typescript
    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                label="Full name"
            />
            <CustomInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label="Email"
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                label="Password"
                secureTextEntry={true}
            />
```

**Form Interface:**

1. Container styling:
   - Matches sign-in styling
   - Consistent spacing and layout
2. Input fields:
   - Full name input (additional to sign-in)
   - Email input with email keyboard
   - Secure password input
   - All with labels and placeholders

```typescript
            <CustomButton
                title="Sign Up"
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Already have an account?
                </Text>
                <Link href="/sign-in" className="base-bold text-primary">
                    Sign In
                </Link>
            </View>
```

**Action Elements:**

1. Sign Up button:
   - Shows loading state during submission
   - Handles user registration
2. Sign In link:
   - Helps existing users navigate to login
   - Matches sign-in page styling

This sign-up screen provides:

- Extended form with name field
- Matching styling with sign-in
- Form validation for all fields
- Clear error messaging
- Loading state feedback
- Easy navigation to sign-in

### 5. Tab Navigation Layout (`app/(tabs)/_layout.tsx`)

```typescript
import { Redirect, Slot, Tabs } from "expo-router";
import useAuthStore from "@/store/auth.store";
import { TabBarIconProps } from "@/type";
import { Image, Text, View } from "react-native";
import { images } from "@/constants";
import cn from "clsx";
```

**Import Analysis:**

1. Navigation components:
   - `Tabs`: Bottom tab navigation
   - `Redirect`: Authentication protection
2. State and types:
   - `useAuthStore`: Auth state management
   - `TabBarIconProps`: Type for tab icons
3. UI utilities:
   - Basic React Native components
   - `images`: Icon assets
   - `cn`: Class name utility

```typescript
const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
    <View className="tab-icon">
        <Image source={icon} className="size-7" resizeMode="contain" tintColor={focused ? '#FE8C00' : '#5D5F6D'} />
        <Text className={cn('text-sm font-bold', focused ? 'text-primary':'text-gray-200')}>
            {title}
        </Text>
    </View>
)
```

**Tab Icon Component:**

1. Props:
   - `focused`: Active state
   - `icon`: Icon image source
   - `title`: Tab label
2. Styling:
   - Icon color changes on focus
   - Text color changes on focus
   - Bold font for labels
   - Consistent sizing

```typescript
export default function TabLayout() {
    const { isAuthenticated } = useAuthStore();

    if(!isAuthenticated) return <Redirect href="/sign-in" />
```

**Authentication Check:**

1. Gets auth state from store
2. Redirects to sign-in if not authenticated

```typescript
    return (
        <Tabs screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    marginHorizontal: 20,
                    height: 80,
                    position: 'absolute',
                    bottom: 40,
                    backgroundColor: 'white',
                    shadowColor: '#1a1a1a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5
                }
            }}>
```

**Tab Bar Configuration:**

1. Visual settings:
   - No headers
   - Custom tab bar style
   - Floating design with shadows
   - Rounded corners
   - Fixed position at bottom
2. Layout:
   - Fixed height
   - Horizontal margins
   - Elevation for Android
   - Shadow for iOS

```typescript
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Home" icon={images.home} focused={focused} />
                }}
            />
            // ... Similar configuration for search, cart, and profile tabs
```

**Tab Screen Setup:**

1. Home tab:
   - Default landing page
   - Home icon and label
2. Search tab:
   - Food discovery screen
   - Search icon and label
3. Cart tab:
   - Shopping cart view
   - Bag icon and label
4. Profile tab:
   - User settings and info
   - Person icon and label

This tab layout provides:

- Protected navigation routes
- Beautiful floating tab bar
- Consistent icon styling
- Clear visual feedback
- Smooth animations
- Platform-specific shadows

### 6. Home Screen (`app/(tabs)/index.tsx`)

```typescript
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
import useAuthStore from "@/store/auth.store";
```

**Import Analysis:**

1. Layout components:
   - `SafeAreaView`: Handles device notches/cutouts
   - Basic React Native UI components
2. Utilities:
   - `Fragment`: For multiple children
   - `cn`: Class name utility
3. Custom components:
   - `CartButton`: Shopping cart button
4. Data and state:
   - `images`: Image assets
   - `offers`: Special offers data
   - `useAuthStore`: User authentication state

```typescript
export default function Index() {
  const { user } = useAuthStore();

  return (
      <SafeAreaView className="flex-1 bg-white">
          <FlatList
              data={offers}
              contentContainerClassName="pb-28 px-5"
```

**Basic Structure:**

1. Gets authenticated user
2. Safe area wrapper for notches
3. Scrollable list with:
   - Bottom padding for tab bar
   - Horizontal padding

```typescript
              ListHeaderComponent={() => (
                  <View className="flex-row w-full my-5 flex-between">
                      <View className="flex-start">
                          <Text className="small-bold text-primary">DELIVER TO</Text>
                          <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                              <Text className="paragraph-bold text-dark-100">Croatia</Text>
                              <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
                          </TouchableOpacity>
                      </View>

                      <CartButton />
                  </View>
              )}
```

**Header Component:**

1. Layout:
   - Flex row with space between
   - Margin vertical spacing
2. Delivery location:
   - "DELIVER TO" label
   - Location button with dropdown
3. Cart button:
   - Floating cart component
   - Right-aligned

```typescript
              renderItem={({ item, index }) => {
                  const isEven = index % 2 === 0;

                  return (
                      <View>
                          <Pressable
                              className={cn("offer-card", isEven ? 'flex-row-reverse' : 'flex-row')}
                              style={{ backgroundColor: item.color }}
                              android_ripple={{ color: "#fffff22"}}
                          >
```

**Offer Card Rendering:**

1. Card structure:
   - Alternating layout (even/odd)
   - Background color from offer
   - Android ripple effect
2. Layout handling:
   - Flex row or row-reverse
   - Dynamic padding based on layout

```typescript
                              {({ pressed }) => (
                                  <Fragment>
                                      <View className={"h-full w-1/2"}>
                                        <Image source={item.image} className={"size-full"} resizeMode={"contain"} />
                                      </View>

                                      <View className={cn("offer-card__info", isEven ? 'pl-10': 'pr-10')}>
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
                              )}
```

**Offer Card Content:**

1. Image section:
   - Takes half width
   - Contained image scaling
2. Info section:
   - Dynamic padding based on layout
   - Bold white title
   - Arrow indicator
3. Press feedback:
   - Ripple effect on Android
   - Pressed state available

This home screen provides:

- Safe area handling
- Smooth scrolling list
- Beautiful offer cards
- Alternating layouts
- Location selection
- Quick cart access
- Platform-specific interactions

### 7. Search Screen (`app/(tabs)/search.tsx`)

```typescript
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import { getCategories, getMenu } from "@/lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import CartButton from "@/components/CartButton";
import cn from "clsx";
import MenuCard from "@/components/MenuCard";
import { MenuItem } from "@/type";
import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
```

**Import Analysis:**

1. Core components:
   - Basic React Native components
   - Safe area handling
2. Data fetching:
   - Appwrite hooks and functions
   - URL parameter handling
3. Custom components:
   - `CartButton`: Shopping cart
   - `MenuCard`: Food item display
   - `Filter`: Category filtering
   - `SearchBar`: Search input

```typescript
const Search = () => {
    const { category, query } = useLocalSearchParams<{query: string; category: string}>()

    const { data, refetch, loading } = useAppwrite({
        fn: getMenu,
        params: { category, query, limit: 6 }
    });
    const { data: categories } = useAppwrite({ fn: getCategories });

    useEffect(() => {
        refetch({ category, query, limit: 6})
    }, [category, query]);
```

**Data Management:**

1. URL parameters:
   - Gets category and search query
2. Menu data:
   - Fetches filtered menu items
   - Limited to 6 items
   - Refetches on filter/query change
3. Categories:
   - Loads available food categories

```typescript
    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={data}
                numColumns={2}
                columnWrapperClassName="gap-7"
                contentContainerClassName="gap-7 px-5 pb-32"
                keyExtractor={item => item.$id}
```

**List Configuration:**

1. Layout:
   - Two-column grid
   - Gap between items
   - Bottom padding for tab bar
   - Unique keys for items

```typescript
                ListHeaderComponent={() => (
                    <View className="my-5 gap-5">
                        <View className="flex-between flex-row w-full">
                            <View className="flex-start">
                                <Text className="small-bold uppercase text-primary">Search</Text>
                                <Text className="paragraph-semibold text-dark-100">
                                    Find your favorite food
                                </Text>
                            </View>
                            <CartButton />
                        </View>

                        <SearchBar />
                        <Filter categories={categories!} />
                    </View>
                )}
```

**Header Components:**

1. Title section:
   - "SEARCH" label
   - Subtitle with instruction
   - Cart button aligned right
2. Search interface:
   - Search bar for text input
   - Category filter strip

```typescript
                renderItem={({ item, index }) => {
                    const isFirstRightColItem = index % 2 === 0;

                    return (
                        <View className={cn("flex-1 max-w-[48%]", !isFirstRightColItem ? 'mt-10': 'mt-0')}>
                            <MenuCard item={item as MenuItem} />
                        </View>
                    )
                }}
                ListEmptyComponent={() => !loading && <Text>No results</Text>}
```

**Item Rendering:**

1. Grid layout:
   - Items take 48% width
   - Staggered start for visual interest
2. Menu card:
   - Displays food item details
   - Consistent width
3. Empty state:
   - Shows when no results found
   - Only after loading complete

This search screen provides:

- Real-time search filtering
- Category-based filtering
- Two-column grid layout
- Staggered card display
- Empty state handling
- Quick cart access
- Smooth data fetching
- Visual feedback during loading

### 8. Cart Screen (`app/(tabs)/cart.tsx`)

```typescript
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cart.store";
import CustomHeader from "@/components/CustomHeader";
import cn from "clsx";
import CustomButton from "@/components/CustomButton";
import CartItem from "@/components/CartItem";
```

**Import Analysis:**

1. Core components:
   - Basic React Native UI
   - Safe area handling
2. State management:
   - Cart store hook
3. Custom components:
   - Header component
   - Button component
   - Cart item component
4. Utilities:
   - Class name utility

```typescript
const PaymentInfoStripe = ({ label, value, labelStyle, valueStyle }: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);
```

**Payment Info Component:**

1. Structure:
   - Flex row with space between
   - Label on left, value on right
2. Styling:
   - Consistent vertical spacing
   - Custom label and value styles
   - Bold value text

```typescript
const Cart = () => {
    const { items, getTotalItems, getTotalPrice } = useCartStore();

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
```

**Cart Management:**

1. State access:
   - Cart items array
   - Total items calculator
   - Total price calculator
2. Computed values:
   - Current item count
   - Current total price

```typescript
    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={items}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerClassName="pb-28 px-5 pt-5"
                ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
                ListEmptyComponent={() => <Text>Cart Empty</Text>}
```

**List Structure:**

1. Layout:
   - Full height white background
   - Safe area padding
   - Bottom padding for tab bar
2. Components:
   - Custom header with title
   - Cart items list
   - Empty state message

```typescript
                ListFooterComponent={() => totalItems > 0 && (
                    <View className="gap-5">
                        <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                            <Text className="h3-bold text-dark-100 mb-5">
                                Payment Summary
                            </Text>

                            <PaymentInfoStripe
                                label={`Total Items (${totalItems})`}
                                value={`$${totalPrice.toFixed(2)}`}
                            />
                            <PaymentInfoStripe
                                label={`Delivery Fee`}
                                value={`$5.00`}
                            />
                            <PaymentInfoStripe
                                label={`Discount`}
                                value={`- $0.50`}
                                valueStyle="!text-success"
                            />
```

**Payment Summary:**

1. Layout:
   - Rounded border container
   - Consistent padding
   - Gap between elements
2. Information displayed:
   - Total items and price
   - Delivery fee
   - Discount (in green)
   - Grand total

```typescript
                            <View className="border-t border-gray-300 my-2" />
                            <PaymentInfoStripe
                                label={`Total`}
                                value={`$${(totalPrice + 5 - 0.5).toFixed(2)}`}
                                labelStyle="base-bold !text-dark-100"
                                valueStyle="base-bold !text-dark-100 !text-right"
                            />
                        </View>

                        <CustomButton title="Order Now" />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}
```

**Summary and Action:**

1. Total calculation:
   - Adds delivery fee
   - Subtracts discount
   - Shows grand total
2. Styling:
   - Separator line
   - Bold total text
   - Right-aligned values
3. Order button:
   - Clear call to action
   - Only shown with items

This cart screen provides:

- Clear item listing
- Real-time total calculation
- Detailed payment breakdown
- Empty state handling
- Beautiful summary card
- Easy checkout flow
- Responsive layout
- Professional styling

### 9. Profile Screen (`app/(tabs)/profile.tsx`)

This is currently a placeholder component ready for implementation of user profile features.

### 10. Cart Button Component (`components/CartButton.tsx`)

```typescript
import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { router } from "expo-router";
```

**Import Analysis:**

1. Core components:
   - Basic React Native UI elements
2. Navigation:
   - Expo Router for navigation
3. State and assets:
   - Cart store for state
   - Image constants

```typescript
const CartButton = () => {
    const { getTotalItems } = useCartStore();
    const totalItems = getTotalItems();

    return (
        <TouchableOpacity className="cart-btn" onPress={()=> router.push('/cart')}>
            <Image source={images.bag} className="size-5" resizeMode="contain" />

            {totalItems > 0 && (
                <View className="cart-badge">
                    <Text className="small-bold text-white">{totalItems}</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}
```

**Component Structure:**

1. State management:
   - Gets total items from cart store
2. Button layout:
   - Touchable container
   - Shopping bag icon
3. Badge feature:
   - Only shows when items exist
   - Displays item count
   - Bold white text

**Functionality:**

1. Navigation:
   - Pushes to cart screen on press
2. Visual feedback:
   - Shows current cart quantity
   - Updates in real-time
3. Styling:
   - Consistent icon size
   - Contained image scaling
   - Badge positioning

This cart button component provides:

- Quick cart access
- Real-time item count
- Clean visual design
- Clear touch target
- Dynamic badge display
- Consistent styling
- Smooth navigation

### 11. Cart Item Component (`components/CartItem.tsx`)

```typescript
import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { images } from "@/constants";
```

**Import Analysis:**

1. State management:
   - Cart store hook for actions
2. Types:
   - CartItemType definition
3. UI components:
   - Basic React Native elements
4. Assets:
   - Image constants

```typescript
const CartItem = ({ item }: { item: CartItemType }) => {
    const { increaseQty, decreaseQty, removeItem } = useCartStore();

    return (
        <View className="cart-item">
            <View className="flex flex-row items-center gap-x-3">
                <View className="cart-item__image">
                    <Image
                        source={{ uri: item.image_url }}
                        className="size-4/5 rounded-lg"
                        resizeMode="cover"
                    />
                </View>
```

**Component Structure:**

1. Props:
   - Takes cart item data
2. State actions:
   - Quantity increase/decrease
   - Item removal
3. Layout:
   - Row layout with spacing
   - Image container
   - Item details section

```typescript
                <View>
                    <Text className="base-bold text-dark-100">{item.name}</Text>
                    <Text className="paragraph-bold text-primary mt-1">
                        ${item.price}
                    </Text>

                    <View className="flex flex-row items-center gap-x-4 mt-2">
                        <TouchableOpacity
                            onPress={() => decreaseQty(item.id, item.customizations!)}
                            className="cart-item__actions"
                        >
                            <Image source={images.minus} className="size-1/2" resizeMode="contain" tintColor={"#FF9C01"} />
                        </TouchableOpacity>

                        <Text className="base-bold text-dark-100">{item.quantity}</Text>

                        <TouchableOpacity
                            onPress={() => increaseQty(item.id, item.customizations!)}
                            className="cart-item__actions"
                        >
                            <Image source={images.plus} className="size-1/2" resizeMode="contain" tintColor={"#FF9C01"} />
                        </TouchableOpacity>
                    </View>
                </View>
```

**Item Details:**

1. Text content:
   - Item name in bold
   - Price in primary color
2. Quantity controls:
   - Minus button
   - Current quantity
   - Plus button
3. Styling:
   - Consistent spacing
   - Orange action buttons
   - Center-aligned controls

```typescript
            <TouchableOpacity
                onPress={() => removeItem(item.id, item.customizations!)}
                className="flex-center"
            >
                <Image source={images.trash} className="size-5" resizeMode="contain" />
            </TouchableOpacity>
```

**Remove Action:**

1. Button placement:
   - Right-aligned
   - Center-aligned content
2. Visual:
   - Trash icon
   - Consistent sizing
3. Function:
   - Removes item completely
   - Handles customizations

This cart item component provides:

- Clear item presentation
- Quantity adjustment controls
- Easy item removal
- Customization support
- Consistent spacing
- Professional styling
- Smooth interactions
- Responsive layout

### 12. Custom Button Component (`components/CustomButton.tsx`)

```typescript
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { CustomButtonProps } from "@/type";
import cn from "clsx";
```

**Import Analysis:**

1. Core components:
   - Basic React Native UI elements
   - Loading indicator
2. Type definitions:
   - Custom button props interface
3. Utilities:
   - Class name utility

```typescript
const CustomButton = ({
    onPress,
    title="Click Me",
    style,
    textStyle,
    leftIcon,
    isLoading = false
}: CustomButtonProps) => {
```

**Props Structure:**

1. Required props:
   - `onPress`: Button action
2. Optional props:
   - `title`: Button text (default "Click Me")
   - `style`: Container styles
   - `textStyle`: Text styles
   - `leftIcon`: Optional left icon
   - `isLoading`: Loading state

```typescript
    return (
        <TouchableOpacity className={cn('custom-btn', style)} onPress={onPress}>
            {leftIcon}

            <View className="flex-center flex-row">
                {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                ): (
                    <Text className={cn('text-white-100 paragraph-semibold', textStyle)}>
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    )
}
```

**Component Structure:**

1. Container:
   - Touchable wrapper
   - Customizable styles
   - Base button styles
2. Content layout:
   - Optional left icon
   - Center-aligned content
   - Flexible styling
3. States:
   - Loading spinner
   - Normal text state
4. Text styling:
   - Semi-bold weight
   - White color
   - Customizable styles

This custom button component provides:

- Reusable button structure
- Loading state handling
- Customizable styling
- Icon support
- Consistent text styling
- Center-aligned content
- Touch feedback
- Loading indicator

### 13. Custom Header Component (`components/CustomHeader.tsx`)

```typescript
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { CustomHeaderProps } from "@/type";
import { images } from "@/constants";
```

**Import Analysis:**

1. Navigation:
   - Expo Router hook
2. Core components:
   - Basic React Native UI elements
3. Types and assets:
   - Header props interface
   - Image constants

```typescript
const CustomHeader = ({ title }: CustomHeaderProps) => {
    const router = useRouter();

    return (
        <View className="custom-header">
            <TouchableOpacity onPress={() => router.back()}>
                <Image
                    source={images.arrowBack}
                    className="size-5"
                    resizeMode="contain"
                />
            </TouchableOpacity>
```

**Header Structure:**

1. Props:
   - Optional title text
2. Navigation:
   - Router for back navigation
3. Back button:
   - Arrow icon
   - Touch handler
   - Consistent size

```typescript
            {title && <Text className="base-semibold text-dark-100">{title}</Text>}

            <Image source={images.search} className="size-5" resizeMode="contain" />
        </View>
    );
};
```

**Header Content:**

1. Title:
   - Conditional rendering
   - Semi-bold styling
   - Dark text color
2. Search icon:
   - Fixed size
   - Contained scaling
3. Layout:
   - Three-column structure
   - Consistent spacing
   - Center alignment

This custom header component provides:

- Consistent header layout
- Back navigation
- Optional title display
- Search icon placement
- Clean visual design
- Easy navigation
- Flexible content
- Professional styling

### 14. Custom Input Component (`components/CustomInput.tsx`)

```typescript
import { View, Text, TextInput } from "react-native";
import { CustomInputProps } from "@/type";
import { useState } from "react";
import cn from "clsx";
```

**Import Analysis:**

1. Core components:
   - Basic React Native UI elements
2. State and types:
   - React's useState hook
   - Input props interface
3. Utilities:
   - Class name utility

```typescript
const CustomInput = ({
    placeholder = 'Enter text',
    value,
    onChangeText,
    label,
    secureTextEntry = false,
    keyboardType="default"
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
```

**Props Structure:**

1. Required props:
   - `value`: Input value
   - `onChangeText`: Change handler
2. Optional props:
   - `placeholder`: Default text
   - `label`: Input label
   - `secureTextEntry`: Password mode
   - `keyboardType`: Keyboard configuration
3. Internal state:
   - Focus tracking

```typescript
    return (
        <View className="w-full">
            <Text className="label">{label}</Text>

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                placeholderTextColor="#888"
                className={cn('input', isFocused ? 'border-primary' : 'border-gray-300')}
            />
        </View>
    )
}
```

**Component Structure:**

1. Container:
   - Full width layout
   - Label above input
2. Input configuration:
   - No auto-capitalization
   - No auto-correction
   - Value binding
   - Change handler
   - Security mode
   - Keyboard type
3. Focus handling:
   - Focus state tracking
   - Border color change
4. Styling:
   - Gray placeholder
   - Dynamic border color
   - Consistent spacing

This custom input component provides:

- Professional input styling
- Focus state handling
- Flexible configuration
- Password support
- Keyboard customization
- Error prevention
- Clear visual feedback
- Consistent layout
- Label integration

### 15. Filter Component (`components/Filter.tsx`)

```typescript
import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import { Category } from "@/type";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import cn from "clsx";
```

**Import Analysis:**

1. Core components:
   - Basic React Native UI elements
2. Navigation:
   - Expo Router utilities
3. State and types:
   - React's useState
   - Category type
4. Utilities:
   - Class name utility
   - Platform detection

```typescript
const Filter = ({ categories }: { categories: Category[] }) => {
    const searchParams = useLocalSearchParams();
    const [active, setActive] = useState(searchParams.category || '');

    const handlePress = (id: string) => {
        setActive(id);
        if(id === 'all') router.setParams({ category: undefined });
        else router.setParams({ category: id });
    };
```

**Component Logic:**

1. Props:
   - Categories array
2. State:
   - Active category tracking
   - URL parameter sync
3. Press handler:
   - Updates active state
   - Updates URL parameters
   - Special "all" case

```typescript
    const filterData: (Category | { $id: string; name: string })[] = categories
        ? [{ $id: 'all', name: 'All' }, ...categories]
        : [{ $id: 'all', name: 'All' }]

    return (
        <FlatList
            data={filterData}
            keyExtractor={(item) => item.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-x-2 pb-3"
```

**List Structure:**

1. Data preparation:
   - Adds "All" option
   - Fallback handling
2. List configuration:
   - Horizontal scrolling
   - Hidden scroll indicator
   - Consistent spacing
   - Unique keys

```typescript
            renderItem={({ item }) => (
                <TouchableOpacity
                    key={item.$id}
                    className={cn('filter', active === item.$id ? 'bg-amber-500' : 'bg-white')}
                    style={Platform.OS === 'android' ? { elevation: 5, shadowColor: '#878787'} : {}}
                    onPress={() => handlePress(item.$id)}
                >
                    <Text className={cn('body-medium', active === item.$id ? 'text-white' : 'text-gray-200')}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )}
        />
```

**Filter Items:**

1. Visual states:
   - Active: Amber background
   - Inactive: White background
2. Platform handling:
   - Android elevation
   - iOS shadows
3. Text styling:
   - Medium weight
   - Color changes with state
4. Interaction:
   - Touch feedback
   - Category selection

This filter component provides:

- Horizontal category filtering
- Active state tracking
- URL parameter sync
- Platform-specific shadows
- Smooth scrolling
- Visual feedback
- Clean design
- Consistent spacing

### 16. Menu Card Component (`components/MenuCard.tsx`)

```typescript
import { Text, TouchableOpacity, Image, Platform } from "react-native";
import { MenuItem } from "@/type";
import { appwriteConfig } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
```

**Import Analysis:**

1. Core components:
   - Basic React Native UI elements
2. Types and config:
   - Menu item interface
   - Appwrite configuration
3. State management:
   - Cart store hook
4. Platform detection:
   - For shadow handling

```typescript
const MenuCard = ({ item: { $id, image_url, name, price }}: { item: MenuItem}) => {
    const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`;
    const { addItem } = useCartStore();
```

**Component Setup:**

1. Props destructuring:
   - Item ID, image, name, price
2. Image URL:
   - Appwrite project context
3. Cart actions:
   - Add to cart function

```typescript
    return (
        <TouchableOpacity className="menu-card"
            style={Platform.OS === 'android' ?
                { elevation: 10, shadowColor: '#878787'}:
                {}
            }
        >
            <Image
                source={{ uri: imageUrl }}
                className="size-32 absolute -top-10"
                resizeMode="contain"
            />
```

**Card Structure:**

1. Container:
   - Touchable card
   - Platform-specific shadows
   - Consistent styling
2. Image:
   - Fixed size
   - Contained scaling
   - Overlapping position

```typescript
            <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>
                {name}
            </Text>
            <Text className="body-regular text-gray-200 mb-4">
                From ${price}
            </Text>
            <TouchableOpacity onPress={() => addItem({
                id: $id,
                name,
                price,
                image_url: imageUrl,
                customizations: []
            })}>
                <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </TouchableOpacity>
```

**Content Layout:**

1. Item name:
   - Center aligned
   - Single line with ellipsis
   - Bold dark text
2. Price:
   - Gray text color
   - "From" prefix
   - Bottom margin
3. Add button:
   - Primary colored text
   - Plus icon
   - Touch handler

This menu card component provides:

- Professional item display
- Consistent card layout
- Platform-specific styling
- Image optimization
- Clear pricing display
- Easy add to cart
- Touch feedback
- Clean typography

### 17. Search Bar Component (`components/SearchBar.tsx`)

```typescript
import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
```

**Import Analysis:**

1. Core components:
   - Basic React Native UI elements
2. Navigation:
   - Expo Router utilities
3. State:
   - React's useState hook
4. Assets:
   - Search icon image

```typescript
const Searchbar = () => {
    const params = useLocalSearchParams<{ query: string }>();
    const [query, setQuery] = useState(params.query);

    const handleSearch = (text: string) => {
        setQuery(text);
        if(!text) router.setParams({ query: undefined });
    };

    const handleSubmit = () => {
        if(query.trim()) router.setParams({ query });
    }
```

**Search Logic:**

1. State management:
   - Query text state
   - URL parameter sync
2. Text handling:
   - Updates query state
   - Clears URL on empty
3. Submit handling:
   - Trims whitespace
   - Updates URL parameters

```typescript
    return (
        <View className="searchbar">
            <TextInput
                className="flex-1 p-5"
                placeholder="Search for pizzas, burgers..."
                value={query}
                onChangeText={handleSearch}
                onSubmitEditing={handleSubmit}
                placeholderTextColor="#A0A0A0"
                returnKeyType="search"
            />
```

**Input Configuration:**

1. Layout:
   - Flexible width
   - Consistent padding
2. Visual:
   - Custom placeholder
   - Gray placeholder color
3. Interaction:
   - Search keyboard return
   - Submit handler

```typescript
            <TouchableOpacity
                className="pr-5"
                onPress={() => router.setParams({ query })}
            >
                <Image
                    source={images.search}
                    className="size-6"
                    resizeMode="contain"
                    tintColor="#5D5F6D"
                />
            </TouchableOpacity>
```

**Search Button:**

1. Layout:
   - Right padding
   - Touch target
2. Icon:
   - Search image
   - Gray tint
   - Contained scaling
3. Action:
   - Updates URL with query

This search bar component provides:

- Real-time query handling
- URL parameter sync
- Clean visual design
- Clear placeholder
- Search icon button
- Keyboard optimization
- Empty state handling
- Professional styling

### 18. Auth Store (`store/auth.store.ts`)

```typescript
import { create } from "zustand";
import { User } from "@/type";
import { getCurrentUser } from "@/lib/appwrite";
```

**Import Analysis:**

1. State management:
   - Zustand store creator
2. Types:
   - User interface
3. Backend:
   - User fetch function

```typescript
type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
};
```

**State Interface:**

1. State properties:
   - Authentication status
   - User object
   - Loading state
2. State setters:
   - Authentication setter
   - User setter
   - Loading setter
3. Actions:
   - User fetch function

```typescript
const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: true,

    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    setUser: (user) => set({ user }),
    setLoading: (value) => set({isLoading: value}),
```

**Store Creation:**

1. Initial state:
   - Not authenticated
   - No user
   - Loading true
2. Basic setters:
   - Direct state updates
   - Simple value assignment

```typescript
fetchAuthenticatedUser: async () => {
  set({ isLoading: true });

  try {
    const user = await getCurrentUser();

    if (user) set({ isAuthenticated: true, user: user as User });
    else set({ isAuthenticated: false, user: null });
  } catch (e) {
    console.log("fetchAuthenticatedUser error", e);
    set({ isAuthenticated: false, user: null });
  } finally {
    set({ isLoading: false });
  }
};
```

**User Fetching:**

1. Loading state:
   - Sets loading true
   - Ensures cleanup
2. User check:
   - Fetches current user
   - Updates auth state
3. Error handling:
   - Logs errors
   - Clears user state
4. Cleanup:
   - Always turns off loading

This auth store provides:

- Global auth state
- User information
- Loading states
- Error handling
- State persistence
- Simple state updates
- Async user fetching
- Type safety

### 19. Cart Store (`store/cart.store.ts`)

```typescript
import { CartCustomization, CartStore } from "@/type";
import { create } from "zustand";
```

**Import Analysis:**

1. State management:
   - Zustand store creator
2. Types:
   - Cart customization type
   - Cart store interface

```typescript
function areCustomizationsEqual(
  a: CartCustomization[] = [],
  b: CartCustomization[] = []
): boolean {
  if (a.length !== b.length) return false;

  const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
  const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

  return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}
```

**Utility Function:**

1. Comparison logic:
   - Checks array lengths
   - Sorts by ID
   - Compares each item
2. Edge cases:
   - Handles undefined arrays
   - Order-independent comparison

```typescript
export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    addItem: (item) => {
        const customizations = item.customizations ?? [];

        const existing = get().items.find(
            (i) =>
                i.id === item.id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
        );

        if (existing) {
            set({
                items: get().items.map((i) =>
                    i.id === item.id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            set({
                items: [...get().items, { ...item, quantity: 1, customizations }],
            });
        }
    },
```

**Cart Operations:**

1. Add item:
   - Checks for existing item
   - Handles customizations
   - Updates quantity or adds new
2. State updates:
   - Preserves immutability
   - Handles edge cases
   - Updates quantities

```typescript
    removeItem: (id, customizations = []) => {
        set({
            items: get().items.filter(
                (i) =>
                    !(
                        i.id === id &&
                        areCustomizationsEqual(i.customizations ?? [], customizations)
                    )
            ),
        });
    },

    increaseQty: (id, customizations = []) => {
        set({
            items: get().items.map((i) =>
                i.id === id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    decreaseQty: (id, customizations = []) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0),
        });
    },
```

**Item Management:**

1. Remove:
   - Filters out item
   - Matches customizations
2. Increase:
   - Adds to quantity
   - Preserves other items
3. Decrease:
   - Reduces quantity
   - Removes if zero

```typescript
    clearCart: () => set({ items: [] }),

    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () =>
        get().items.reduce((total, item) => {
            const base = item.price;
            const customPrice =
                item.customizations?.reduce(
                    (s: number, c: CartCustomization) => s + c.price,
                    0
                ) ?? 0;
            return total + item.quantity * (base + customPrice);
        }, 0),
```

**Cart Utilities:**

1. Clear cart:
   - Resets to empty
2. Total items:
   - Sums all quantities
3. Total price:
   - Base price calculation
   - Customization prices
   - Quantity multiplication

This cart store provides:

- Complex item handling
- Customization support
- Quantity management
- Price calculations
- State persistence
- Type safety
- Immutable updates
- Clean interfaces

### 20. Appwrite Integration (`lib/appwrite.ts`)

```typescript
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
```

**Import Analysis:**

1. Appwrite SDK:
   - Core client
   - Account management
   - Database operations
   - Storage handling
   - Query builder
2. Type definitions:
   - User creation params
   - Menu query params
   - Sign-in params

```typescript
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.sahil.fooddelivery",
  databaseId: "68836a6f002e3915b961",
  bucketId: "68837795001088e50ec9",
  userCollectionId: "68836b22001362a55753",
  categoriesCollectionId: "68836c4c00097bbb6396",
  menuCollectionId: "68836d500017db2e04eb",
  customizationsCollectionId: "68836f77002534d80af9",
  menuCustomizationsCollectionId: "6883733a002a49a99124",
};
```

**Configuration:**

1. Environment variables:
   - Endpoint URL
   - Project ID
2. Collection IDs:
   - Users
   - Categories
   - Menu items
   - Customizations
   - Menu-customization relations

```typescript
export const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);
```

**Client Setup:**

1. Client initialization:
   - Endpoint configuration
   - Project setting
   - Platform specification
2. Service initialization:
   - Account service
   - Database service
   - Storage service
   - Avatar service

```typescript
export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;

    await signIn({ email, password });
    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { email, name, accountId: newAccount.$id, avatar: avatarUrl }
    );
  } catch (e) {
    throw new Error(e as string);
  }
};
```

**Authentication Functions:**

1. User creation:
   - Creates account
   - Automatic sign-in
   - Generates avatar
   - Creates user document
2. Error handling:
   - Validates account
   - Throws clear errors

```typescript
export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    );

    return menus.documents;
  } catch (e) {
    throw new Error(e as string);
  }
};
```

**Data Fetching:**

1. Menu retrieval:
   - Category filtering
   - Name searching
   - Dynamic queries
2. Query building:
   - Conditional filters
   - Search functionality
   - Error handling

This Appwrite integration provides:

- Secure authentication
- Database operations
- File storage
- Avatar handling
- Query building
- Error management
- Type safety
- Clear interfaces

### 21. Appwrite Hook (`lib/useAppwrite.ts`)

```typescript
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}
```

**Type Definitions:**

1. Hook options:
   - Generic function type
   - Optional parameters
   - Skip flag
2. Return interface:
   - Data of generic type
   - Loading state
   - Error handling
   - Refetch function

```typescript
const useAppwrite = <T, P extends Record<string, string | number>>({
    fn,
    params = {} as P,
    skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);
```

**Hook Setup:**

1. Generic types:
   - T for response data
   - P for parameter shape
2. State management:
   - Data storage
   - Loading indicator
   - Error tracking

```typescript
const fetchData = useCallback(
  async (fetchParams: P) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fn({ ...fetchParams });
      setData(result);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  },
  [fn]
);
```

**Data Fetching:**

1. Function setup:
   - Memoized callback
   - Parameter spreading
   - Loading management
2. Error handling:
   - Type checking
   - User alerts
   - Error state
3. Cleanup:
   - Loading state reset

```typescript
useEffect(() => {
  if (!skip) {
    fetchData(params);
  }
}, []);

const refetch = async (newParams?: P) => await fetchData(newParams!);

return { data, loading, error, refetch };
```

**Hook Logic:**

1. Initial fetch:
   - Runs on mount
   - Skip option
2. Refetch utility:
   - Parameter updates
   - Manual triggering
3. Return values:
   - Current data
   - Loading state
   - Error info
   - Refetch function

This Appwrite hook provides:

- Type-safe queries
- Loading states
- Error handling
- Data caching
- Manual refetching
- Skip capability
- Generic typing
- Clean interface

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
food_ordering/
├── app/           # Expo Router based navigation
├── assets/        # Static assets (images, fonts, icons)
├── components/    # Reusable UI components
├── constants/     # Global constants and configurations
├── lib/          # Core utilities and backend integration
└── store/        # Global state management
```

## Core Configuration Files

### `package.json`

- Dependencies and scripts management
- Key dependencies:
  - expo: React Native development platform
  - @react-navigation: Navigation framework
  - nativewind: Tailwind CSS for React Native
  - zustand: State management
  - appwrite: Backend services

### `tailwind.config.js`

- NativeWind configuration
- Custom theme settings
- Responsive breakpoints
- Custom color palette

### `tsconfig.json`

- TypeScript configuration
- Path aliases
- Compiler options
- Type checking rules

### `babel.config.js`

- Babel transpilation settings
- Plugin configurations
- Module resolver settings

## App Directory

### `app/_layout.tsx`

- Root layout component
- Global navigation container
- Theme provider
- Authentication state handling
- Error boundary

### `app/(auth)/_layout.tsx`

- Authentication flow layout
- Stack navigation for auth screens
- Protected route handling

### `app/(auth)/sign-in.tsx`

- Login screen implementation
- Email/password authentication
- Form validation
- Error handling
- Navigation to signup

### `app/(auth)/sign-up.tsx`

- Registration screen
- User account creation
- Form validation
- Success/error handling
- Navigation to signin

### `app/(tabs)/_layout.tsx`

- Bottom tab navigation setup
- Tab icons and labels
- Tab bar styling
- Screen transitions

### `app/(tabs)/index.tsx`

- Home screen
- Menu listing
- Category filters
- Featured items
- Search integration

### `app/(tabs)/cart.tsx`

- Shopping cart screen
- Cart items listing
- Quantity controls
- Price calculation
- Checkout flow

### `app/(tabs)/search.tsx`

- Search functionality
- Filter options
- Search results display
- Dynamic filtering

### `app/(tabs)/profile.tsx`

- User profile screen
- Account details
- Order history
- Settings
- Logout functionality

## Components

### `components/CartButton.tsx`

```typescript
// Features:
- Floating cart button
- Cart items counter
- Animation on item add
- Navigation to cart
- Dynamic badge updating
```

### `components/CartItem.tsx`

```typescript
// Features:
- Individual cart item display
- Quantity controls
- Price calculation
- Remove item functionality
- Image with fallback
```

### `components/CustomButton.tsx`

```typescript
// Features:
- Reusable button component
- Multiple variants (primary, secondary, outline)
- Loading state
- Disabled state
- Touch feedback
```

### `components/CustomHeader.tsx`

```typescript
// Features:
- Screen header component
- Back navigation
- Title display
- Right action buttons
- Dynamic styling
```

### `components/CustomInput.tsx`

```typescript
// Features:
- Text input wrapper
- Error state handling
- Label support
- Icon integration
- Validation integration
```

### `components/Filter.tsx`

```typescript
// Features:
- Category filtering
- Multi-select support
- Active state indication
- Horizontal scrolling
- Custom styling
```

### `components/MenuCard.tsx`

```typescript
// Features:
- Food item display card
- Image with loading state
- Price formatting
- Add to cart action
- Animation effects
```

### `components/SearchBar.tsx`

```typescript
// Features:
- Search input field
- Search icon
- Clear button
- Debounced input
- Search suggestions
```

## State Management

### `store/auth.store.ts`

```typescript
// Features:
- User authentication state
- Login/logout actions
- Token management
- Persistent session
- Error handling
```

### `store/cart.store.ts`

```typescript
// Features:
- Cart items management
- Add/remove items
- Quantity updates
- Total calculation
- Cart persistence
```

## Backend Integration

### `lib/appwrite.ts`

```typescript
// Features:
- Appwrite client configuration
- API endpoints setup
- Project settings
- Database collections
- Storage buckets
```

### `lib/useAppwrite.ts`

```typescript
// Features:
- Custom hook for Appwrite
- Authentication methods
- Database operations
- File storage operations
- Error handling
```

### `lib/seed.ts`

```typescript
// Features:
- Database seeding
- Initial data creation
- Test data generation
- Collection setup
- Data validation
```

## Data and Constants

### `constants/index.ts`

```typescript
// Contains:
- API endpoints
- Theme constants
- Navigation routes
- Error messages
- Configuration values
```

### `lib/data.ts`

```typescript
// Contains:
- Menu items data
- Categories
- Pricing information
- Item descriptions
- Image references
```

## Assets

### Fonts

- Quicksand family (Light to Bold)
- Used for consistent typography

### Icons

- Custom icon set
- Navigation icons
- Action icons
- UI elements

### Images

- Food item photos
- UI graphics
- Branding assets
- Placeholder images

## Type Definitions

### `type.d.ts`

```typescript
// Global type definitions:
- User interface
- Menu item interface
- Cart item interface
- API response types
- Navigation params
```

## Development Workflow

1. **Authentication Flow**
   - User opens app
   - Checks authentication status
   - Redirects to auth or main flow

2. **Main Flow**
   - Browse menu items
   - Search and filter
   - Add items to cart
   - Manage cart
   - Checkout process

3. **State Updates**
   - Auth state changes
   - Cart modifications
   - UI updates
   - API interactions

## Performance Considerations

- Image optimization
- State management efficiency
- Navigation performance
- API call optimization
- Cache management

## Security Features

- Token-based authentication
- Input validation
- Data encryption
- Session management
- Error handling

This documentation provides a comprehensive overview of each file and its role in the application. Understanding these components will give you a complete picture of how the application works and how to modify or extend it.
