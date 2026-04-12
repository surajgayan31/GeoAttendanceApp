import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Headers from '../../../component/header/Header';

type AttendanceRecord = {
  id: string;
  time: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  startLatitude?: number;
  startLongitude?: number;
  startToCheckInMeters?: number;
  startToCheckInKm?: string;
  address?: string;
  totalTravelDistance?: number;
};

const STORAGE_KEY = 'attendance';

// 🔥 Apna Google API key daalna
const GOOGLE_API_KEY = 'ADD_YOUR_API_KEY_HERE';

const History = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 📍 Reverse Geocoding
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`,
      );
      const data = await res.json();

      if (data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return 'Address not found';
    } catch (e) {
      return 'Error fetching address';
    }
  };

  // 📦 Load Data + Address attach
  const loadAttendance = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      let parsed = json ? JSON.parse(json) : [];

      const updated = await Promise.all(
        parsed.map(async (item: AttendanceRecord) => {
          if (!item.address && item.latitude && item.longitude) {
            const address = await getAddressFromCoords(
              item.latitude,
              item.longitude,
            );
            return { ...item, address };
          }
          return item;
        }),
      );

      setRecords(updated.reverse());
    } catch (e) {
      console.error('Failed to load attendance', e);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  // 📍 Address display fallback
  const formatAddress = (item: AttendanceRecord) => {
    if (item.address) return item.address;

    if (item.latitude && item.longitude) {
      return `Lat: ${item.latitude.toFixed(5)}, Lon: ${item.longitude.toFixed(
        5,
      )}`;
    }

    return 'No location data';
  };

const renderItem = ({ item, index }) => {
  const date = new Date(item.time); // ✅ define date

  const formattedTime = date
  .toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  .toUpperCase();

  return (
    <View style={styles.card}>
      {/* 🔥 Top Row */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.day}>{date.toDateString()}</Text>

          {/* ✅ AM/PM format */}
          <Text style={styles.time}>{formattedTime}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Present</Text>
        </View>
      </View>

      {/* 🔥 Divider */}
      <View style={styles.divider} />

      {/* 🔥 Distance Section */}
      <View style={styles.row}>
        <Text style={styles.label}>🚶 Travelled</Text>
        <Text style={styles.valueHighlight}>
          {((item.totalTravelDistance || 0) / 1000).toFixed(2)} km
        </Text>
      </View>

      {/* 🔥 Location */}
      <View style={styles.row}>
        <Text style={styles.label}>📍 Location</Text>
        <Text style={styles.value}>
          {formatAddress(item)}
        </Text>
      </View>

      {/* 🔥 Record ID */}
      <Text style={styles.footer}>
        ID: {item.id}
      </Text>
    </View>
  );
};

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Headers title="Attendance History" showBack={false} />

      {records.length === 0 ? (
        <View style={styles.empty}>
          <Text>No attendance records yet.</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={item => item.id || item.time}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  day: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },

  time: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },

  badge: {
    backgroundColor: '#DFFFE2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: '#1BA94C',
    fontWeight: '600',
    fontSize: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },

  row: {
    marginBottom: 8,
  },

  label: {
    fontSize: 12,
    color: '#888',
  },

  value: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },

  valueHighlight: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    marginTop: 2,
  },

  footer: {
    marginTop: 8,
    fontSize: 11,
    color: '#aaa',
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default History;
