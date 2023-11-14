import  { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";

const { Navigator, Screen } = createNativeStackNavigator();

import { Home } from '../Screens/Home';
import { New } from '../Screens/New';
import { Habit } from '../Screens/Habit';

export function AppRoutes(){
return(
    
   <Navigator screenOptions={{headerShown:false}}>
        <Screen 
        name='home'
        component={Home}
        />

        <Screen 
        name='new'
        component={New}
        />
        
        <Screen 
        name='habit'
        component={Habit}
        />
    </Navigator> 
)
    
}