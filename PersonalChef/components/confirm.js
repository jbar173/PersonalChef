import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";

import AsyncStorage from '@react-native-async-storage/async-storage';


class ConfirmList extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      initialData: {
        "time": '0',
        "ingredients": [],
        "ingredientCount": 0,
        "type": '',
      },
      both: false,
      confirmed: false,
      populate: false,
      ingredients_rough: {},
      pantry: [],
      favourites: [],
      getFaves: false,
      updateFaves: false,
      redirect: false,

      // apiCall: false,
      // timerStarted: false,
      // foundResults: true,
      // apiError: false,

      // firstResponse: [],

    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.confirmIngredients = this.confirmIngredients.bind(this)
    this.populateInitialData = this.populateInitialData.bind(this)
    this.getFavourites = this.getFavourites.bind(this)
    // this.startStopwatch = this.startStopwatch.bind(this)
    // this.apiCallFinished = this.apiCallFinished.bind(this)
    // this.ingredientsAlteredHandler = this.ingredientsAlteredHandler.bind(this)

  };

  saveDeviceData = async ( key, data ) => {
      try {
          await AsyncStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.log(`Error saving data for key ${key}`, data);
        throw e;
      }
  };

  getData = async (key) => {
      try {
        const data = await AsyncStorage.getItem(key)
        if(data !== null) {
            var value = JSON.parse(data)
            console.log("value: " + value)
            if(key === '@favourite-ingredients'){
              this.setState({
                favourites: value,
                updateFaves: true
              })
            }
          }
        else{
            this.setState({
              favourites: [],
              updateFaves: true
            })
        }
      } catch(e) {
        console.log("Error reading data for favourites: " + e);
      }
  }


  componentDidMount(){
    console.log("CONFIRM LIST mounted")
    var initial_data = this.props.location.state.initial_data
    var ingreds = this.props.location.state.ingreds
    var either = this.props.location.state.either
    // if(either === 'from RecipeResults'){  // Triggered when navigating backwards from < RecipeResults />
    //   this.setState({
    //     initialData: initial_data,
    //     ingredients_rough: ingreds,
    //     both: either,
    //     // foundResults: false,              // Triggers < AlterKeywords />
    //   })

    // }else{                                // Triggered when coming from < TinnedGoodsList />
      this.setState({
        initialData: initial_data,
        ingredients_rough: ingreds,
        both: either
      })
    // }
  }

  componentDidUpdate(){
    console.log("confirm list updated")
    if(this.state.populate){
      this.populateInitialData()
    }
    if(this.state.getFaves){
      this.getFavourites()
    }
    if(this.state.updateFaves){
      this.updateFavourites()
    }
  }

  componentWillUnmount(){
    console.log("confirm page unmounted")
  }


// Times the app out for 30 seconds in order to spread out
//   api calls (ensures that hits/minute aren't exceeded):
  // startStopwatch(){
  //   console.log("starting stopwatch")
  //   var cmponent = this
  //   setTimeout(function(){
  //     console.log("stopwatch finished")
  //     if(cmponent.state.firstResponse != undefined){
  //         if(cmponent.state.firstResponse[0] === 'empty'){
  //           cmponent.setState({
  //             timerStarted: false,
  //             apiError: true,          // Issue with the api, shows error message.
  //           })
  //         }else if(cmponent.state.firstResponse[0] === 'no results'){
  //             console.log("api call successful, 0 results")
  //             cmponent.setState({
  //               timerStarted: false,
  //               foundResults: false,   // No results returned from <ApiCalls />, triggers <AlterKeywords />
  //             })
  //         }else{
  //             cmponent.setState({
  //               timerStarted: false,
                // redirect: true,       // Response is populated, redirects to <RecipeResults />
  //             })
  //           }
  //     }else{
  //       console.log("error")
  //     }
  //   }, 30000)
  // }

// Triggers when 'confirm' button is clicked (to confirm final ingredients list):
  confirmIngredients(){
    console.log("confirm ingredients clicked")
    this.setState({
      populate: true
    })
  }

