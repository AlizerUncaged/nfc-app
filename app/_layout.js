// app/_layout.js
import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import NfcManager from 'react-native-nfc-manager';
import { Platform } from 'react-native';

export default function AppLayout() {
     useEffect(() => {
          const initNfc = async () => {
               // Check if device supports NFC
               const supported = await NfcManager.isSupported();
               if (supported && Platform.OS !== 'web') {
                    await NfcManager.start();
               }
          }

          initNfc().catch(err => console.log('NFC initialization failed:', err));

          // Cleanup on unmount
          return () => {
               if (Platform.OS !== 'web') {
                    NfcManager.stop();
               }
          }
     }, []);

     return (
          <Tabs>
               <Tabs.Screen
                    name="read"
                    options={{
                         title: 'Read NFC',
                         tabBarIcon: ({ color, size }) => (
                              <MaterialIcons name="nfc" size={size} color={color} />
                         ),
                    }}
               />
               <Tabs.Screen
                    name="write"
                    options={{
                         title: 'Write NFC',
                         tabBarIcon: ({ color, size }) => (
                              <MaterialIcons name="edit" size={size} color={color} />
                         ),
                    }}
               />
          </Tabs>
     );
}