import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, Linking, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { AlterKeywords } from './AlterKeywords.js';
import { RefineResults } from './RefineResults.js';
import { SearchingPage, LoadingPage } from "./Animations.js";


class ApiCalls extends React.Component{
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
      searchKeywords: [],
      omittedKeywords: [],
      reduceKeywords: false,
      deleteOne: false,
      // apiCall: false,

      foundResults: true,
      apiError: false,
      fResponse: [],
      next: 'first',
      count: null,

      nextCall: false,
      stopwatchRunning: false,
      noMorePages: false,
      call: 0,
      startRefine: false,
      refinedRecipeList: [],
      finalResults: false
    },
    this.abortController = new AbortController()
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.keywordsAlteredHandler = this.keywordsAlteredHandler.bind(this)
    this.triggerNextCall = this.triggerNextCall.bind(this)
    this.apiCall = this.apiCall.bind(this)
    this.startStopwatch = this.startStopwatch.bind(this)
    this.finishedHandler = this.finishedHandler.bind(this)
    this.getRelevantRecipes = this.getRelevantRecipes.bind(this)
    this.deleteAKeyword = this.deleteAKeyword.bind(this)
  };

  componentDidMount(){
    console.log("Api component mounted")
    var initial_data = this.props.location.state.initial_data
    var ingreds = this.props.location.state.ingreds
    var either = this.props.location.state.either
    var ingredients_alone = initial_data.ingredients
    var reduce = false
    var start_calling = false
    if(ingredients_alone.length > 5){
      reduce = true
      start_calling = false
    }else{
      start_calling = true
    }
    this.setState({
      initialData: initial_data,
      searchKeywords: ingredients_alone,
      reduceKeywords: reduce,
      nextCall: start_calling,
      both: either,
    })
  }


  componentWillUnmount(){
    console.log("Api component unmounted")
    this.abortController.abort()
  }

  componentDidUpdate(){
    console.log("API COMPONENT UPDATED")
    // console.log("this.state.count: " + this.state.count)
    if(this.state.count === undefined && this.state.next !== 'first'){
      this.setState({
        apiError: true,
        nextCall: false
      })
    }
    // Checks whether api function has finished calling
    //  each page, triggers next function if so:
    if(this.state.noMorePages) {
      this.finishedHandler()
    }
    if(this.state.nextCall && this.state.stopwatchRunning === false){
      this.triggerNextCall()
    }
    if(this.state.deleteOne){
      this.deleteAKeyword()
    }
  }


  // Takes new keywords list in from < AlterKeywords /> component,
  //  triggers new API call (with reduced keyword list):

   keywordsAlteredHandler(new_keywords){
      console.log("ingredients altered handler triggered")
      var original_ingredients = this.state.initialData.ingredients
      for(x in new_keywords){
        original_ingredients.push(new_keywords[x])
      }
      for(x in new_keywords){
        console.log(x + ". " + new_keywords[x])
        console.log("***")
      }

      this.setState({
        initialData: {
          ...this.state.initialData,
          ingredients: original_ingredients,
        },
        searchKeywords: new_keywords,
        reduceKeywords: false,
        nextCall: true
      })
    }



    triggerNextCall(){
      if(this.state.count === 0){
        this.setState({
          nextCall: false,
          noMorePages: true,
          foundResults: false
        })
      }else{
        this.apiCall()
        this.setState({
          nextCall: false,
          foundResults: true
        })
      }
    }

