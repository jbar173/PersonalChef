import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import { HomePage, TimeAndType } from './components/start.js';
import { ConfectionaryIngredientsList } from './components/desserts.js';
import { MeatIngredientsList, FishIngredientsList } from './components/other.js';
import { HerbsAndSpicesList, TinnedGoodsList, DryIngredientsList,
          WetIngredientsList, FruitAndVegList, AlcoholList, CheeseList, } from './components/in_both.js';
import { ConfirmList } from './components/confirm.js';
import { RecipeResults } from './components/results.js';
import { ApiCalls } from './components/ApiCalls.js';
import { UserPantry } from './components/UserPantry.js';
import { SavedRecipesPage } from './components/SavedRecipes.js';


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
      },
      both: false,
      time: {
        hours:'0',
        mins:'0'
      },
      // Raw results based on time, ingredients and ingredient count:
      initialRecipeList: [],
      // Final list, filtered by type:
      refinedRecipeList:[]
    }
  };


 render(){

    return (
       <NativeRouter>
            <View style={styles.container}>
                <Route exact path = "/" component={HomePage} />
                <Route exact path = "/saved-recipes/" component={SavedRecipesPage} />
                <Route exact path = "/type-time/" component={TimeAndType} />
                <Route exact path = "/pantry/" component={UserPantry} />

                <Route exact path = "/dessert-confectionary/" component={ConfectionaryIngredientsList} />

                <Route exact path = "/other-meat/" component={MeatIngredientsList} />
                <Route exact path = "/other-fish/" component={FishIngredientsList} />

                <Route exact path = "/both-dry/" component={DryIngredientsList} />
                <Route exact path = "/both-wet/" component={WetIngredientsList} />
                <Route exact path = "/both-fruit/" component={FruitAndVegList} />
                <Route exact path = "/both-spices/" component={HerbsAndSpicesList} />
                <Route exact path = "/both-tinned/" component={TinnedGoodsList} />
                <Route exact path = "/both-cheese/" component={CheeseList} />
                <Route exact path = "/both-alcohol/" component={AlcoholList} />

                <Route exact path = "/confirm/" component={ConfirmList} />
                <Route exact path = "/api-calls/" component={ApiCalls} />
                <Route exact path = "/results-initial/" component={RecipeResults} />
            </View>
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
