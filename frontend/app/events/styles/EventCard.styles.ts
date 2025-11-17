import { StyleSheet } from 'react-native';

// Card border radius - adjust here to change all corners
const CARD_BORDER_RADIUS = 10;

export const styles = StyleSheet.create({
  // Base card styles
  card: {
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
  },
  
  // Size variants for card width
  small: {
    width: 200,
    marginRight: 12,
  },
  medium: {
    width: 280,
    marginRight: 15,
  },
  large: {
    width: 320,
    marginRight: 15,
  },
  
  // Image background styles
  imageBackground: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: CARD_BORDER_RADIUS,
  },
  
  // Size variants for card height
  smallHeight: {
    height: 200,
  },
  mediumHeight: {
    height: 280,
  },
  largeHeight: {
    height: 320,
  },
  
  // True gradient overlay (top: transparent -> bottom: dark)
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  // Text overlay container
  textOverlay: {
    padding: 15,
  },
  
  // Title styles (white text on dark gradient)
  title: {
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  smallTitle: {
    fontSize: 16,
  },
  mediumTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  largeTitle: {
    fontSize: 24,
  },
  
  // Details container
  details: {
    gap: 4,
  },
  
  // Detail row with icon
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  // Text styles (white text with slight transparency)
  location: {
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  dateTime: {
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  smallText: {
    fontSize: 11,
  },
  mediumText: {
    fontSize: 12,
    fontWeight: '400',
  },
  largeText: {
    fontSize: 14,
  },
});
