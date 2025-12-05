import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Card container styles
  cardContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 12,
  },
  
  // Image background
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: 15,
  },
  
  // Gradient overlay (left to right: light blue to white)
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  
  // Card content (sits on top of image)
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  
  // Size variants for card (width and height for horizontal scroll)
  small: {
    width: 320,
    height: 70,
    marginRight: 10,
  },
  medium: {
    width: 360,
    height: 90,
    marginRight: 12,
  },
  large: {
    width: 400,
    height: 110,
    marginRight: 15,
  },
  
  // Date box styles
  dateBox: {
    backgroundColor: '#76BCC3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  smallDateBox: {
    width: 70,
    height: 50,
    marginRight: 12,
  },
  mediumDateBox: {
    width: 70,
    height: 60,
    marginRight: 15,
  },
  largeDateBox: {
    width: 70,
    height: 70,
    marginRight: 18,
  },
  
  // Date text styles
  dateMonth: {
    color: '#fff',
  },
  smallMonth: {
    fontSize: 9,
  },
  mediumMonth: {
    fontSize: 12,
  },
  largeMonth: {
    fontSize: 11,
  },
  
  dateDay: {
    fontWeight: 'bold',
    color: '#fff',
  },
  smallDay: {
    fontSize: 20,
  },
  mediumDay: {
    fontSize: 24,
    fontWeight: '400',
  },
  largeDay: {
    fontSize: 28,
  },
  
  // Details container
  details: {
    flex: 1,
  },
  
  // Title styles
  title: {
    fontWeight: '600',
    marginBottom: 5,
  },
  smallTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  mediumTitle: {
    fontSize: 16,
  },
  largeTitle: {
    fontSize: 18,
  },
  
  // Info container
  info: {
    flexDirection: 'row',
    gap: 15,
  },
  
  // Info row with icon
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  // Text styles
  text: {
    color: '#666',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
  
  // Arrow styles
  arrow: {
    color: '#666',
  },
  smallArrow: {
    fontSize: 20,
  },
  mediumArrow: {
    fontSize: 24,
  },
  largeArrow: {
    fontSize: 28,
  },
});
