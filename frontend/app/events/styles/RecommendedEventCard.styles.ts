import { StyleSheet } from 'react-native';

// Card border radius - adjust here to change image corners
const IMAGE_BORDER_RADIUS = 10;

export const styles = StyleSheet.create({
  // Base card styles
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Size variants for card
  small: {
    marginBottom: 10,
  },
  medium: {
    marginBottom: 10,
  },
  large: {
    marginBottom: 15,
  },
  
  // Image styles
  image: {
    borderRadius: IMAGE_BORDER_RADIUS,
    overflow: 'hidden',
    marginRight: 15,
  },
  imageStyle: {
    borderRadius: IMAGE_BORDER_RADIUS,
  },
  smallImage: {
    width: 133,
    height: 75,
    marginRight: 12,
  },
  mediumImage: {
    width: 160,
    height: 90,
    marginRight: 15,
  },
  largeImage: {
    width: 187,
    height: 105,
    marginRight: 18,
  },
  
  // Details container
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Detail row with icon
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  // Title styles
  title: {
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  smallTitle: {
    fontSize: 14,
    marginBottom: 3,
  },
  mediumTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  largeTitle: {
    fontSize: 18,
  },
  
  // Text styles
  dateTime: {
    color: '#666',
    marginBottom: 2,
  },
  location: {
    color: '#666',
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

