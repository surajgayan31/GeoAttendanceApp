import { View, StyleSheet, Text, Image } from 'react-native';
import Headers from '../../../component/header/Header';
import CustomButton from '../../../component/customButton/CustomButton';
import navigationService from '../../../routes/navigationService';
import { routes } from '../../../routes/stacks';

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <Headers title="Dashboard" showBack={false} />
      <Image
                source={require('../../../assets/images/logo/dashboardd.png')}
                style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
              />
      <View style={styles.buttonView}>
        <CustomButton
          text="Start"
          height={45}
          width={'100%'}
          paddingVertical={0}
          onPress={() => {

            navigationService.navigate(routes.Tracking)
          }}
          borderRadius={10}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  buttonView: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default Dashboard;