// Populates state variables once confirm has been clicked,
//  triggers initial API call and stopwatch:
  populateInitialData(){
    console.log("populating initial data")
    var rough = this.state.ingredients_rough
    var final = []
    for([key,value] of Object.entries(rough)){
      final.push(rough[key])
    }
    final = final.flat()
    this.setState({
      initialData: {
        ...this.state.initialData,
        ingredients: final,
        ingredientCount: final.length
      },
      pantry: final,
      getFaves: true,
      populate: false,
    })
  }

  getFavourites(){
    console.log("updating favourites")
    var favourites_key = '@favourite-ingredients'
    var faves = this.getData(favourites_key)
    this.setState({
       getFaves: false,
     })
  }

  updateFavourites(){
    var faves = this.state.favourites
    for(x in faves){
      console.log("1. FAVES[x]: " + faves[x])
    }
    var list = this.state.pantry
    for(x in list){
      console.log("1. PANTRY[x]: " + list[x])
    }
    var i
    var length = list.length
    for(i=0;i<length;i++){
      if( !(faves.includes(list[i])) ){
        faves.push(list[i])
      }
    }
    for(x in faves){
      console.log("2. FAVES[x]: " + faves[x])
    }
    var saveData = async (key,data) => {
         try {
             await this.saveDeviceData(key,data);
             console.log("SAVED")
         } catch (e) {
           console.log("Error saving to_add: " + e)
         }
     };
     var favourites_key = '@favourite-ingredients'
     var pantry_key = '@pantry-ingredients'
     var favourites_saved = saveData(favourites_key,faves)
     var pantry_saved = saveData(pantry_key,list)

    this.setState({
      updateFaves: false,
      redirect: true
    })

  }


// Takes in the response from < ApiCalls /> component:
  // apiCallFinished(initial){
  //   console.log("api call finished function")
  //   if(initial[0] == 'empty'){
  //     console.log("api error - bad request")
  //     this.setState({
  //       apiCall: false,
  //       apiError: true,
  //     })
  //   }else{
  //     console.log("FINISHED TRIGGER")
  //     this.setState({
  //       apiCall: false,
  //       firstResponse: initial,
  //     })
  //   }
  // }

// Takes new ingredients list in from < AlterKeywords /> component,
//  triggers new API call (with reduced/altered ingredient list):

  // ingredientsAlteredHandler(altered_list){
  //   console.log("ingredients altered handler triggered")
  //   console.log("** confirm.js altered_list.length: " + altered_list.length)
  //   var length = altered_list.length
  //   this.setState({
  //     initialData: {
  //       ...this.state.initialData,
  //       ingredients: altered_list,
  //       ingredientCount: length
  //     },
  //     foundResults: true,
  //     timerStarted: true,
  //     ingredientsWereAltered: true,
  //     apiCall: true
  //   })
  //   this.startStopwatch()
  // }


  render(){
    var initial = this.state.initialData
    var ingredients = this.state.initialData.ingredients
    var either = this.state.both
    var ingreds = this.state.ingredients_rough
    var redirect = this.state.redirect


    return(

      <SafeAreaView style={styles.container}>
        <ScrollView>

              <View>


                    <View style={styles.container}>

                        <Text accessible={true} accessibilityLabel="Confirm your ingredients here, or click go back to edit them."
                          accessibilityRole="text" style={styles.mainTitle}>Confirm pantry ingredients</Text>

                          {Object.entries(ingreds).map(function(item){
                            return(
                                <View key={item} style={{ alignItems:"center", marginBottom:10 }}>
                                  <Text style={{fontSize:20,fontWeight:"bold"}}>{item[0]}:</Text>
                                      {item[1].map(function(ingredient){
                                        return(
                                            <Text accessible={true} accessibilityLabel={ingredient} accessibilityRole="text"
                                              key={ingredient} >{ingredient}</Text>
                                          )
                                        })
                                      }
                                </View>
                               )
                             }
                           )}

                        <Pressable onPress={this.confirmIngredients}>
                          <Text accessible={true} accessibilityLabel="Confirm" accessibilityRole="button"
                           style={styles.blueButton}>Confirm</Text>
                        </Pressable>

                        <Link to={{pathname:"/both-tinned/", state:{ initial_data: initial, either: either, ingreds: ingreds,} }}
                          underlayColor="transparent">
                            <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                              style={styles.blueButton}>Back</Text>
                        </Link>

                        { redirect === true && <Redirect to={{ pathname:'/api-calls/',
                          state:{ initial_data: initial, either: either,
                                  ingreds: ingreds, ingredients: ingredients, } }} /> }

                     </View>


                </View>


        </ScrollView>
      </SafeAreaView>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal:20,
  },
  loadingContainer: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 280,
    paddingVertical: 20,
    paddingRight:20,
    paddingLeft: 30,
  },
  mediTitle: {
    fontSize:24,
    marginBottom:20
  },
  title: {
    fontSize:18,
  },
  mainTitle: {
    fontSize:28,
    marginBottom:20,
    textAlign:"center",
  },
  greenButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
  },
  blueButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
  },
  palerBlueButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'#d4ebf2',
  },
});

export { ConfirmList };
