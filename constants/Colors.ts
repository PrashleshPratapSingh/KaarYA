// Brand Colors based on the messaging design
export const BrandColors = {
  // Primary Background
  cream: '#F5F3E8',
  lightCream: '#FDFCF7',

  // Accent Colors
  yellow: '#F4D03F',
  brightYellow: '#FFE156',

  // Primary Action
  purple: '#5B5FFF',
  lightPurple: '#7B7EFF',

  // Status Colors
  green: '#2ECC71',
  lightGreen: '#58D68D',

  // Text & Borders
  black: '#000000',
  darkGray: '#2C3E50',
  mediumGray: '#7F8C8D',
  lightGray: '#BDC3C7',

  // Background Variants
  white: '#FFFFFF',
  offWhite: '#ECF0F1',
};

export const MessageColors = {
  // Sender (You) - Yellow theme
  senderBg: BrandColors.yellow,
  senderBorder: BrandColors.black,
  senderText: BrandColors.black,

  // Receiver (Them) - White/Cream theme
  receiverBg: BrandColors.white,
  receiverBorder: BrandColors.black,
  receiverText: BrandColors.black,

  // Timestamps
  timestamp: BrandColors.mediumGray,
};

export const UIColors = {
  primary: BrandColors.purple,
  secondary: BrandColors.yellow,
  success: BrandColors.green,
  background: BrandColors.cream,
  surface: BrandColors.white,
  border: BrandColors.black,
  text: BrandColors.black,
  textSecondary: BrandColors.mediumGray,
};
