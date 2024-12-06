// app/index.js
import { View, Text, TouchableOpacity, Animated, ScrollView, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';
import DeviceInfo from 'react-native-device-info';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export default function Home() {
     const router = useRouter();
     const fadeAnim = useRef(new Animated.Value(0)).current;
     const slideAnim = useRef(new Animated.Value(30)).current;
     const [deviceInfo, setDeviceInfo] = useState(null);
     const [nfcStatus, setNfcStatus] = useState({
          isSupported: false,
          technologies: [],
     });

     useEffect(() => {
          Animated.parallel([
               Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
               }),
               Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
               }),
          ]).start();

          // Get device information
          const getDeviceInfo = async () => {
               const info = {
                    model: await DeviceInfo.getModel(),
                    systemVersion: DeviceInfo.getSystemVersion(),
                    brand: await DeviceInfo.getBrand(),
                    buildNumber: await DeviceInfo.getBuildNumber(),
                    apiLevel: await DeviceInfo.getApiLevel(),
               };
               setDeviceInfo(info);
          };

          // In the checkNfcCapabilities function, change this part:
          const checkNfcCapabilities = async () => {
               try {
                    const isSupported = await NfcManager.isSupported();
                    if (isSupported) {
                         await NfcManager.start();

                         // For Android, we can check specific technologies
                         if (Platform.OS === 'android') {
                              const techs = [];
                              // These are the common NFC technologies available on Android
                              const techCheckList = [
                                   'NfcA', 'NfcB', 'NfcF', 'NfcV', 'IsoDep', 'MifareClassic',
                                   'MifareUltralight', 'Ndef'
                              ];

                              // Get the tech list that this device supports
                              const supportedTechs = await NfcManager.getLaunchTagEvent();
                              if (supportedTechs) {
                                   techCheckList.forEach(tech => {
                                        if (supportedTechs.includes(tech)) {
                                             techs.push(tech);
                                        }
                                   });
                              }

                              setNfcStatus({
                                   isSupported: true,
                                   technologies: techs,
                              });
                         } else {
                              // For iOS, we can't check specific technologies this way
                              setNfcStatus({
                                   isSupported: true,
                                   technologies: ['NDEF'], // iOS mainly supports NDEF
                              });
                         }
                    } else {
                         setNfcStatus({
                              isSupported: false,
                              technologies: [],
                         });
                    }
               } catch (ex) {
                    console.warn('Error checking NFC capabilities:', ex);
                    setNfcStatus({
                         isSupported: false,
                         technologies: [],
                    });
               }
          };

          if (Platform.OS === 'android') {
               getDeviceInfo();
          }
          checkNfcCapabilities();

          return () => {
               // Cleanup NFC
               NfcManager.stop();
          };
     }, []);

     const Feature = ({ icon, title, subtitle, color, onPress }) => {
          return (
               <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                    <Animated.View style={[styles.featureCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                         <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                              <MaterialIcons name={icon} size={28} color={color} />
                         </View>
                         <View style={styles.featureContent}>
                              <Text style={styles.featureTitle}>{title}</Text>
                              <Text style={styles.featureSubtitle}>{subtitle}</Text>
                         </View>
                         <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
                    </Animated.View>
               </TouchableOpacity>
          );
     };

     const InfoCard = ({ title, items }) => (
          <Animated.View
               style={[
                    styles.infoCard,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
               ]}
          >
               <Text style={styles.infoCardTitle}>{title}</Text>
               {items.map((item, index) => (
                    <View key={index} style={styles.infoRow}>
                         <Text style={styles.infoLabel}>{item.label}</Text>
                         <Text style={styles.infoValue}>{item.value}</Text>
                    </View>
               ))}
          </Animated.View>
     );

     return (
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
               <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.logoContainer}>
                         <MaterialIcons name="lock" size={40} color={colors.purple} />
                    </View>
                    <Text style={styles.title}>NFC Locker</Text>
                    <Text style={styles.subtitle}>Secure Access Management</Text>
               </Animated.View>

               <Text style={styles.sectionTitle}>Quick Actions</Text>

               <Feature
                    icon="nfc"
                    title="Read NFC Tag"
                    subtitle="Scan and verify tag credentials"
                    color={colors.cyan}
                    onPress={() => router.push('/read')}
               />

               <Feature
                    icon="edit"
                    title="Write NFC Tag"
                    subtitle="Program new access credentials"
                    color={colors.green}
                    onPress={() => router.push('/write')}
               />

               {Platform.OS === 'android' && deviceInfo && (
                    <>
                         <Text style={styles.sectionTitle}>Device Information</Text>
                         <InfoCard
                              title="Device Specs"
                              items={[
                                   { label: "Model", value: deviceInfo.model },
                                   { label: "Brand", value: deviceInfo.brand },
                                   { label: "Android Version", value: deviceInfo.systemVersion },
                                   { label: "API Level", value: deviceInfo.apiLevel.toString() },
                              ]}
                         />
                    </>
               )}

               <Text style={styles.sectionTitle}>NFC Capabilities</Text>
               <InfoCard
                    title="NFC Status"
                    items={[
                         {
                              label: "NFC Support",
                              value: nfcStatus.isSupported ? "Available" : "Not Supported"
                         },
                         {
                              label: "Technologies",
                              value: nfcStatus.technologies.length > 0
                                   ? nfcStatus.technologies.join(", ")
                                   : "None detected"
                         },
                    ]}
               />

               <View style={styles.footer}>
                    <View style={styles.statusIndicator}>
                         <View style={[
                              styles.statusDot,
                              { backgroundColor: nfcStatus.isSupported ? colors.green : colors.red }
                         ]} />
                         <Text style={styles.statusText}>
                              {nfcStatus.isSupported ? "NFC Ready" : "NFC Not Available"}
                         </Text>
                    </View>
               </View>
          </ScrollView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: colors.darkestBg,
     },
     contentContainer: {
          padding: 16,
     },
     header: {
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 32,
     },
     logoContainer: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.normalBg,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
     },
     title: {
          fontSize: 28,
          fontWeight: 'bold',
          color: colors.textPrimary,
          marginBottom: 8,
     },
     subtitle: {
          fontSize: 16,
          color: colors.textSecondary,
     },
     sectionTitle: {
          fontSize: 20,
          fontWeight: '600',
          color: colors.textPrimary,
          marginBottom: 16,
          marginTop: 24,
     },
     featureCard: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.normalBg,
          padding: 16,
          borderRadius: 16,
          marginBottom: 12,
     },
     iconContainer: {
          padding: 12,
          borderRadius: 12,
          marginRight: 16,
     },
     featureContent: {
          flex: 1,
     },
     featureTitle: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.textPrimary,
          marginBottom: 4,
     },
     featureSubtitle: {
          fontSize: 14,
          color: colors.textSecondary,
     },
     infoCard: {
          backgroundColor: colors.normalBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
     },
     infoCardTitle: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.textPrimary,
          marginBottom: 12,
     },
     infoRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.1)',
     },
     infoLabel: {
          fontSize: 14,
          color: colors.textSecondary,
     },
     infoValue: {
          fontSize: 14,
          color: colors.textPrimary,
          fontWeight: '500',
     },
     footer: {
          marginTop: 24,
          marginBottom: 16,
          alignItems: 'center',
     },
     statusIndicator: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.normalBg,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 20,
     },
     statusDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          marginRight: 8,
     },
     statusText: {
          fontSize: 14,
          color: colors.textSecondary,
     },
});