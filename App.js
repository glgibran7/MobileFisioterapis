import * as React from 'react';
import { View, Dimensions } from 'react-native';
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
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

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
          {/* Tambahkan screen lain seperti Main, Paket, HomeMentor sesuai kebutuhan */}
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
