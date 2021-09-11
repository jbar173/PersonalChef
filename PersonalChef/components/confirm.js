import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { SearchingPage } from "./Animations.js";
import { ApiCalls } from './ApiCalls.js';
import { AlterKeywords } from './AlterKeywords.js';
import { RefineResults } from './RefineResults.js';



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

      apiCall: false,
      timerStarted: false,
      foundResults: true,
      apiError: false,

      firstResponse: [],
      redirect: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.confirmIngredients = this.confirmIngredients.bind(this)
    this.populateInitialData = this.populateInitialData.bind(this)
    this.startStopwatch = this.startStopwatch.bind(this)
    this.apiCallFinished = this.apiCallFinished.bind(this)
    this.ingredientsAlteredHandler = this.ingredientsAlteredHandler.bind(this)
  };


  componentDidMount(){
    console.log("CONFIRM LIST mounted")
    var initial_data = this.props.location.state.initial_data
    var ingreds = this.props.location.state.ingreds
    var either = this.props.location.state.either
    if(either === 'from RecipeResults'){  // Triggered when navigating backwards from < RecipeResults />
      this.setState({
        initialData: initial_data,
        ingredients_rough: ingreds,
        both: either,
        foundResults: false,              // Triggers < AlterKeywords />
      })

    }else{                                // Triggered when coming from < TinnedGoodsList />
      this.setState({
        initialData: initial_data,
        ingredients_rough: ingreds,
        both: either
      })
    }
  }

  componentDidUpdate(){
    console.log("confirm list updated")
    if(this.state.populate){
      this.populateInitialData()
    }
  }

  componentWillUnmount(){
    console.log("confirm page unmounted")
  }

// Times the app out for 30 seconds in order to spread out
//   api calls (ensures that hits/minute aren't exceeded):
  startStopwatch(){
    console.log("starting stopwatch")
    var cmponent = this
    setTimeout(function(){
      console.log("stopwatch finished")
      if(cmponent.state.firstResponse != undefined){
          if(cmponent.state.firstResponse[0] === 'empty'){
            cmponent.setState({
              timerStarted: false,
              apiError: true,          // Issue with the api, shows error message.
            })
          }else if(cmponent.state.firstResponse[0] === 'no results'){
              console.log("api call successful, 0 results")
              cmponent.setState({
                timerStarted: false,
                foundResults: false,   // No results returned from <ApiCalls />, triggers <AlterKeywords />
              })
          }else{
              cmponent.setState({
                timerStarted: false,
                redirect: true,       // Response is populated, redirects to <RecipeResults />
              })
            }
      }else{
        console.log("error")
      }
    }, 30000)
  }

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
      apiCall: true,
      populate: false,
      timerStarted: true
    })
    this.startStopwatch()
  }

// Takes in the response from < ApiCalls /> component:
  apiCallFinished(initial){
    console.log("api call finished function")
    if(initial[0] == 'empty'){
      console.log("api error - bad request")
      this.setState({
        apiCall: false,
        apiError: true,
      })
    }else{
      console.log("FINISHED TRIGGER")
      this.setState({
        apiCall: false,
        firstResponse: initial,
      })
    }
  }

// Takes new ingredients list in from < AlterKeywords /> component,
//  triggers new API call (with reduced/altered ingredient list):
  ingredientsAlteredHandler(altered_list){
    console.log("ingredients altered handler triggered")
    console.log("** confirm.js altered_list.length: " + altered_list.length)
    var length = altered_list.length
    this.setState({
      initialData: {
        ...this.state.initialData,
        ingredients: altered_list,
        ingredientCount: length
      },
      foundResults: true,
      timerStarted: true,
      ingredientsWereAltered: true,
      apiCall: true
    })
    this.startStopwatch()
  }


  render(){
    var initial = this.state.initialData
    var either = this.state.both
    var ingreds = this.state.ingredients_rough
    var response = this.state.firstResponse

    var call_api = this.state.apiCall
    var timer_started = this.state.timerStarted
    var redirect = this.state.redirect
    var alter_ingredients = false
    var api_error = this.state.apiError

    if(this.state.foundResults === false){        // Triggers < AlterKeywords />
      console.log("Count is 0, alter keywords")
      alter_ingredients = true
    }

    return(

      <SafeAreaView style={styles.container}>
        <ScrollView>

            { alter_ingredients && < AlterKeywords
              ingredients = {this.state.initialData.ingredients}
              alteredIngredients = {this.ingredientsAlteredHandler}
              /> }


            { api_error === false &&

                <View>

                      { timer_started === true ?

                          (
                                <View style={styles.loadingContainer}>

                                    <View style={{justifyContent:"center"}}>
                                      <SearchingPage />
                                    </View>

                                    { call_api === true && <ApiCalls
                                      time = {this.state.initialData.time}
                                      ingredientCount = {this.state.initialData.ingredientCount}
                                      keywords={this.state.initialData.ingredients}
                                      passDataBack = {this.apiCallFinished} /> }

                                </View>
                          )

                          :

                          (

                                <View style={styles.container}>

                                    <Text accessible={true} accessibilityLabel="Confirm your ingredients here, or click go back to edit them."
                                      accessibilityRole="text" style={styles.mainTitle}>Confirm ingredients</Text>

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

                                    <Link to={{pathname:"/both-tinned/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                                     underlayColor="transparent">
                                        <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                          style={styles.blueButton}>Back</Text>
                                    </Link>

                                    { redirect === true && <Redirect to={{ pathname:'/results-initial/',
                                      state:{ initial_data: initial, either: either,
                                              ingreds: ingreds, first_response: response } }} /> }

                                 </View>

                            )

                        }

                  </View>
                }

            { api_error &&
                <View>
                      <Text>Sorry, there was an error!</Text>
                      <Pressable style={styles.blueButton}>
                           <Link accessible={true} accessibilityLabel= "An error occurred"
                             accessibilityHint="Click button to report the error and try again"
                             to="/" accessibilityRole="button" underlayColor="transparent">
                               <Text>Report and try again</Text>
                           </Link>
                      </Pressable>
                </View>
             }


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
    marginBottom:20
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
