// components/NfcScanIndicator.js
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles';

export const NfcScanIndicator = ({ isScanning, type = 'read' }) => {
     const pulseAnim = useRef(new Animated.Value(1)).current;
     const rotateAnim = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          let pulseAnimation;
          let rotateAnimation;

          if (isScanning) {
               // Pulse animation
               pulseAnimation = Animated.loop(
                    Animated.sequence([
                         Animated.timing(pulseAnim, {
                              toValue: 1.2,
                              duration: 1000,
                              useNativeDriver: true,
                         }),
                         Animated.timing(pulseAnim, {
                              toValue: 1,
                              duration: 1000,
                              useNativeDriver: true,
                         }),
                    ])
               );

               // Rotation animation
               rotateAnimation = Animated.loop(
                    Animated.sequence([
                         Animated.timing(rotateAnim, {
                              toValue: 1,
                              duration: 2000,
                              useNativeDriver: true,
                         }),
                         Animated.timing(rotateAnim, {
                              toValue: 0,
                              duration: 0,
                              useNativeDriver: true,
                         }),
                    ])
               );

               pulseAnimation.start();
               rotateAnimation.start();
          }

          return () => {
               if (pulseAnimation) pulseAnimation.stop();
               if (rotateAnimation) rotateAnimation.stop();
          };
     }, [isScanning]);

     const rotate = rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
     });

     const color = type === 'read' ? colors.cyan : colors.green;

     return (
          <View style={styles.container}>
               <Animated.View
                    style={[
                         styles.scanCircle,
                         {
                              transform: [{ scale: pulseAnim }],
                              borderColor: color,
                         }
                    ]}
               >
                    <Animated.View
                         style={[
                              styles.iconContainer,
                              { transform: [{ rotate }] }
                         ]}
                    >
                         <MaterialIcons
                              name="nfc"
                              size={48}
                              color={color}
                         />
                    </Animated.View>
               </Animated.View>
               <Text style={styles.scanText}>
                    {isScanning ? 'Hold device near NFC tag' : 'Tap to Scan'}
               </Text>
               {isScanning && (
                    <View style={styles.tipContainer}>
                         <MaterialIcons name="info-outline" size={16} color={colors.textSecondary} />
                         <Text style={styles.tipText}>
                              Keep the device steady until scanning completes
                         </Text>
                    </View>
               )}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          alignItems: 'center',
          paddingVertical: 32,
     },
     scanCircle: {
          width: 120,
          height: 120,
          borderRadius: 60,
          borderWidth: 2,
          borderStyle: 'dashed',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
          backgroundColor: colors.normalBg,
     },
     iconContainer: {
          padding: 16,
     },
     scanText: {
          fontSize: 18,
          color: colors.textPrimary,
          fontWeight: '500',
          marginBottom: 8,
     },
     tipContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.normalBg,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 20,
          marginTop: 16,
     },
     tipText: {
          fontSize: 14,
          color: colors.textSecondary,
          marginLeft: 8,
     },
});