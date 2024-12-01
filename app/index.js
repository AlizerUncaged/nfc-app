// app/index.js
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import NfcManager from 'react-native-nfc-manager';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function Home() {
     const router = useRouter();

     useEffect(() => {
          const checkNfc = async () => {

               try {

                    await NfcManager.requestTechnology(NfcTech.Ndef);
console.log(`NFC OK!`);
               }
               catch (ex) {
                    console.warn(ex);

               }
               /*       const supported = await NfcManager.isSupported();
                     if (supported) {
                          await NfcManager.start();
                     } else {
                          alert('NFC is not supported on this device');
                     } */
          };

          checkNfc();
     }, []);

     return (
          <View style={styles.container}>
               <View style={styles.header}>
                    <MaterialIcons name="lock" size={50} color="#2196F3" />
                    <Text style={styles.title}>Smart Locker</Text>
                    <Text style={styles.subtitle}>NFC Management System</Text>
               </View>

               <View style={styles.buttonContainer}>
                    <TouchableOpacity
                         style={[styles.button, styles.readButton]}
                         onPress={() => router.push('/read')}
                    >
                         <MaterialIcons name="nfc" size={30} color="white" />
                         <Text style={styles.buttonText}>Read NFC Tag</Text>
                         <Text style={styles.buttonDescription}>Scan and read NFC tag data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                         style={[styles.button, styles.writeButton]}
                         onPress={() => router.push('/write')}
                    >
                         <MaterialIcons name="edit" size={30} color="white" />
                         <Text style={styles.buttonText}>Write NFC Tag</Text>
                         <Text style={styles.buttonDescription}>Program new NFC tag data</Text>
                    </TouchableOpacity>
               </View>

               <View style={styles.footer}>
                    <Text style={styles.footerText}>Place NFC tag near device when ready</Text>
               </View>
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#f5f5f5',
          padding: 20,
     },
     header: {
          alignItems: 'center',
          marginTop: 60,
          marginBottom: 40,
     },
     title: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#333',
          marginTop: 10,
     },
     subtitle: {
          fontSize: 18,
          color: '#666',
          marginTop: 5,
     },
     buttonContainer: {
          flex: 1,
          justifyContent: 'center',
          gap: 20,
     },
     button: {
          padding: 20,
          borderRadius: 12,
          alignItems: 'center',
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
     },
     readButton: {
          backgroundColor: '#2196F3',
     },
     writeButton: {
          backgroundColor: '#4CAF50',
     },
     buttonText: {
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 10,
     },
     buttonDescription: {
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 14,
          marginTop: 5,
     },
     footer: {
          alignItems: 'center',
          padding: 20,
     },
     footerText: {
          color: '#666',
          fontSize: 16,
     }
});