import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeRouter, Route } from "react-router-native";
import { HomePage, TimeAndType, SearchMethod } from './components/start.js';
import { ConfectionaryIngredientsList } from './components/desserts.js';
import { MeatIngredientsList, FishIngredientsList } from './components/other.js';
import { HerbsAndSpicesList, TinnedGoodsList, DryIngredientsList,
          WetIngredientsList, FruitAndVegList, AlcoholList, CheeseList,
          SauceIngredientsList, TheRestList } from './components/in_both.js';
import { ConfirmList } from './components/confirm.js';
import { RecipeResults } from './components/results.js';
import { ApiCalls } from './components/ApiCalls.js';
import { UserPantry } from './components/UserPantry.js';
import { SavedRecipesPage } from './components/SavedRecipes.js';

import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome.js';



class App extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time":'0',
        "ingredients":[],
        "ingredientCount":'0',
        "type":'',
        "searchMethod": ''
      },
      both: false,
      time: {
        hours:'0',
        mins:'0'
      },
      appIsReady: false
    },
    this.cacheFonts = this.cacheFonts.bind(this)
    this.getIcons = this.getIcons.bind(this)

  };

 componentDidMount(){
   console.log("APP.JS DID MOUNT")
   var icons = this.getIcons()
 }

 cacheFonts(fonts){
    return fonts.map(font => Font.loadAsync(font));
 }

// Load any resources or data that you need prior to rendering the app:
 getIcons = async function loadResourcesAndDataAsync(){
   console.log("---------------------Getting icons")
    try {
      SplashScreen.preventAutoHideAsync();

      const fontAssets = this.cacheFonts([FontAwesome.font]);

      await Promise.all([fontAssets]);
    } catch (e) {
      // You might want to provide this error information to an error reporting service
      console.warn(e);
    } finally {
      this.setState({
        appIsReady: true
      });
      SplashScreen.hideAsync();
    }
  };



 render(){
   var ready = this.state.appIsReady

    return (
                   <NativeRouter>
                      {ready &&
                        <View style={styles.container}>
                            <Route exact path = "/" component={HomePage} />
                            <Route exact path = "/saved-recipes/" component={SavedRecipesPage} />
                            <Route exact path = "/type-time/" component={TimeAndType} />
                            <Route exact path = "/search-method/" component={SearchMethod} />
                            <Route exact path = "/pantry/" component={UserPantry} />

                            <Route exact path = "/dessert-confectionary/" component={ConfectionaryIngredientsList} />

                            <Route exact path = "/other-meat/" component={MeatIngredientsList} />
                            <Route exact path = "/other-fish/" component={FishIngredientsList} />

                            <Route exact path = "/both-dry/" component={DryIngredientsList} />
                            <Route exact path = "/both-sauce/" component={SauceIngredientsList} />
                            <Route exact path = "/both-fruit/" component={FruitAndVegList} />
                            <Route exact path = "/both-spices/" component={HerbsAndSpicesList} />
                            <Route exact path = "/both-tinned/" component={TinnedGoodsList} />
                            <Route exact path = "/both-the-rest/" component={TheRestList} />
                            <Route exact path = "/both-cheese/" component={CheeseList} />
                            <Route exact path = "/both-alcohol/" component={AlcoholList} />

                            <Route exact path = "/confirm/" component={ConfirmList} />
                            <Route exact path = "/api-calls/" component={ApiCalls} />
                            <Route exact path = "/results-initial/" component={RecipeResults} />
                        </View>
                      }
                   </NativeRouter>
      );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default App;
