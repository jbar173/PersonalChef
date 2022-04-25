import React from 'react';
import { StyleSheet, Text, View, Button, Pressable, Linking, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { RefineResults } from './RefineResults.js';
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
          "searchMethod:": '',
        },
        both: false,

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
        noMoreUrls: false,

        recipeResponseList: [],
        thisRoundResponseList: [],
        nextRound: false,

        refinedRecipeList: [],
        redirect: false,
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)

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
      thirtyTimerStarted: true,    // Starts another 30 second timer to ensure 60 seconds between API hits
      displayAnimation: true
    })
  }


  componentDidUpdate(){
    console.log("results did update")

    // Triggers function that takes each recipe's url from this.state.firstResponse:
    if(this.state.populateLinksList){
        console.log("1")
        this.getRecipeApiLinks()
    }
    // Triggers function that calls each api url:
    if(this.state.callIndividual && this.state.thirtyTimerStarted === false){
        console.log("2")
        this.fetchIndividualRecipes()
        this.setState({
          callIndividual: false
        })
    }
    // Prevents more than 10 API hits/minute, triggers animation:
    if(this.state.nextRound && this.state.sixtyTimerStarted && this.state.displayAnimation === false){
       console.log("3")
       this.setState({ displayAnimation: true })
    }
    // Prevents more than 10 API hits/minute (if attempted whilst animation is already running):
    if(this.state.nextRound && this.state.sixtyTimerStarted && this.state.displayAnimation){
       console.log("4")
       console.log("waiting...")
    }
    // Triggers next round of API calls once timer has finished, turns animation off:
    if(this.state.nextRound && this.state.sixtyTimerStarted === false){
      console.log("5")
      this.getNextRound()
      this.setState({ displayAnimation: false })
    }
    // Redirects to < ConfirmList /> to reduce keywords if no suitable recipes have been returned:
    if(this.state.noMoreUrls){
      console.log("No more recipe urls - returning to first api search")
      this.setState({
        noMoreUrls: false,
        redirect: true
      })
    }
  }

  componentWillUnmount(){
    console.log("results page unmounted")
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
    console.log("first_index: " + first_index)
    var last_index = round+9
    console.log("last_index: " + last_index)
    var this_round = url_list.slice(first_index,last_index)
    console.log("this_round.length: " + this_round.length)

    if(this_round.length == 0){
      this.setState({
        noMoreUrls: true  // Stops the function when end of url_list has been reached
      })
      return 0;

    }else{
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
       sixtyTimerStarted: true,
       round: last_index + 1,       // Updates starting index of the next set of urls to call
     })
     this.startSixtyStopwatch() // Starts timer to regulate rate of API hits
   }
 }

// 30 second stopwatch (used when app initially loads):
 startThirtyStopwatch(){
   console.log("starting 30 sec stopwatch")
   var cmponent = this
   setTimeout(function(){
     console.log("30 sec stopwatch finished")
     cmponent.setState({
       thirtyTimerStarted: false,
       displayAnimation: false
     })
   }, 30000)
 }

// 60 second stopwatch (used between calling each round of 9 recipes):
 startSixtyStopwatch(){
   console.log("starting 60 sec stopwatch")
   var cmponent = this
   setTimeout(function(){
     console.log("60 sec stopwatch finished")
     cmponent.setState({
       sixtyTimerStarted: false,
       startRefine: true             // Triggers <RefineResults />
     })
   }, 60000)
 }

// Triggers next round of recipe api calls:
 getNextRound(){
   console.log("get next round function")
   this.setState({
     thisRoundResponseList: [],
     callIndividual: true,
     nextRound: false
   })
 }

// Takes in recipes that have been returned from < RefineResults />.
//  If 0 are returned, triggers nextRound, else sets filtered to True
//  thus displaying the results:
  getFilteredRecipes(response_list){
    console.log("filtered initial")
    console.log("filtered_results.length: " + response_list.length)
    if(response_list.length === 0){
      console.log("No results in this round")
      this.setState({
        nextRound: true,
        startRefine: false,
        callIndividual: false,
        filtered: false,
      })
    }else{
      this.setState({
        refinedRecipeList: response_list,
        startRefine: false,
        callIndividual: false,
        filtered: true
      })
    }
  }


  render(){
    var initial = this.state.initialData
    var first_response = this.state.firstResponse
    var refined = this.state.refinedRecipeList
    var filtered = this.state.filtered
    var start_refine = this.state.startRefine
    var display_animation = this.state.displayAnimation
    var ingreds = this.state.ingredients_rough
    var either = 'from RecipeResults'


    return(

      <SafeAreaView style={styles.container}>
        <ScrollView>

            { filtered === false ?

                (
                  <View style={styles.loadingContainer}>

                        {start_refine === true && <RefineResults
                            filteredResults={this.getFilteredRecipes}
                            thisRoundResponseList={this.state.thisRoundResponseList}
                            maxTime={this.state.initialData.time}
                            maxIngredients={this.state.initialData.ingredientCount}
                            userIngredients={this.state.initialData.ingredients}/>
                        }

                        <View style={styles.loadingContainer}>
                          {display_animation && <LoadingPage />}
                        </View>

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

                        <Pressable style={styles.blueButton}>
                            <Link accessible={true} accessibilityLabel= "Start again"
                                accessibilityHint="Click button to go back to homepage"
                                to="/ranked/" accessibilityRole="button" underlayColor="transparent">
                                    <Text>Ranked Ingredients</Text>
                            </Link>
                        </Pressable>

                        <View style={styles.loadingContainer}>
                          {display_animation && <LoadingPage />}
                        </View>

                   </View>
                 )

              }

            { this.state.redirect && <Redirect to={{ pathname:'/confirm/',
              state:{ initial_data: initial, either: either,
                      ingreds: ingreds, } }} /> }

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
    paddingHorizontal:20,
  },
  loadingContainer: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 150,
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
