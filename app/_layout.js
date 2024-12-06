// app/_layout.js
import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import NfcManager from 'react-native-nfc-manager';
import { Platform, View, Text, Animated } from 'react-native';
import { colors } from '../styles/globalStyles';

const TabBarIcon = ({ name, color, focused }) => {
     const scale = new Animated.Value(1);

     useEffect(() => {
          if (focused) {
               Animated.spring(scale, {
                    toValue: 1.2,
                    friction: 4,
                    useNativeDriver: true,
               }).start();
          } else {
               Animated.spring(scale, {
                    toValue: 1,
                    friction: 4,
                    useNativeDriver: true,
               }).start();
          }
     }, [focused]);

     return (
          <View style={{
               alignItems: 'center',
               justifyContent: 'center',
               padding: 8,
               marginVertical: 8,
               borderRadius: 12,
               backgroundColor: focused ? `${color}20` : 'transparent',
               minWidth: 56,
          }}>
               <Animated.View style={{ transform: [{ scale }] }}>
                    <MaterialIcons name={name} size={24} color={color} />
               </Animated.View>
          </View>
     );
};

const HeaderLogo = () => (
     <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
     }}>
          <View style={{
               backgroundColor: colors.normalBg,
               borderRadius: 12,
               padding: 8,
               marginRight: 12,
          }}>
               <MaterialIcons name="lock" size={24} color={colors.purple} />
          </View>
          <Text style={{
               color: colors.textPrimary,
               fontSize: 20,
               fontWeight: '600',
          }}>
               NFC Locker
          </Text>
     </View>
);

export default function AppLayout() {
     useEffect(() => {
          const initNfc = async () => {
               const supported = await NfcManager.isSupported();
               if (supported && Platform.OS !== 'web') {
                    await NfcManager.start();
               }
          }

          initNfc().catch(err => console.log('NFC initialization failed:', err));

          return () => {
               if (Platform.OS !== 'web') {
                    NfcManager.stop();
               }
          }
     }, []);

     return (
          <Tabs screenOptions={{
               tabBarStyle: {
                    backgroundColor: colors.darkestBg,
                    borderTopColor: 'rgba(255, 255, 255, 0.1)',
                    borderTopWidth: 1,
                    height: 70,
                    elevation: 0,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
                    paddingTop: 12,
               },
               tabBarShowLabel: false,
               headerStyle: {
                    backgroundColor: colors.darkestBg,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                    height: Platform.OS === 'ios' ? 110 : 80,
               },
               headerTitleStyle: {
                    color: colors.textPrimary,
                    fontSize: 20,
                    fontWeight: '600',
               },
               headerTitle: () => <HeaderLogo />,
               headerTitleAlign: 'left',
          }}>
               <Tabs.Screen
                    name="index"
                    options={{
                         tabBarIcon: ({ focused }) => (
                              <TabBarIcon
                                   name="home"
                                   color={focused ? colors.purple : colors.textSecondary}
                                   focused={focused}
                              />
                         ),
                    }}
               />
               <Tabs.Screen
                    name="read"
                    options={{
                         tabBarIcon: ({ focused }) => (
                              <TabBarIcon
                                   name="nfc"
                                   color={focused ? colors.cyan : colors.textSecondary}
                                   focused={focused}
                              />
                         ),
                    }}
               />
               <Tabs.Screen
                    name="write"
                    options={{
                         tabBarIcon: ({ focused }) => (
                              <TabBarIcon
                                   name="edit"
                                   color={focused ? colors.green : colors.textSecondary}
                                   focused={focused}
                              />
                         ),
                    }}
               />
          </Tabs>
     );
}