import React from 'react';
import { StyleSheet, Text, View, Button, Pressable, Linking, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import { RefineResults } from './RefineResults.js';
import { ApiCalls } from './ApiCalls.js';
import { Searching } from "./SearchingAnimation.js";


class RecipeResults extends React.Component {
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

        checked: false,
        callIndividual: false,
        timerStarted: false,

        startRefine: false,
        filtered: false,

        ingredients_rough: {},
        firstResponse: [],

        populateLinksList: false,
        recipeLinksList: [],
        round: 0,

        thisRoundResponseList: [],
        recipeResponseList: [],

        refinedRecipeList: [],
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.getRecipeApiLinks = this.getRecipeApiLinks.bind(this)
      this.fetchIndividualRecipes = this.fetchIndividualRecipes.bind(this)
      this.getFilteredRecipes = this.getFilteredRecipes.bind(this)
      this.startStopwatch = this.startStopwatch.bind(this)
      this.getNextRound = this.getNextRound.bind(this)
    };


  componentDidMount(){
    console.log("Results mounted")
    var initial_data = this.props.location.state.initial_data
    var either = this.props.location.state.either
    var ingreds = this.props.location.state.ingreds
    var first_response = this.props.state.first_response
    this.setState({
      initialData: initial_data,
      ingredients_rough: ingreds,
      both: either,
      firstResponse: first_response,
      populateLinksList: true
    })
  }


  componentDidUpdate(){
    console.log("results did update")

    if(this.state.populateLinkList){
        this.getRecipeApiLinks()
    }
    if(this.state.callIndividual){
        this.fetchIndividualRecipes()
        var next_round = this.state.round
        next_round += 9
        this.setState({
          round: next_round,
          callIndividual: false
        })
     }
  }

// Takes each recipe's api call url from firstResponse,
//  stores the links in recipeLinksList:
  getRecipeApiLinks(){
    console.log("populating recipe link list")
    var urls = []
    for(page in this.state.firstResponse){
      for(recipe in page['hits']){
         var link = recipe['_links']['self']['href']
         urls.push(link)
       }
    }
    this.setState({
      recipeLinksList: urls,
      populateLinksList: false,
      callIndividual: true
    })
    console.log("this.state.firstResponse.length: " + this.state.firstResponse.length)
  }


// Calls api for each individual recipe, stores responses in responseList:
  fetchIndividualRecipes(){
    var url_list = this.state.recipeLinksList
    var round = this.state.round
    var first_index = round
    var last_index = round+9
    var this_round = url_list.slice[first_index,last_index]

    for(link in this_round){
      var url = `${this_round[link]}`
      console.log("individual url: " + url + "\n")
      fetch(url)
      .then(response => response.json())
      .then(data =>
          this.setState({
            thisRoundResponseList: [
              ...this.state.thisRoundResponseList,
              data
            ],
            recipeResponseList: [
              ...this.state.recipeResponseList,
              data
            ],
          })
       )
     }
     this.startStopwatch()
  }


 startStopwatch(){
   console.log("starting stopwatch")
   this.setState({
     timerStarted: true,
     startRefine: true
   })
   // After a minute, set timerStarted to false
 }


 getNextRound(){
   if(this.state.timerStarted){
     // wait until timer stops, then call next round
   }else{
     this.setState({
       thisRoundResponseList: [],
       callIndividual: true
     })
   }
 }


  getFilteredRecipes(filtered_results){
    console.log("filtered initial")
    if(filtered_results.length === 0){
      console.log("No results in this round")
      this.setState({
        startRefine: false,
        filtered: false
      })
      this.getNextRound()
    }else{
      this.setState({
        refinedRecipeList: filtered_results,
        callIndividual: false,
        startRefine: false,
        filtered: true
      })
    }
  }


  render(){
    var first_response = this.state.firstResponse
    var refined = this.state.refinedRecipeList
    var filtered = this.state.filtered
    var start_refine = this.state.startRefine

    return(

      <SafeAreaView style={styles.container}>
        <ScrollView>

            { filtered === false ?

                (
                  <View style={styles.container}>

                        <Searching />

                        {start_refine === true && <RefineResults
                            getFilteredRecipes={this.getFilteredRecipes}
                            recipeResponseList={this.state.recipeResponseList}
                            maxTime={this.state.initialData.time}
                            maxIngredients={this.state.initialData.ingredientCount}/>
                        }

                  </View>
                )

                :

                (
                  <View style={styles.container}>
                      <Text accessible={true} accessibilityLabel= "Recipe List" accessibilityRole="text"
                        style={styles.mainTitle}>Your recipes</Text>
                        {refined.map(function(item,index){
                           return(
                                    <View key={index}>

                                        <Text accessible={true} accessibilityRole="text"
                                          accessibilityLabel={item['recipe']['label'].toString()}
                                          style={styles.title}> {index+1}. {item['recipe']['label']}</Text>

                                        <Text accessible={true} accessibilityHint="Total time to make dish" accessibilityRole="text"
                                          accessibilityLabel={item['recipe']['totalTime'].toString()}>
                                            Takes: {item['recipe']['totalTime']} minutes
                                        </Text>

                                        <Pressable onPress={() => Linking.openURL(`${item['recipe']['url']}`)}>
                                          <Text accessible={true} accessibilityLabel="Go to recipe website" accessibilityRole="link"
                                            style={styles.greenButton}>Go to recipe website</Text>
                                        </Pressable>

                                     </View>
                                  )
                             }
                           )
                         }

                        <Pressable onPress={this.getNextRound} style={styles.blueButton}>
                          <Text>Next page</Text>
                        </Pressable>

                        <Pressable style={styles.blueButton}>
                            <Link accessible={true} accessibilityLabel= "Start again"
                                accessibilityHint="Click button to go back to homepage"
                                to="/" accessibilityRole="button"><Text>Start again</Text>
                            </Link>
                        </Pressable>
                   </View>
                 )

              }

            </ScrollView>
          </SafeAreaView>

      );
    }

};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  mediTitle: {
    fontSize:24,
    marginBottom:20
  },
  title: {
    fontSize:18,
    fontWeight:'bold'
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
    textAlign: 'center',
  },
  blueButton: {
    padding: 7,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    marginHorizontal: 80,
  },
});


export { RecipeResults };