// Calls first api 10 times (allowance is 10 hits per minute),
//  collects 200 recipe apis (if that many are returned):
  apiCall(){
    console.log("calling APIs")
    var keywords = this.state.searchKeywords
    var time = this.state.initialData.time
    // var ingr = this.state.initialData.ingredientCount
    if(this.state.both){
      var type = 'dishType=Biscuits%20and%20cookies&dishType=Cereals&dishType=Desserts&dishType=Drinks&dishType=Pancake&dishType=Preserve&dishType=Sweets&dishType=Bread&dishType=Condiments%20and%20sauces&dishType=Main%20course&dishType=Pancake&dishType=Preps&dishType=Salad&dishType=Sandwiches&dishType=Side%20dish&dishType=Soup&dishType=Starter'
    }else{
        if(this.state.initialData.type == 'dessert'){
          var type = 'dishType=Biscuits%20and%20cookies&dishType=Cereals&dishType=Desserts&dishType=Drinks&dishType=Pancake&dishType=Preserve&dishType=Sweets'
        }else{
          var type = 'dishType=Bread&dishType=Condiments%20and%20sauces&dishType=Main%20course&dishType=Pancake&dishType=Preps&dishType=Salad&dishType=Sandwiches&dishType=Side%20dish&dishType=Soup&dishType=Starter'
        }
    }
    var num = this.state.call
    // console.log("1 NUM: " + num)

    if(this.state.next === 'first'){
        var url = `https://api.edamam.com/api/recipes/v2?type=public&q=${keywords}&time=1-${time}&${type}&app_id=f70ab024&app_key=2e0223626b3cd85bbeedb8598d9bff50`
        console.log("first_url: " + url)

    }else{
        console.log("COUNT: " + this.state.count)
        try{
          var x = this.state.next
          var url = x['next']['href']
          console.log("next url: " + url)

        }catch{
          console.log("No next page")
          this.setState({
            noMorePages: true,
            nextCall: false,
            startRefine: true,
            stopwatchRunning: true,
          })
          this.startStopwatch()

          return 1;
        }

    }

    num += 1
    console.log("2. num: " + num)

    if(num % 11 === 0){
      console.log("number is divisible by 11")
      this.setState({
        nextCall: false,
        call: num,
        startRefine: true,
        stopwatchRunning: true
      })
      this.startStopwatch()
      return 1
    }else{
      console.log("number not divisible by 11")
    }

    fetch(url, { signal: this.abortController.signal })
    .then(response => response.json())
    .then(data => {
        this.setState({
          fResponse: [
            ...this.state.fResponse,
            data
          ],
          count: data['count'],
          next: data['_links'],
          call: num,
          nextCall: true
        })
    })
    .catch(error => {
      console.log("API CALL ERROR: " + error + ". stack: " + error.stack)
    });

    // console.log("API CALL FUNCTION OVER")
  }

// Times the app out for 60 seconds in order to spread out
//   api calls (ensures that 10 hits/minute aren't exceeded):
  startStopwatch(){
    console.log("starting stopwatch")
    var cmponent = this
    setTimeout(function(){
        console.log("stopwatch finished")
        cmponent.setState({
          nextCall: true,
          stopwatchRunning: false
          // startRefine: false,
        })
      }, 60000)
  }

// Passes back the recipe url list to the
//  main RecipeResults component:
  finishedHandler(){
    console.log("finished handler")
    var states = [null, 0]

    if(states.includes[this.state.count]){
      if(count === 0){
            console.log("1.No results on main page, count = 0, deleting a keyword")
            if(this.state.searchKeywords.length > 1){
                this.setState({
                  deleteOne: true
                })
            }else{
              console.log("1.FINAL KEYWORD NO RESULTS!")
            }
      }else{
        console.log("~~~~~~####### COUNT IS NULL! #######~~~~~~~")
      }
      // knock an ingredient off if count === 0 ...... TEST TO SEE WHETHER MAKES A DIFFERENCE
    }else if(this.state.refinedRecipeList.length === 0){
      console.log("No relevant results found - knocking ingredient off")
      // knock an ingredient off
      if(this.state.searchKeywords.length > 1){
          this.setState({
            deleteOne: true
          })
      }else{
        console.log("2.FINAL KEYWORD NO RESULTS!")
      }

    }else{
      // display results
      console.log("Displaying results")
      // Button at end of results giving option to extend search (knocks another ingredient off)
    }
  }

  deleteAKeyword(){
    var keywords = this.state.searchKeywords
    var omitted = keywords.pop()
    console.log("omitted: " + omitted)
    for(x in keywords){
      console.log("~~~ " + keywords[x])
    }
    this.setState({
      searchKeywords: keywords,
      omittedKeywords: [
        ...this.state.omittedKeywords,
        omitted
      ],
      deleteOne: false,
      fResponse: [],
      startRefine: false,
      nextCall: true,
      next: 'first',
      count: null,
      noMorePages: false,
      call: 0,
    })
  }



  getRelevantRecipes(relevant_recipes){
    console.log("filtered initial")
    console.log("relevant_recipes.length: " + relevant_recipes.length)

    if(relevant_recipes.length === 0){
      console.log("No relevant results on these pages")
      this.setState({
        fResponse: [],
        startRefine: false,
        finalResults: false,
      })
    }else{
      console.log("found relevant results")
      this.setState({
        refinedRecipeList: [
          ...this.state.refinedRecipeList,
          relevant_recipes,
        ],
        fResponse: [],
        startRefine: false,
        finalResults: true
      })
    }
  }



/// RENDER() CONFIRM.JS:

