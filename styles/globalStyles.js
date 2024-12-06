// styles/globalStyles.js
import { StyleSheet } from 'react-native';

// Brand Colors
const colors = {
     // Backgrounds
     darkestBg: '#121315',
     normalBg: '#1B1C1F',

     // Text colors
     textPrimary: '#FFFFFF',
     textSecondary: 'rgba(255, 255, 255, 0.7)',
     textMuted: 'rgba(255, 255, 255, 0.5)',

     // Brand accent colors
     red: '#FF8D7D',
     purple: '#B17DFF',
     cyan: '#7DF3FF',
     green: '#7DFFA4',
     yellow: '#FFF97D',
};

export const globalStyles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: colors.darkestBg,
          padding: 20,
     },

     // Cards and Containers
     card: {
          backgroundColor: colors.normalBg,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
     },

     // Buttons
     button: {
          backgroundColor: colors.normalBg,
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.cyan,
          shadowOffset: {
               width: 0,
               height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
     },
     buttonPrimary: {
          backgroundColor: colors.purple,
     },
     buttonSuccess: {
          backgroundColor: colors.green,
     },
     buttonDanger: {
          backgroundColor: colors.red,
     },
     buttonText: {
          color: colors.textPrimary,
          fontSize: 16,
          fontWeight: '600',
          marginLeft: 8,
     },

     // Text Input
     input: {
          backgroundColor: colors.normalBg,
          borderRadius: 12,
          padding: 16,
          color: colors.textPrimary,
          fontSize: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },

     // Typography
     title: {
          fontSize: 28,
          fontWeight: 'bold',
          color: colors.textPrimary,
          marginBottom: 8,
     },
     subtitle: {
          fontSize: 18,
          color: colors.textSecondary,
          marginBottom: 24,
     },
     text: {
          fontSize: 16,
          color: colors.textPrimary,
     },
     textMuted: {
          fontSize: 14,
          color: colors.textMuted,
     },

     // Status Messages
     status: {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          marginTop: 16,
     },
     statusSuccess: {
          backgroundColor: `${colors.green}20`,
     },
     statusError: {
          backgroundColor: `${colors.red}20`,
     },
     statusText: {
          textAlign: 'center',
          fontSize: 16,
     },
     statusTextSuccess: {
          color: colors.green,
     },
     statusTextError: {
          color: colors.red,
     },

     // Lists and Data Display
     listItem: {
          backgroundColor: colors.normalBg,
          borderRadius: 12,
          padding: 16,
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
     },
     listItemText: {
          flex: 1,
          color: colors.textPrimary,
     },

     // Icons and Badges
     iconContainer: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.darkestBg,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
     },
     badge: {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
          backgroundColor: colors.purple,
     },
     badgeText: {
          color: colors.textPrimary,
          fontSize: 12,
          fontWeight: '600',
     },

     // Animations
     pulseContainer: {
          padding: 24,
          borderRadius: 32,
          backgroundColor: colors.normalBg,
          alignItems: 'center',
          justifyContent: 'center',
     },

     // Dividers
     divider: {
          height: 1,
          backgroundColor: colors.normalBg,
          marginVertical: 16,
     },
});

// Export colors for use in other components
export { colors };