// app/read.js
import { View, ScrollView, Animated, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { colors } from '../styles/globalStyles';
import { NfcScanIndicator } from '../components/NfcScanIndicator';

export default function ReadNFC() {
     const [tagData, setTagData] = useState(null);
     const [scanning, setScanning] = useState(false);
     const fadeAnim = useRef(new Animated.Value(0)).current;
     const slideAnim = useRef(new Animated.Value(30)).current;

     useEffect(() => {
          Animated.parallel([
               Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
               }),
               Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
               }),
          ]).start();

          // Cleanup NFC when component unmounts
          return () => {
               NfcManager.cancelTechnologyRequest();
          };
     }, []);

     const parseNdefMessage = (message) => {
          try {
               if (!message || !message.length) return 'Empty message';

               const record = message[0];
               if (!record) return 'No records found';

               // Skip the first byte (language code length) for Text Records
               const payload = record.payload;
               if (!payload || !payload.length) return 'Empty payload';

               // Convert payload bytes to string, skipping first byte (language code length)
               return String.fromCharCode.apply(null, payload.slice(1));
          } catch (error) {
               console.warn('Error parsing NDEF message:', error);
               return 'Unable to parse message';
          }
     };

     const readTag = async () => {
          setScanning(true);
          try {
               await NfcManager.requestTechnology(NfcTech.Ndef);
               const tag = await NfcManager.getTag();
               setTagData(tag);

               // Get NDEF message if available
               if (tag) {
                    try {
                         const ndef = await NfcManager.ndefHandler.getNdefMessage();
                         if (ndef) {
                              setTagData(prevData => ({
                                   ...prevData,
                                   ndefMessage: ndef
                              }));
                         }
                    } catch (ndefError) {
                         console.warn('Error reading NDEF:', ndefError);
                    }
               }
          } catch (ex) {
               console.warn('Scan failed:', ex);
          } finally {
               setScanning(false);
               NfcManager.cancelTechnologyRequest();
          }
     };

     const InfoCard = ({ title, value, icon, color }) => (
          <Animated.View
               style={[
                    styles.infoCard,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
               ]}
          >
               <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <MaterialIcons name={icon} size={24} color={color} />
               </View>
               <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>{title}</Text>
                    <Text style={styles.infoValue}>{value}</Text>
               </View>
          </Animated.View>
     );

     return (
          <View style={styles.container}>
               <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
               >
                    <TouchableOpacity
                         onPress={readTag}
                         disabled={scanning}
                         activeOpacity={0.8}
                    >
                         <NfcScanIndicator isScanning={scanning} type="read" />
                    </TouchableOpacity>

                    {tagData && (
                         <Animated.View
                              style={[
                                   styles.dataContainer,
                                   {
                                        opacity: fadeAnim,
                                        transform: [{ translateY: slideAnim }]
                                   }
                              ]}
                         >
                              <InfoCard
                                   title="Tag ID"
                                   value={tagData.id ? Buffer.from(tagData.id).toString('hex').toUpperCase() : 'N/A'}
                                   icon="fingerprint"
                                   color={colors.purple}
                              />

                              <InfoCard
                                   title="Technology"
                                   value={tagData.techTypes?.join(', ') || 'Unknown'}
                                   icon="memory"
                                   color={colors.cyan}
                              />

                              <InfoCard
                                   title="Capacity"
                                   value={`${tagData.maxSize || 0} bytes`}
                                   icon="sd-storage"
                                   color={colors.green}
                              />

                              {tagData.ndefMessage && (
                                   <InfoCard
                                        title="NDEF Message"
                                        value={parseNdefMessage(tagData.ndefMessage)}
                                        icon="message"
                                        color={colors.yellow}
                                   />
                              )}
                         </Animated.View>
                    )}
               </ScrollView>
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: colors.darkestBg,
     },
     scrollContent: {
          padding: 16,
          paddingTop: 8,
     },
     dataContainer: {
          marginTop: 24,
     },
     infoCard: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.normalBg,
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     iconContainer: {
          padding: 12,
          borderRadius: 12,
          marginRight: 16,
     },
     infoContent: {
          flex: 1,
     },
     infoTitle: {
          fontSize: 14,
          color: colors.textSecondary,
          marginBottom: 4,
     },
     infoValue: {
          fontSize: 16,
          color: colors.textPrimary,
          fontWeight: '500',
     },
});