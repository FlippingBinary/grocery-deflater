import { StatusBar } from 'expo-status-bar';

import * as React from 'react';

import { StyleSheet, Text, TextInput, View, Image, Pressable } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

export function Button(props) {
  const { onPress, title = 'Save' } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const AccountSignUpScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Account Sign Up Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const DetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Details Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const LoginScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image
          style={[styles.groverLogo, { 
            position: 'relative',
            top: 45
          }]}
          source={ require('./assets/dsp/assets/images/grover-text-icon-logo.png')}
      />
      <Text style={[styles.headerText, {
          marginTop: 80,
          marginBottom: 40
        }]}>Sign In</Text>
      <TextInput
        style={styles.textInput}
        keyboardType='email-address'
        placeholder="Email"
      />
      <TextInput
        style={styles.textInput}
        keyboardType='default'
        placeholder='Password'
        secureTextEntry={true}
      />
      <Text style={[styles.textLink, {
          marginTop: 20,
          marginBottom: 100
        }]}>
          Forgot password?
      </Text>
      <Button
          title="Sign In"
          onPress={() => navigation.navigate("Home")}
        />
        <Text 
          style={[styles.textLinkStrong, {
            marginTop: 50,
            marginBottom: 20
          }]}
          onPress={() => navigation.navigate("AccountSignUp")}
        >
          Create Account
        </Text>
      <StatusBar style="auto" />
    </View>
  );
};

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{
          headerStyle: {
            backgroundColor: 'white'
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
      }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Details" component={DetailsScreen}/>
        <Stack.Screen name="AccountSignUp" component={AccountSignUpScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#25BEE8',
    width: '75%',
    height: 60,
    borderRadius: 25
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    textTransform: 'uppercase'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  groverLogo: {
    maxWidth: 250,
    maxHeight: 150
  },
  headerText: {
    color: '#25BEE8',
    fontSize: 24,
    textAlign: 'center'
  },
  textInput: {
    margin: 8,
    padding: 10,
    backgroundColor: '#DBE2ED',
    width: '75%',
    height: 60,
    borderRadius: 10
  },
  textLink: {
    color: '#748A9D',
    textAlign: 'center'
  },
  textLinkStrong: {
    fontWeight: 'bold',
    color: '#748A9D',
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});

export default App;
