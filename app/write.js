// app/write.js
import React, { useState, useEffect, useRef } from 'react';
import {
     View,
     Text,
     TextInput,
     TouchableOpacity,
     Animated,
     KeyboardAvoidingView,
     Platform,
     StyleSheet
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { colors } from '../styles/globalStyles';
import { NfcScanIndicator } from '../components/NfcScanIndicator';

export default function WriteNFC() {
     const [text, setText] = useState('');
     const [status, setStatus] = useState(null);
     const [operation, setOperation] = useState(null); // 'write' or 'clear'
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

          return () => {
               NfcManager.cancelTechnologyRequest();
          };
     }, []);

     const handleNfcOperation = async (type) => {
          setOperation(type);
          setStatus(null);

          try {
               await NfcManager.requestTechnology(NfcTech.Ndef);

               if (type === 'clear') {
                    // Write empty NDEF message to clear the tag
                    const emptyBytes = Ndef.encodeMessage([Ndef.textRecord('')]);
                    await NfcManager.ndefHandler.writeNdefMessage(emptyBytes);
                    setStatus({
                         type: 'success',
                         message: 'Successfully cleared the tag!'
                    });
               } else {
                    // Write the text message to the tag
                    const bytes = Ndef.encodeMessage([Ndef.textRecord(text || '')]);
                    await NfcManager.ndefHandler.writeNdefMessage(bytes);
                    setStatus({
                         type: 'success',
                         message: 'Successfully wrote to tag!'
                    });
               }
          } catch (ex) {
               setStatus({
                    type: 'error',
                    message: type === 'clear' ? 'Failed to clear tag.' : 'Failed to write to tag.'
               });
          } finally {
               setOperation(null);
               NfcManager.cancelTechnologyRequest();
          }
     };

     const ActionButton = ({ onPress, icon, title, color, disabled = false }) => (
          <TouchableOpacity
               onPress={onPress}
               disabled={disabled}
               style={[
                    styles.actionButton,
                    { opacity: disabled ? 0.6 : 1 }
               ]}
               activeOpacity={0.8}
          >
               <View style={[styles.actionButtonContent, { backgroundColor: color + '20' }]}>
                    <MaterialIcons name={icon} size={24} color={color} />
                    <Text style={[styles.actionButtonText, { color }]}>{title}</Text>
               </View>
          </TouchableOpacity>
     );

     return (
          <KeyboardAvoidingView
               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
               style={styles.container}
          >
               <View style={styles.content}>
                    <Animated.View
                         style={[
                              styles.mainContent,
                              {
                                   opacity: fadeAnim,
                                   transform: [{ translateY: slideAnim }]
                              }
                         ]}
                    >
                         <View style={styles.inputContainer}>
                              <View style={styles.inputHeader}>
                                   <MaterialIcons name="edit" size={20} color={colors.green} />
                                   <Text style={styles.inputLabel}>Message to Write</Text>
                              </View>
                              <TextInput
                                   style={styles.input}
                                   placeholder="Enter text to write to NFC tag..."
                                   placeholderTextColor="#666"
                                   value={text}
                                   onChangeText={setText}
                                   multiline
                                   numberOfLines={4}
                                   textAlignVertical="top"
                              />
                         </View>

                         <View style={styles.buttonsContainer}>
                              <ActionButton
                                   onPress={() => handleNfcOperation('write')}
                                   icon="nfc"
                                   title="Write Data"
                                   color={colors.green}
                                   disabled={operation !== null}
                              />

                              <ActionButton
                                   onPress={() => handleNfcOperation('clear')}
                                   icon="cleaning-services"
                                   title="Clear Tag"
                                   color={colors.red}
                                   disabled={operation !== null}
                              />
                         </View>

                         {operation && (
                              <View style={styles.scanIndicatorContainer}>
                                   <NfcScanIndicator
                                        isScanning={true}
                                        type={operation === 'clear' ? 'clear' : 'write'}
                                   />
                              </View>
                         )}

                         {status && (
                              <Animated.View
                                   style={[
                                        styles.statusContainer,
                                        status.type === 'success' ? styles.successStatus : styles.errorStatus,
                                   ]}
                              >
                                   <MaterialIcons
                                        name={status.type === 'success' ? 'check-circle' : 'error'}
                                        size={20}
                                        color={status.type === 'success' ? colors.green : colors.red}
                                        style={styles.statusIcon}
                                   />
                                   <Text style={[
                                        styles.statusText,
                                        { color: status.type === 'success' ? colors.green : colors.red }
                                   ]}>
                                        {status.message}
                                   </Text>
                              </Animated.View>
                         )}
                    </Animated.View>
               </View>
          </KeyboardAvoidingView>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: colors.darkestBg,
     },
     content: {
          flex: 1,
          padding: 16,
     },
     mainContent: {
          flex: 1,
     },
     inputContainer: {
          backgroundColor: colors.normalBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     inputHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
     },
     inputLabel: {
          fontSize: 16,
          color: colors.textPrimary,
          marginLeft: 8,
          fontWeight: '500',
     },
     input: {
          color: colors.textPrimary,
          fontSize: 16,
          padding: 12,
          backgroundColor: colors.darkestBg,
          borderRadius: 12,
          minHeight: 120,
     },
     buttonsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 24,
     },
     actionButton: {
          flex: 1,
          marginHorizontal: 6,
     },
     actionButtonContent: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          borderRadius: 12,
     },
     actionButtonText: {
          fontSize: 16,
          fontWeight: '600',
          marginLeft: 8,
     },
     scanIndicatorContainer: {
          marginTop: 16,
     },
     statusContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          borderRadius: 12,
          marginTop: 16,
     },
     successStatus: {
          backgroundColor: `${colors.green}20`,
     },
     errorStatus: {
          backgroundColor: `${colors.red}20`,
     },
     statusIcon: {
          marginRight: 8,
     },
     statusText: {
          fontSize: 16,
          fontWeight: '500',
     },
});