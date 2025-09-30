import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalProvider } from './src/context/GlobalContext.js';
import SplashScreen from './src/screens/SplashScreen.js';
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import MainScreen from './src/navigation/MainScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  React.useEffect(() => {
    const checkLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('alreadyLaunched');
        if (value === null) {
          await AsyncStorage.setItem('alreadyLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (e) {
        console.log('Error reading AsyncStorage', e);
        setIsFirstLaunch(false);
      }
    };

    checkLaunch();
  }, []);

  // Tampilkan loading dulu
  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isFirstLaunch && (
            <Stack.Screen
              name="OnboardingScreen"
              component={OnboardingScreen}
            />
          )}
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="MainScreen" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
}

// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { GlobalProvider } from './src/context/GlobalContext.js';
// import SplashScreen from './src/screens/SplashScreen.js';
// import LoginScreen from './src/components/LoginScreen';
// import RegisterScreen from './src/components/RegisterScreen';
// import OnboardingScreen from './src/screens/OnboardingScreen';
// import MainScreen from './src/navigation/MainScreen.js';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <GlobalProvider>
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           {/* sementara selalu tampil */}
//           <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
//           <Stack.Screen name="SplashScreen" component={SplashScreen} />
//           <Stack.Screen name="LoginScreen" component={LoginScreen} />
//           <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
//           <Stack.Screen name="MainScreen" component={MainScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </GlobalProvider>
//   );
// }
