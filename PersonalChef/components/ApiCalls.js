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
      apiCall: false,

      foundResults: true,
      apiError: false,
      fResponse: [],
      next: 'first',
      count: null,

      nextCall: false,
      noMorePages: false,
      call: 0,
      startRefine: false,
      refinedRecipeList: []
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
  };

  componentDidMount(){
    console.log("Api component mounted")
    var initial_data = this.props.location.state.initial_data
    var ingredients = this.props.location.state.ingredients
    var ingreds = this.props.location.state.ingreds
    var either = this.props.location.state.either
    var reduce = false
    var start_calling = false
    console.log("hello")
    console.log("ingreds.length: " + ingredients.length)
    if(ingredients.length > 5){
      console.log("greater than 5")
      reduce = true
      start_calling = false
    }else{
      console.log("less than 5")
      start_calling = true
    }
    this.setState({
      initialData: initial_data,
      searchKeywords: ingredients,
      reduceKeywords: reduce,
      nextCall: start_calling,
      both: either,
    })
    console.log("the end")
  }

  componentWillUnmount(){
    console.log("Api component unmounted")
    this.abortController.abort()
  }

  componentDidUpdate(){
    console.log("API COMPONENT UPDATED")
    console.log("this.state.count: " + this.state.count)
    console.log("this.state.next: " + this.state.next)
    if(this.state.count === undefined){
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
    // if(this.state.reduceKeywords){
    //   console.log("did update - reduce keywords")
    // }
    if(this.state.nextCall){
      this.triggerNextCall()
    }
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
    var keywords = this.state.initialData.ingredients
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
    console.log("1 NUM: " + num)

    if(this.state.next === 'first'){
        var url = `https://api.edamam.com/api/recipes/v2?type=public&q=${keywords}&time=1-${time}&${type}&app_id=f70ab024&app_key=2e0223626b3cd85bbeedb8598d9bff50`
        console.log("first_url: " + url)

    }else{

        try{
          var x = this.state.next
          var url = x['next']['href']
          console.log("next url: " + url)

        }catch{
          console.log("No next page")
          this.setState({
            noMorePages: true,
            nextCall: false,
            startRefine: true
          })

          return 1;
        }

    }

    num += 1
    console.log("2. num: " + num)

    if(num % 10 === 0){
      this.setState({
        nextCall: false,
        call: num,
        startRefine: true
      })
      this.startStopwatch()
      return 1
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

    console.log("API CALL FUNCTION OVER")
  }

// Times the app out for 60 seconds in order to spread out
//   api calls (ensures that 10 hits/minute aren't exceeded):
  startStopwatch(){
    console.log("starting stopwatch")
    // this.setState({
    //   startRefine: true
    // })
    var cmponent = this
    setTimeout(function(){
        console.log("stopwatch finished")
        cmponent.setState({
          nextCall: true
        })
      }, 60000)
  }

// Passes back the recipe url list to the
//  main RecipeResults component:
  finishedHandler(){
    console.log("finished handler")
    var states = [null, 0]

    if(states.includes[this.state.count]){
      console.log("No results, count = 0")
      // this.props.passDataBack(initial)
    }else{
      console.log("this.state.fResponse[0]['count']: " + this.state.fResponse[0]['count'])
      var initial = this.state.fResponse
      console.log("finished count: " + this.state.count)
      // console.log("initial[0]['hits'][0]['recipe']['label']: " + initial[0]['hits'][0]['recipe']['label'])
      // this.props.passDataBack(initial)
    }
  }



  // Takes new ingredients list in from < AlterKeywords /> component,
  //  triggers new API call (with reduced/altered ingredient list):

    keywordsAlteredHandler(new_keywords){
      console.log("ingredients altered handler triggered")

        this.setState({
          searchKeywords: new_keywords,
          reduceKeywords: false,
          nextCall: true
        })
      for(x in new_keywords){
        console.log(new_keywords[x])
        console.log("***")
      }
    }



    getRelevantRecipes(relevant_recipes){
      console.log("filtered initial")
      console.log("relevant_recipes.length: " + relevant_recipes.length)
      var last_result = []
      var responses = this.state.fResponse
      var final = responses.pop
      last_result.push(final)
      if(relevant_recipes.length === 0){
        console.log("No relevant results on these pages")
        this.setState({
          startRefine: false,
          fResponse: last_result,
          results: false,
        })
      }else{
        console.log("found relevant results")
        this.setState({
          refinedRecipeList: [
            ...this.state.refinedRecipeList,
            relevant_recipes,
          ],
          startRefine: false,
          fResponse: last_result,
          results: true
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

  // { alter_ingredients && < AlterKeywords
  //   ingredients = {this.state.initialData.ingredients}
  //   alteredIngredients = {this.ingredientsAlteredHandler}
  //   /> }



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
    var searching = false
    if(no_count.includes(count)){
      searching = true
    }
    var loading = true
    if(searching === true){
      loading = false
    }
    var start_refine = this.state.startRefine


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

                   { searching && !(api_error) &&
                       <View style={{justifyContent:"center"}}>
                         <SearchingPage />
                       </View>
                   }

                   { no_results.includes(count) &&
                     <View style={{justifyContent:"center"}}>
                        <Text>Trigger alter keywords</Text>
                     </View>
                   }

                   {start_refine === true && <RefineResults
                       filteredResults={this.getRelevantRecipes}
                       thisRoundResponseList={this.state.fResponse}
                       maxIngredients={this.state.initialData.ingredientCount}
                       userIngredients={this.state.initialData.ingredients}/>
                   }

                   { this.state.foundResults && this.state.noMorePages &&
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

                     { this.state.foundResults && !(this.state.noMorePages) && loading &&
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
