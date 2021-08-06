import React from 'react';
import { StyleSheet, Text, View, Button, Pressable, Linking, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import { RefineResults } from './RefineResults.js';
import { ApiCalls } from './ApiCalls.js';
import { SearchingPage, LoadingPage } from "./Animations.js";


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
        thirtyTimerStarted: false,
        sixtyTimerStarted: false,
        displayAnimation: false,

        startRefine: false,
        filtered: false,

        ingredients_rough: {},
        firstResponse: [],

        populateLinksList: false,
        recipeLinksList: [],
        round: 0,

        recipeResponseList: [],
        thisRoundResponseList: [],
        nextRound: false,

        refinedRecipeList: [],
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)

      this.getRecipeApiLinks = this.getRecipeApiLinks.bind(this)
      this.startThirtyStopwatch = this.startThirtyStopwatch.bind(this)

      this.fetchIndividualRecipes = this.fetchIndividualRecipes.bind(this)
      this.startSixtyStopwatch = this.startSixtyStopwatch.bind(this)
      this.getFilteredRecipes = this.getFilteredRecipes.bind(this)

      this.getNextRound = this.getNextRound.bind(this)
    };


  componentDidMount(){
    console.log("Results mounted")
    var initial_data = this.props.location.state.initial_data
    var either = this.props.location.state.either
    var ingreds = this.props.location.state.ingreds
    var first_response = this.props.location.state.first_response

    this.setState({
      initialData: initial_data,
      ingredients_rough: ingreds,
      both: either,
      firstResponse: first_response,
      populateLinksList: true,
      thirtyTimerStarted: true
    })
  }


  componentDidUpdate(){
    console.log("results did update")

    if(this.state.populateLinksList){
        console.log("1")
        this.getRecipeApiLinks()
    }
    if(this.state.callIndividual && this.state.thirtyTimerStarted === false){
        console.log("2")
        this.fetchIndividualRecipes()
        var next_round = this.state.round
        next_round += 9
        this.setState({
          round: next_round,
          callIndividual: false
        })
     }
    if(this.state.nextRound && this.state.sixtyTimerStarted){
      console.log("3")
      console.log("waiting...")
      // this.setState({ displayAnimation: true }) ?
    }
    if(this.state.nextRound && this.state.sixtyTimerStarted === false){
      console.log("4")
      this.getNextRound()
    }
  }

// Takes each recipe's api call url from firstResponse,
//  stores the links in recipeLinksList:
  getRecipeApiLinks(){
    console.log("populating recipe link list")
    this.startThirtyStopwatch()
    var urls = []
    var resp = this.state.firstResponse
    for(page in resp){
      var hits = resp[page]['hits']
      for(recipe in hits){
         var link = hits[recipe]['_links']['self']['href']
         urls.push(link)
       }
    }
    this.setState({
      recipeLinksList: urls,
      populateLinksList: false,
      callIndividual: true,
    })
    console.log("urls.length: " + urls.length)
  }

// Calls api for each individual recipe, stores responses in responseList:
  fetchIndividualRecipes(){
    console.log("fetching individual")
    var url_list = this.state.recipeLinksList
    var round = this.state.round
    var first_index = round
    var last_index = round+9
    var this_round = url_list.slice(first_index,last_index)
    // console.log("this_round.length: " + this_round.length)

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
      .catch(error => {
        console.log("individual error: " + error)
      })
     }
   this.setState({
     sixtyTimerStarted: true
   })
   this.startSixtyStopwatch()
 }

 startThirtyStopwatch(){
   console.log("starting 30 sec stopwatch")
   var cmponent = this
   setTimeout(function(){
     console.log("30 sec stopwatch finished")
     cmponent.setState({
       thirtyTimerStarted: false,
     })
   }, 30000)
 }

 startSixtyStopwatch(){
   console.log("starting 60 sec stopwatch")

   var cmponent = this
   if(this.state.thisRoundResponseList.length === 9){
       cmponent.setState({
         startRefine: true
       })
   }else{
     setTimeout(function(){
       console.log("starting refine")
       console.log("thisRoundResponseList.length: " + cmponent.state.thisRoundResponseList.length)
       cmponent.setState({
         startRefine: true
       })
     },5000)
   }
   setTimeout(function(){
     console.log("60 sec stopwatch finished")
     cmponent.setState({
       sixtyTimerStarted: false,
     })
   }, 60000)
 }

 getNextRound(){
   console.log("get next round function")
   this.setState({
     thisRoundResponseList: [],
     callIndividual: true,
     nextRound: false
   })
 }

  getFilteredRecipes(response_list){
    console.log("filtered initial")
    console.log("filtered_results.length: " + response_list.length)
    if(response_list.length === 0){
      console.log("No results in this round")
      this.setState({
        startRefine: false,
        callIndividual: false,
        filtered: false,
        nextRound: true,
      })
    }else{
      this.setState({
        refinedRecipeList: response_list,
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
    var display_animation = this.state.displayAnimation

    return(

      <SafeAreaView style={styles.container}>
        <ScrollView>

            { filtered === false ?

                (
                  <View style={styles.container}>

                        <Text>Filtering..</Text>

                        {start_refine === true && <RefineResults
                            filteredResults={this.getFilteredRecipes}
                            thisRoundResponseList={this.state.thisRoundResponseList}
                            maxTime={this.state.initialData.time}
                            maxIngredients={this.state.initialData.ingredientCount}/>
                        }

                        {display_animation && <LoadingPage />}

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

                        {display_animation && <LoadingPage />}

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
