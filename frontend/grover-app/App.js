import { StatusBar } from 'expo-status-bar';

import * as React from 'react';

import { StyleSheet, Text, TextInput, View, Image, Pressable } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SearchBar, Card } from '@rneui/themed';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


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

{/*<Tab.Navigator
    screenOptions={{
      tabBarLabelPosition: "below-icon"
    }}>
        <Tab.Screen 
          name="Details"
          options={{
            tabBarLabel: "Details",
            tabBarAccessibilityLabel: "Details Screen",
            tabBarIcon: ({ color, size }) => (
              <Image
                style={{
                  position: 'relative',
                  //top: -5,
                  //left: 10,
                  maxHeight: 40, 
                  maxWidth: 40 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/menu-bottom-home-icon.png')}
              />
            ),
          }}
          component={DetailsScreen} />
        <Tab.Screen name="Coupons" component={DetailsScreen} />
        <Tab.Screen name="ComparePrices" component={DetailsScreen} />
        <Tab.Screen name="ShoppingList" component={DetailsScreen} />
        <Tab.Screen name="Details" component={DetailsScreen} />
        <View style={styles.container}>
      <Text>Details Screen</Text>
      <StatusBar style="auto" />
        </View>*/}

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
          onPress={() => navigation.navigate("Details")}
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
      <Image
          style={{ 
            position: 'relative',
            //top: 10,
            marginBottom: 15,
            maxWidth: 250,
            maxHeight: 50
          }}
          source={ require('./assets/dsp/assets/images/grover-text-logo.png')}
      />
      {/*<TextInput
        style={styles.textInput}
        keyboardType='default'
        placeholder="Enter a grocery item, such as lettuce."
        returnKeyType='search'
        onChangeText={(text) => setState({text})}
        />*/}
      <SearchBar
        /* BC (11/20/2022): FOR ANTHONY: Use this component to submit the query to the API
         * The API sandbox is located here: https://z9zcba24b7.execute-api.us-east-1.amazonaws.com/
         * The documentation for the Searchbar is here: https://reactnativeelements.com/docs/components/searchbar 
         * TODO: Send query to API, 2) retrieve results, 3) display results} 
        */
          containerStyle={{
            width: '95%',
            marginBottom: 15,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            borderBottomWidth: 0
          }}
          placeholder="Enter a grocery item."
          lightTheme
          round
          //value={this.state.searchValue}
          //onChangeText={(text) => this.searchFunction(text)}
        /* BC (11/20/2022): FOR ANTHONY: Use this event handler to submit the query to the API
         * The API sandbox is located here: https://z9zcba24b7.execute-api.us-east-1.amazonaws.com/
         * The documentation for the Searchbar is here: https://reactnativeelements.com/docs/components/searchbar 
         * The documentation for the onSubmitEditing property is here: https://reactnative.dev/docs/textinput#onsubmitediting 
         * onSubmitEditing={({text}) => send query to API } 
         */
        />
      <Image
          style={{ 
            position: 'relative',
            width: '100%',
            //maxHeight: 150
          }}
          source={ require('./assets/dsp/assets/images/home-screen-map.png')}
      />
      <Card containerStyle={{
        position: 'relative',
        width: '100%',
        borderWidth: 0
      }} wrapperStyle={{
        //width: '80%',
        
      }}>
        <Card.Title style={{
          fontSize: 24,
          color: '#748A9D'
        }}>Featured</Card.Title>
          {/*<Card.Divider/>*/}
          <View style={{
            position:"relative", 
            //alignItems:"center",
            borderRadius: 10,
            backgroundColor: '#dd4040',
            //fontSize: 10,
            maxWidth: '100%',
            maxHeight: 50,
            margin: 2

            }}>
            <Image
                style={{
                  position: 'relative',
                  top: -15,
                  left: 5,
                  maxHeight: 70, 
                  maxWidth: 70 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/home-screen-strawberries.png')}
              />
            <Text style={{ 
              position: 'absolute',
              top: 10,
              right: 20,
              color: '#fff',
              fontSize: 21,
              fontWeight: 'bold' 
            }}>Berries</Text>
          </View>
          <View style={{
            position:"relative", 
            //alignItems:"center",
            borderRadius: 10,
            backgroundColor: '#ffa700',
            //fontSize: 10,
            maxWidth: '100%',
            maxHeight: 50,
            margin: 2

            }}>
            <Image
                style={{
                  position: 'relative',
                  top: -5,
                  left: 5,
                  maxHeight: 55, 
                  maxWidth: 55 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/home-screen-orange.png')}
              />
            <Text style={{ 
              position: 'absolute',
              top: 10,
              right: 20,
              color: '#fff',
              fontSize: 21,
              fontWeight: 'bold' 
            }}>Citrus</Text>
          </View>
          <View style={{
            position:"relative", 
            //alignItems:"center",
            borderRadius: 10,
            backgroundColor: '#ffca18',
            //fontSize: 10,
            maxWidth: '100%',
            maxHeight: 50,
            margin: 2
            }}>
            <Image
                style={{
                  position: 'relative',
                  top: -5,
                  left: 10,
                  maxHeight: 55, 
                  maxWidth: 55 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/home-screen-bananas.png')}
              />
            <Text style={{ 
              position: 'absolute',
              top: 10,
              right: 20,
              color: '#fff',
              fontSize: 21,
              fontWeight: 'bold' 
            }}>Bananas</Text>
          </View>
      </Card>
      <StatusBar style="auto" />
    </View>
  );
};

const RecipesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Recipes Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const ComparePricesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Compare Prices Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const ShoppingListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Shopping List Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const DetailsScreen = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarLabelPosition: "below-icon"
    }}>
        <Tab.Screen 
          name="Home"
          options={{
            tabBarLabel: "Home",
            tabBarAccessibilityLabel: "Home Screen",
            headerShown: false,
            tabBarIcon: () => (
              <Image
                style={{
                  position: 'relative',
                  maxHeight: 20, 
                  maxWidth: 20 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/menu-bottom-home-icon.png')}
              />
            )
          }}
          component={HomeScreen} />
        <Tab.Screen 
          name="Recipes" 
          options={{
            tabBarLabel: "Recipes",
            tabBarAccessibilityLabel: "Recipes Screen",
            headerShown: false,
            tabBarIcon: () => (
              <Image
                style={{
                  position: 'relative',
                  maxHeight: 20, 
                  maxWidth: 20 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/menu-bottom-recipes-icon.png')}
              />
            )
          }}
          component={RecipesScreen} />
        <Tab.Screen 
          name="ComparePrices"
          options={{
            tabBarLabel: "Compare Prices",
            tabBarAccessibilityLabel: "Compare Prices Screen",
            headerShown: false,
            tabBarIcon: () => (
              <Image
                style={{
                  position: 'relative',
                  maxHeight: 32, 
                  maxWidth: 32 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/compare-button.png')}
              />
            )
          }} 
          component={ComparePricesScreen} />
        <Tab.Screen 
          name="ShoppingList" 
          options={{
            tabBarLabel: "Shopping List",
            tabBarAccessibilityLabel: "Shopping List Screen",
            headerShown: false,
            tabBarIcon: () => (
              <Image
                style={{
                  position: 'relative',
                  maxHeight: 20, 
                  maxWidth: 20 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/menu-bottom-shopping-cart-icon.png')}
              />
            )
          }} 
          component={ShoppingListScreen} />
      <Tab.Screen 
        name="Settings"
        options={{
          tabBarLabel: "Settings",
          tabBarAccessibilityLabel: "Settings Screen",
          headerShown: false,
          tabBarIcon: () => (
            <Image
              style={{
                position: 'relative',
                maxHeight: 20, 
                maxWidth: 20 
              }}
              resizeMode="contain"
              source={ require('./assets/dsp/assets/images/menu-bottom-settings-icon.png')}
            />
          )
        }} 
        component={SettingsScreen} />
      </Tab.Navigator>    
  );
};

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
        <Stack.Screen name="Details" component={DetailsScreen}/>
        {/*<Stack.Screen name="AccountSignUp" component={AccountSignUpScreen}/>*/}
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
