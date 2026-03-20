 
 
import React from 'react';
import { DimensionValue, FlexAlignType, Image, ImageSourcePropType, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './style';
 
 
import InternalLoader from '../loaderView/internalLoader';
import { Utils } from '../../utils/Utils';
import { color, fontFamily, fontSize, fontWeight } from '../../styles/styles';
  

// Define the props interface for the CustomButton component
interface Props {
  text: string;
  height?: DimensionValue
  width?: DimensionValue
  borderRadius?: number;
  buttonColor?: string;
  textSize?: number;
  textColor?: string;
  textFontFamily?: string;
  image?: ImageSourcePropType;
  onPress: () => void;
  marginVertical?: number | any;
  borderColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  marginHorizontal?: number;
  imageHeight?: any;
  imageWidth?: any;
  imageAlignSelf?: FlexAlignType | "auto" | undefined;
  right?: number;
  isLoading?: boolean;
  loaderColor?: string;
  disable?: boolean;
  textRight?: number;
  tintColor?: string;
  backgroundColor?: any,
  paddingLeft?: number,
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase"
}
/**
 * CustomButton is a flexible button component with customizable styles, an optional loader,
 * and an image icon. It supports various props for layout, colors, text styles, and loading state.
 */
const CustomButton: React.FC<Props> = props => {
  const {
    text,
    height,
    width,
    borderRadius,
    buttonColor,
    textSize,
    textColor,
    textFontFamily,
    image,
    marginVertical,
    onPress,
    borderColor,
    paddingHorizontal,
    paddingVertical,
    marginHorizontal,
    imageHeight,
    imageWidth,
    imageAlignSelf,
    right,
    isLoading,
    loaderColor,
    disable,
    textRight,
    tintColor,
    textTransform,
    backgroundColor,
    paddingLeft,
  } = props;

  return (

    <Pressable
      // Handle button press only if not loading or disabled
      onPress={() => !isLoading && !disable && onPress()}
      style={{
        marginTop: marginVertical ?? Utils.calculateHeight(10),
        width: width ?? '100%',
        elevation:10,
      }}

    >
      <View
        // Main button container styling
        style={[
          styles.buttonView,
          {
            height: height ?? Utils.calculateHeight(50), // Set height or use default
            borderRadius: borderRadius ?? Utils.calculateWidth(10), // Set border radius or use default
            backgroundColor: disable ? (backgroundColor ?? color.gray) : (backgroundColor ?? color.primary), // disabled uses gray by default
            marginHorizontal: marginHorizontal,
            borderWidth: 0,
            opacity: disable ? 0.7 : 1,
          },
        ]}>
        {!isLoading ? (
          <>
            {image && (
              // Optional image section
              <View
                style={{
                  flex: text ? 0.8 : 3, // Adjust flex based on text presence
                  alignItems: text ? 'center' : 'flex-start', // Align image with optional padding
                  paddingRight: imageAlignSelf ? 10 : 0,
                  paddingLeft: paddingLeft ? 10 : 0,
                }}>
                <Image
                  source={image}
                  resizeMode="contain"

                  style={{
                    height: imageHeight ?? Utils.calculateHeight(20), // Set image height or use default
                    width: imageWidth ?? Utils.calculateWidth(18), // Set image width or use default
                    alignSelf: imageAlignSelf,
                    right: right,
                    tintColor: tintColor


                  }}
                />
              </View>
            )}
            <View
              // Text container
              style={{
                flex: image ? 4 : 0, // Adjust flex based on image presence
                alignItems: 'center', // Center-align the text
              }}>
              <Text
                style={{
                  fontSize: textSize ?? fontSize.size_18, // Set text size or use default
                    color: disable ? color.textGray : textColor ?? color.white, // Set text color, consider disabled state
                  fontFamily: textFontFamily ?? fontFamily.Bold, // Set font family or use default
                  paddingHorizontal: paddingHorizontal ?? 0,
                  paddingVertical: paddingVertical ?? 0,
                  right: textRight,
                  letterSpacing: 2,
                  textTransform: textTransform ?? 'uppercase', // Text transformation option
                  textAlign: 'center',
                  fontWeight: fontWeight.Bold
                }}>
                {text}
              </Text>
            </View>

          </>
        ) : (
          // Show loader when isLoading is true
          <InternalLoader colors={loaderColor ?? color?.white} />
        )}
      </View>
    </Pressable>
  );
};

/**
 * Memoization function to avoid unnecessary re-renders by comparing previous and next props.
 * Only re-renders if 'text' or 'onPress' props change.
 */
const itemPropsAreEqual = (prevProps: any, nextProps: any) => {
  return (
    prevProps.text == nextProps.text &&
    prevProps.onPress == nextProps.onPress &&
    prevProps.disable == nextProps.disable &&
    prevProps.isLoading == nextProps.isLoading
  );
};
// Exporting CustomButton with React.memo to enhance performance by preventing re-renders
export default React.memo(CustomButton, itemPropsAreEqual);