// <View style={styles.loadingContainer}>
//
//     <View style={{justifyContent:"center"}}>
//       <SearchingPage />
//     </View>

    // { call_api === true && <ApiCalls
    //   time = {this.state.initialData.time}
    //   ingredientCount = {this.state.initialData.ingredientCount}
    //   type = {this.state.initialData.type}
    //   keywords={this.state.initialData.ingredients}
    //   passDataBack = {this.apiCallFinished} /> }
  // </View>




  render(){
    // var initial = this.state.initialData
    // var either = this.state.both
    // var ingreds = this.state.initialData.ingredients
    // var response = this.state.firstResponse
    //
    // var call_api = this.state.apiCall
    // var timer_started = this.state.timerStarted
    // var redirect = this.state.redirect
    var alter_keywords = this.state.reduceKeywords

    var api_error = this.state.apiError
    var count = this.state.count
    var no_count = [ undefined, null ]
    var no_results = [0,]
    var response = this.state.fResponse
    // var searching = false
    // if(no_count.includes(count)){
    //   searching = true
    // }
    var loading = true
    // if(searching === true){
    //   loading = false
    // }
    var start_refine = this.state.startRefine
    var final_results = this.state.finalResults


    return(

            <SafeAreaView style={styles.container}>
              <ScrollView>

                  { alter_keywords && < AlterKeywords
                    keywords = {this.state.searchKeywords}
                    alteredKeywords = {this.keywordsAlteredHandler}
                    /> }

                  { api_error &&
                      <View>
                             <Text>Sorry, there was an error!</Text>
                             <Link accessible={true} accessibilityLabel= "An error occurred"
                               accessibilityHint="Click button to report the error and try again"
                               to="/" accessibilityRole="button" underlayColor="transparent">
                                 <Text style={styles.greenButton}>Report and try again</Text>
                             </Link>
                      </View>
                   }

                   {start_refine === true && <RefineResults
                       filteredResults={this.getRelevantRecipes}
                       thisRoundResponseList={this.state.fResponse}
                       maxIngredients={this.state.initialData.ingredientCount}
                       userIngredients={this.state.initialData.ingredients}/>
                   }

                   { this.state.finalResults && this.state.noMorePages &&
                       <View>
                           {response.map(function(item,index){
                              return(
                                <View style={styles.container} key={index}>
                                    {item['hits'].map(function(hit,ind){
                                       return(
                                             <View key={ind} style={{justifyContent:"center",alignItems:"center"}}>

                                                 <Text accessible={true} accessibilityRole="text"
                                                   accessibilityLabel={hit['recipe']['label'].toString()}
                                                   style={styles.title}>{hit['recipe']['label']}</Text>

                                                 <Pressable onPress={() => Linking.openURL(`${hit['recipe']['url']}`)}>
                                                   <Text accessible={true} accessibilityLabel="Go to recipe website" accessibilityRole="link"
                                                     style={styles.greenButton}>Go to recipe website</Text>
                                                 </Pressable>

                                              </View>
                                             )
                                        }
                                      )}
                                  </View>
                                 )
                              }
                            )}
                            <Link accessible={true} accessibilityLabel= "Start again"
                              accessibilityHint="Click button to go back to homepage"
                              to="/" accessibilityRole="button" underlayColor="transparent">
                                <Text style={styles.blueButton}>Start again</Text>
                            </Link>
                      </View>
                     }

                     { this.state.finalResults && !(this.state.noMorePages) && loading &&
                       <View>
                               <View>
                                     {response.map(function(item,index){
                                        return(
                                          <View style={styles.container} key={index}>
                                              {item['hits'].map(function(hit,ind){
                                                 return(
                                                       <View key={ind} style={{justifyContent:"center",alignItems:"center"}}>

                                                           <Text accessible={true} accessibilityRole="text"
                                                             accessibilityLabel={hit['recipe']['label'].toString()}
                                                             style={styles.title}>{hit['recipe']['label']}</Text>

                                                           <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${hit['recipe']['url']}`)}>
                                                             <Text accessible={true} accessibilityLabel="Go to recipe website" accessibilityRole="link"
                                                               style={styles.greenButton}>Go to recipe website</Text>
                                                           </Pressable>

                                                        </View>
                                                       )
                                                  }
                                                )}
                                            </View>
                                           )
                                        }
                                     )}
                                 </View>
                                 <View style={{justifyContent:"center",alignItems:"center"}}>
                                    <LoadingPage />
                                 </View>
                         </View>
                       }

                  </ScrollView>
                </SafeAreaView>
          );

   }

};

export { ApiCalls };


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
  greenButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
    textAlign: 'center',
    width: 150,
  },
  blueButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
  },
  title: {
    fontSize:18,
    fontWeight:'bold',
    textAlign: 'center',
  },
});
