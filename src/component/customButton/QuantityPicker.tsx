import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { color, fontSize } from '../../styles/styles';
 
 

type Props = {
  value?: number; // controlled value
  defaultValue?: number; // uncontrolled initial value
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  size?: number; // button size approx
  style?: object;
};

const QuantityPicker: React.FC<Props> = ({
  value,
  defaultValue = 1,
  min = 1,
  max = 999,
  step = 1,
  onChange,
  disabled = false,
  size = 36,
  style,
}) => {
  const [internal, setInternal] = useState<number>(defaultValue);

  // If controlled, reflect external value
  useEffect(() => {
    if (typeof value === 'number') setInternal(value);
  }, [value]);

  const change = useCallback(
    (next: number) => {
      const clamped = Math.max(min, Math.min(max, next));
      if (typeof value !== 'number') setInternal(clamped);
      onChange && onChange(clamped);
    },
    [min, max, onChange, value],
  );

  const onDecrement = () => {
    if (disabled) return;
    change(internal - step);
  };

  const onIncrement = () => {
    if (disabled) return;
    change(internal + step);
  };

  const isDecrementDisabled = disabled || internal <= min;
  const isIncrementDisabled = disabled || internal >= max;

  return (
    <View style={[styles.container, style]}>
    <Pressable
      accessibilityLabel="decrement"
      onPress={onDecrement}
      style={({ pressed }) => [
        styles.button,
        {
        width: size,
        height: size,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        },
        isDecrementDisabled && styles.disabled,
        pressed && !isDecrementDisabled && styles.pressed,
      ]}
    >
      <Image
        source={require('../../assets/images/icon/minus.png')}
        style={{
          width: Math.round(size * 0.5),
          height: Math.round(size * 0.5),
          tintColor: isDecrementDisabled ? '#bbb' : '#fff',
          resizeMode: 'contain',
        }}
      />
    </Pressable>

      <View style={[styles.valueWrap, { minWidth: size * 1.2, height: size }]}>
        <Text style={[styles.valueText, { fontSize: Math.round(size * 0.45) }]}>{internal}</Text>
      </View>

      <Pressable
        accessibilityLabel="increment"
        onPress={onIncrement}
        style={({ pressed }) => [
          styles.button,
          {
            width: size,
            height: size,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          },
          isIncrementDisabled && styles.disabled,
          pressed && !isIncrementDisabled && styles.pressed,
        ]}
      >
        <Image
          source={require('../../assets/images/icon/plus.png')}
          style={{
            width: Math.round(size * 0.5),
            height: Math.round(size * 0.5),
            tintColor: isIncrementDisabled ? '#bbb' : '#fff',
            resizeMode: 'contain',
          }}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start', // prevent stretching to full width
      // backgroundColor: '#fff',
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#eee',
    },
    button: {
        backgroundColor: color.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressed: {
        opacity: 0.8,
    },
    disabled: {
        backgroundColor: '#f0f0f0',
    },
    sign: {
        color: '#fff',
        fontSize: fontSize.size_22,
        fontWeight: '700',
    },
    signDisabled: {
        color: '#bbb',
    },
    valueWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    valueText: {
        fontSize: fontSize.size_16,
        fontWeight: '700',
        color: color.grayText || '#222',
    },
});

export default QuantityPicker;
