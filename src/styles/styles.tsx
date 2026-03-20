 
import { Dimensions } from 'react-native';
import { responsiveScreenFontSize } from 'react-native-responsive-dimensions';
 
const screenWidth = Dimensions.get('window').width
export const color = {
  // Standard black and white colors
  black: '#000000',
  white: '#FFFFFF',
  primary:'#054a4eff',
  secondary:'#0088FF',
  gray:'#C4C4C4',
  online:'#2EAF55',
  bloodRed:'#E83F40',
  transparent: 'rgba(100, 100, 100, 0.2)',
  buttonColor:'#DB183F',
  textRed:'#DB183F',
  textGray:'#818181',
  liteGray:'#8B8688',
  grayText:'#404040'
};

export const fontFamily = {
  Bold: 'WorkSans-Bold',
  BlackItalic:'WorkSans-BlackItelic',
  Regular: 'WorkSans-Regular',
  BoldItalic: 'WorkSans-BoldItalic',
  ExtraBold: 'WorkSans-ExtraBold',
  SemiBold: 'WorkSans-SemiBold',
  SemiBoldItalic: 'WorkSans-SemiBoldItalic',
  Italic: 'WorkSans-Italic',
  Light: 'WorkSans-Light',
  LightItalic: 'WorkSans-LightItalic',
  Medium: 'WorkSans-Medium',
  MediumItalic: 'WorkSans-MediumItalic',

};

export const fontWeight = {
  Thin: '100',
  UltraLight: '200',
  Light: '300',
  Regular: '400',
  Medium: '500',
  SemiBold: '600',
  Bold: '700',
  Heavy: '800',
  Black: '900',
};

export const fontSize = {
  size_8: responsiveScreenFontSize(1),
  size_10: responsiveScreenFontSize(1.2),
  size_11: responsiveScreenFontSize(1.4),
  size_12: responsiveScreenFontSize(1.5),
  size_13: responsiveScreenFontSize(1.6),
  size_14: responsiveScreenFontSize(1.7),
  size_15: responsiveScreenFontSize(1.8),
  size_16: responsiveScreenFontSize(1.9),
  size_17: responsiveScreenFontSize(2),
  size_18: responsiveScreenFontSize(2.1),
  size_19: responsiveScreenFontSize(2.2),
  size_20: responsiveScreenFontSize(2.3),
  size_22: responsiveScreenFontSize(2.5),
  size_24: responsiveScreenFontSize(2.7),
  size_26: responsiveScreenFontSize(2.9),
  size_28: responsiveScreenFontSize(3.1),
  size_30: responsiveScreenFontSize(3.4),
  size_32: responsiveScreenFontSize(3.6),
  size_34: responsiveScreenFontSize(3.8),
  size_36: responsiveScreenFontSize(4.0),
  size_38: responsiveScreenFontSize(4.2),
  size_40: responsiveScreenFontSize(4.4),
  size_48: responsiveScreenFontSize(4.6),
};

