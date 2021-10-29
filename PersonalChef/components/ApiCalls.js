import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, Linking, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { AlterKeywords } from './AlterKeywords.js';
import { RefineResults } from './RefineResults.js';
import { SearchingPage, FilteringAnimation } from "./Animations.js";
import AsyncStorage from '@react-native-async-storage/async-storage';


class ApiCalls extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userId: 12345,
      savedRecipes: [],
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
      noMoreKeywords: false,

      foundResults: true,
      apiError: false,
      keywordsError: false,
      fResponse: [],
      next: 'first',
      count: null,

      nextCall: false,
      stopwatchRunning: false,
      stopwatchTriggered: false,
      noMorePages: false,
      call: 0,
      startRefine: false,
      refinedRecipeList: [],

      searchPaused: false,
      pauseAndSave: false,
      saveStopwatchTriggered: false,
      recipesToSave: [],

      finalResults: false,
      finished: false
    },
    this.apiAbortController = new AbortController()
    this.getDeviceData = this.getDeviceData.bind(this)
    this.getData = this.getData.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.keywordsAlteredHandler = this.keywordsAlteredHandler.bind(this)
    this.triggerNextCall = this.triggerNextCall.bind(this)
    this.apiCall = this.apiCall.bind(this)

    this.triggerStopwatch = this.triggerStopwatch.bind(this)
    this.sixSecondStopwatch = this.sixSecondStopwatch.bind(this)

    this.finishedHandler = this.finishedHandler.bind(this)
    this.getRelevantRecipes = this.getRelevantRecipes.bind(this)
    this.deleteAKeyword = this.deleteAKeyword.bind(this)

    this.setStates = this.setStates.bind(this)
    this.tryAgain = this.tryAgain.bind(this)

    this.saveDeviceData = this.saveDeviceData.bind(this)
    this.saveData = this.saveData.bind(this)
    this.saveRecipe = this.saveRecipe.bind(this)
    this.saveStopwatch = this.saveStopwatch.bind(this)
  };

  getDeviceData = async (key) => {
       console.log("Getting savedRecipes")
       try {
            console.log("try")
            var data = await AsyncStorage.getItem(key)
            if(data !== null) {
                var value = JSON.parse(data)
                console.log("value: " + value)
            }else{
                var value = 0
            }
            return value;
        }
        catch(e) {
            console.log("ApiCalls: Error reading data for savedRecipes in getDeviceData: " + e);
        }
  }

  getData(key){
      try {
          var saved_recipes = this.getDeviceData(key)
          .then(saved_recipes => {
              this.setState({
                savedRecipes: saved_recipes
              })
          })
          console.log("RETRIEVED")
          return saved_recipes
      } catch (e) {
          console.log("ConfirmList: Error getting data in getData: " + e)
          return 0
      }
  }

  componentDidMount(){
    console.log("API COMPONENT MOUNTED")
    var initial_data = this.props.location.state.initial_data
    initial_data.ingredients.push('water')
    initial_data.ingredientCount += 1
    if(initial_data.time > 45){
      initial_data.ingredients.push('ice')
      initial_data.ingredientCount += 1
    }
    var ingreds = this.props.location.state.ingreds
    var either = this.props.location.state.either
    var ingredients_alone = initial_data.ingredients
    var saved_recipes = '@saved-recipes'
    this.getData(saved_recipes)
    this.setState({
      initialData: initial_data,
      searchKeywords: ingredients_alone,
      reduceKeywords: true,
      nextCall: false,
      both: either,
    })
  }

  componentWillUnmount(){
    console.log("API COMPONENT UNMOUNTED")
    this.apiAbortController.abort()
    ////// Cancel all timeouts /////////////
  }

  componentDidUpdate(){
    console.log("API COMPONENT UPDATED")
    // console.log("this.state.stopwatchRunning: " + this.state.stopwatchRunning)
    console.log("this.state.startRefine: " + this.state.startRefine)
    // console.log("*this.state.next: " + this.state.next)-
    if(this.state.searchPaused){

        if(this.state.pauseAndSave){
          if(this.state.stopwatchRunning && this.state.saveStopwatchTriggered){
             this.saveStopwatch()
          }
          if(this.state.saveStopwatchTriggered === false){
            var to_save = this.state.recipesToSave
            var recipe_key = '@saved-recipes'
            this.saveData(recipe_key, to_save)
          }
        }
        else if(this.state.stopwatchRunning){
          /// 8 second timeout until searchPaused === false
          this.eightSecondStopwatch()
        }

    }else{
        if(this.state.finalResults && this.state.finished === false){
          var final_length = this.state.refinedRecipeList.length
          console.log("relevant results length: " + final_length)
          if(final_length > 100){
            this.setStates()
          }
        }
        // console.log("this.state.count: " + this.state.count)
        if(this.state.count === undefined && this.state.next !== 'first'){
          console.log("API a")
          this.setStates('error')
        }
        // Checks whether api function has finished calling
        //  each page, triggers next function if so:
        if(this.state.noMorePages) {
          console.log("API b")
          this.finishedHandler()
        }
        if(this.state.nextCall && this.state.stopwatchRunning === false){
          console.log("API c")
          console.log("**this.state.next: " + this.state.next)
          this.triggerNextCall()
        }
        if(this.state.deleteOne){
          console.log("API d")
          this.deleteAKeyword()
        }
        if(this.state.stopwatchRunning && this.state.stopwatchTriggered === false){
          this.triggerStopwatch()
        }
        if(this.state.stopwatchTriggered){
          this.sixSecondStopwatch()
        }
        if(this.state.saved){
          console.log("Saved is TRUE")
          this.setStates('saved')
        }
    }
  }

  saveStopwatch(){
    console.log("starting 7 second save stopwatch")
    var cmponent = this
    setTimeout(function(){
        console.log("7 second save stopwatch finished")
        cmponent.setState({
          saveStopwatchTriggered: false,
          stopwatchRunning: false,
        })
      }, 7000)
  }

  eightSecondStopwatch(){
    console.log("starting 8 second save stopwatch")
    var cmponent = this
    setTimeout(function(){
        console.log("8 second save stopwatch finished")
      }, 8000)
  }

  setStates(option=0){
    if(option === 'error'){
      console.log("OPTION 1")
      this.setState({
        apiError: true,
        nextCall: false
      })
    }
    else if(option === 'saved'){
      this.setState({
        saved: false
      })
    }
    else{
      console.log("OPTION 2")
      this.setState({
        nextCall: false,
        finished: true
      })
    }
  }

  triggerStopwatch(){
    this.setState({
      stopwatchTriggered: true
    })
  }

  triggerNextCall(){
    console.log("API g")
    console.log("THIS.STATE.COUNT: " + this.state.count)
    if(this.state.count === 0){
      console.log("API h")
      this.setState({
        nextCall: false,
        noMorePages: true,
        foundResults: false
      })
    }else{
      console.log("API i")
      this.apiCall()
      console.log("API j")
      this.setState({
        nextCall: false,
        foundResults: true
      })
    }
  }

// Takes new keywords list in from < AlterKeywords /> component,
//  triggers new API call (with reduced keyword list):
   keywordsAlteredHandler(new_keywords,status){
      console.log("ingredients altered handler triggered")
      var saved_recipes = this.state.savedRecipes
      if(saved_recipes === undefined){
        saved_recipes = []
      }

      var original_ingredients = this.state.initialData.ingredients
      for(x in new_keywords){
        original_ingredients.push(new_keywords[x])
      }
      for(x in new_keywords){
        console.log(x + ". " + new_keywords[x])
        console.log("***")
      }
      if(status){
        console.log("status = true")
        this.setState({
          savedRecipes: saved_recipes,
          initialData: {
            ...this.state.initialData,
            ingredients: original_ingredients,
          },
          searchKeywords: new_keywords,
          reduceKeywords: false,
          nextCall: true
        })
        console.log("API e")
      }else{
        console.log("status = false")
        this.setState({
          savedRecipes: saved_recipes,
          initialData: {
            ...this.state.initialData,
            ingredients: original_ingredients,
          },
          keywordsError: true,
          searchKeywords: new_keywords,
          reduceKeywords: false,
          nextCall: false
        })
        console.log("API f")
      }
  }


  saveDeviceData = async ( key, data ) => {
        console.log("ApiCalls - saving recipe to device")
        try {
            console.log("ApiCalls - TRY")
            await AsyncStorage.setItem(key, JSON.stringify(data))
        }
        catch (e) {
            console.log(`ApiCalls: Error in saveDeviceData, saving data for key ${key}: `, data);
            throw e;
        }
  }

  saveData(key,data){
       try {
           var res = this.saveDeviceData(key,data)
           .then(res => {
             this.setState({
               saved: true,
               savedRecipes: data,
               searchPaused: false,
               pauseAndSave: false
             })
           })
           console.log("RECIPE SAVED")
       } catch (e) {
           console.log("ApiCalls: Error saving in saveData: " + e)
       }
  }

  saveRecipe(recipe){
    console.log("saveRecipe function")
    console.log("recipe[0]: " + recipe[0])
    var saved_list = []
    var already_saved = this.state.savedRecipes
    var item
    if(already_saved !== undefined){
      for(item in already_saved){
        saved_list.push(already_saved[item])
      }
    }
    var r
    for(r in recipe){
      saved_list.push(recipe[r])
    }
    this.setState({
      recipesToSave: saved_list,
      searchPaused: true,
      pauseAndSave: true,
      stopwatchRunning: true,
      saveStopwatchTriggered: true
    })
  }

// Calls first api 10 times (allowance is 10 hits per minute),
//  collects 200 recipe apis (if that many are returned):
  apiCall(){
    console.log("calling APIs")
    var keywords = this.state.searchKeywords
    var time = this.state.initialData.time
    var ingr = this.state.initialData.ingredientCount
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

    if(this.state.next === 'first'){
        var url = `https://api.edamam.com/api/recipes/v2?type=public&q=${keywords}&time=1-${time}&${type}&ingr=1-${ingr}&app_id=f70ab024&app_key=2e0223626b3cd85bbeedb8598d9bff50`
        console.log("first_url: " + url)

    }else{

        try{
          var next_call = this.state.next
          var url = next_call['next']['href']
          console.log("next url: " + url)

        }catch{
          console.log("No next page")
          this.setState({
            noMorePages: true,
            nextCall: false,
            startRefine: true,
          })
          return 1;
        }

    }

    num += 1
    console.log("2. num: " + num)

    fetch(url, { signal: this.apiAbortController.signal } )
    .then(response => response.json())
    .then(data => {
        console.log("data['from']: " + data['from'])
        this.setState({
          fResponse: [
            ...this.state.fResponse,
            data
          ],
          count: data['count'],
          next: data['_links'],
          call: num,
          startRefine: true,
          stopwatchRunning: true
        })
     })
    .catch(error => {
      console.log("API CALL ERROR: " + error + ". stack: " + error.stack)
      console.log("NUM: " + num)
      console.log("If undefined here don't overwrite 'next'") /////////////////////  Fix this
      this.setState({
        apiError: true,
      })
     });
    console.log("COUNT: " + this.state.count)
  }

  tryAgain(){
    console.log("TRY AGAIN function")
    console.log("this.state.foundResults: " + this.state.foundResults)
    var ings = this.state.initialData.ingredients
    this.setState({
      next: 'first',
      reduceKeywords: true,
      nextCall: false,
      searchKeywords: ings,
      omittedKeywords: [],
      apiError: false,
    })
  }

// Times the app out for 6 seconds in order to spread out
//   api calls (ensures that 10 hits/minute aren't exceeded):
  sixSecondStopwatch(){
    console.log("starting 6 second stopwatch")
    console.log("****this.state.next: " + this.state.next)
    var cmponent = this
    setTimeout(function(){
        console.log("6 second stopwatch finished")
        cmponent.setState({
          nextCall: true,
          stopwatchTriggered: false,
          stopwatchRunning: false,
          foundResults: true
        })
      }, 6000)
    console.log("API l")
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
    }else if( this.state.noMoreKeywords === false ){
      console.log("No relevant results found - knocking ingredient off")
      // knock an ingredient off
      if(this.state.searchKeywords.length > 1){
          console.log("API m")
          this.setState({
            deleteOne: true,
          })
      }else{
        console.log("2.FINAL KEYWORD NO RESULTS!")
        this.setState({
          noMoreKeywords: true
        })
      }

    }else{
      // display results
      console.log("Displaying results")
      // Button at end of results giving option to extend search (knocks another ingredient off)
    }
  }

// Deletes keyword from end of searchKeywords list if no relevant results
//  have been returned, triggers a new api call:
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
    console.log("API n")
  }

// Takes in the final list of relevant recipes returned
//  from RefineResults component, saves to state:
  getRelevantRecipes(relevant_recipes){
    console.log("filtered initial")
    console.log("relevant_recipes.length: " + relevant_recipes.length)
    var current_list = this.state.refinedRecipeList
    var indexes_to_splice = []
    var recipe
    // Checks that new recipe links aren't already in refinedRecipeList (from previous reponse pages):
    for(recipe in relevant_recipes){
        console.log("relevant_recipes[recipe][1]: " + relevant_recipes[recipe][1])
        var result
        for(result in current_list){
            // console.log("relevant[result][1]: " + relevant[result][1])
            // console.log("relevant_recipes[recipe][1]: " + relevant_recipes[recipe][1])
            if(relevant_recipes[recipe][1] === current_list[result][1]){
                console.log("Link already listed")
                var this_recipe = relevant_recipes[recipe]
                var ind = relevant_recipes.indexOf(this_recipe)
                indexes_to_splice.push(ind)
            }
        }
    }
    if(indexes_to_splice.length>0){
      var i
      for(i in indexes_to_splice){
        relevant_recipes.splice(i,1)
      }
    }
    // Pushes new relevant recipes to existing refinedRecipeList:
    var x
    for(x in relevant_recipes){
      current_list.push(relevant_recipes[x])
    }
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
        refinedRecipeList: current_list,
        fResponse: [],
        startRefine: false,
        finalResults: true
      })
    }
  }

  pauseSearch(){
    var new_state = !(this.state.searchPaused)
    this.setState({
      searchPaused: new_state
    })
  }


  render(){
    console.log("Api component rendered")
    var alter_or_reorder_keywords = this.state.reduceKeywords
    var api_error = this.state.apiError
    var count = this.state.count
    var no_count = [ undefined, null ]
    var no_results = [0,]
    var response = this.state.fResponse
    var filtering = false
    if(this.state.noMorePages === false && this.state.nextCall === false){
      filtering = true
    }
    var start_refine = this.state.startRefine
    var final_results = this.state.finalResults
    var self = this
    var paused = this.state.searchPaused
    var save_paused = this.state.pauseAndSave


    return(

            <SafeAreaView style={styles.container}>
              <ScrollView>

                  { alter_or_reorder_keywords && < AlterKeywords
                    keywords = {this.state.searchKeywords}
                    alteredKeywords = {this.keywordsAlteredHandler}
                    />
                  }

                  { api_error &&
                    <SafeAreaView style={styles.container}>
                      <ScrollView>
                          <View>
                                 <Text>Sorry, there was an error!</Text>

                                 <Pressable style={{justifyContent:"center"}} onPress={this.tryAgain}>
                                      <Text style={styles.greenButton}>try again</Text>
                                 </Pressable>
                                 <Link accessible={true} accessibilityLabel= "An error occurred"
                                   accessibilityHint="Click button to report the error and try again"
                                   to="/" accessibilityRole="button" underlayColor="transparent">
                                     <Text style={styles.greenButton}>Report and start again</Text>
                                 </Link>
                          </View>
                        </ScrollView>
                      </SafeAreaView>
                   }

                   { start_refine === true && <RefineResults
                       filteredResults={this.getRelevantRecipes}
                       thisRoundResponseList={this.state.fResponse}
                       maxIngredients={this.state.initialData.ingredientCount}
                       userIngredients={this.state.initialData.ingredients}/>
                   }

                   { this.state.refinedRecipeList.length === 0 &&
                     <SafeAreaView style={styles.container}>
                       <ScrollView>
                         <View style={styles.container}>
                             <View style={{justifyContent:"center"}}>
                                <SearchingPage />
                             </View>
                         </View>
                       </ScrollView>
                     </SafeAreaView>
                   }

                   { this.state.refinedRecipeList.length > 0 && this.state.noMorePages &&
                     <SafeAreaView style={styles.container}>
                       <ScrollView>
                           <View>
                                   <Text style={styles.mainTitle}>Your results</Text>
                                   <View>
                                         {this.state.refinedRecipeList.map(function(item,index){
                                            return(
                                              <View style={styles.container} key={index}>
                                                   <View style={{justifyContent:"center",alignItems:"center"}}>

                                                               <Text accessible={true} accessibilityRole="text"
                                                                 accessibilityLabel={item[0].toString()}
                                                                 style={{justifyContent:"center",fontSize:18,fontWeight:"bold",
                                                                 textAlign:"center"}}>{item[0]}</Text>

                                                               <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${item[1]}`)}>
                                                                 <Text accessible={true} accessibilityLabel="!!!!! Go to recipe website" accessibilityRole="link"
                                                                   style={styles.greenButton}>Go to recipe website</Text>
                                                               </Pressable>

                                                               <Pressable style={{justifyContent:"center"}} onPress={() => self.saveRecipe(item)}>
                                                                  <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                                    accessibilityRole="button" style={styles.greenButton}>Save recipe</Text>
                                                               </Pressable>

                                                      </View>
                                                </View>
                                               )
                                             }
                                          )}
                                     </View>
                                     <Link accessible={true} accessibilityLabel= "Start again"
                                       accessibilityHint="Click button to go back to homepage"
                                       to="/" accessibilityRole="button" underlayColor="transparent">
                                         <Text style={styles.blueButton}>Start again</Text>
                                     </Link>
                             </View>
                           </ScrollView>
                         </SafeAreaView>
                     }

                     { this.state.refinedRecipeList.length > 0 && filtering && paused === false &&

                             <View>
                                    <Text style={styles.mainTitle}>Your results</Text>
                                     <View>
                                           {this.state.refinedRecipeList.map(function(item,index){
                                              return(
                                                <View style={styles.container} key={index}>
                                                     <View style={{justifyContent:"center",alignItems:"center"}}>

                                                                 <Text accessible={true} accessibilityRole="text"
                                                                   accessibilityLabel={item[0].toString()}
                                                                   style={{justifyContent:"center",fontSize:18,fontWeight:'bold',
                                                                   textAlign:"center"}}>{item[0]}</Text>


                                                                 <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${item[1]}`)}>
                                                                   <Text accessible={true} accessibilityLabel="!!!!! Go to recipe website" accessibilityRole="link"
                                                                     style={styles.greenButton}>Go to recipe website</Text>
                                                                 </Pressable>

                                                                 <Pressable style={{justifyContent:"center"}} onPress={() => self.saveRecipe(item)}>
                                                                    <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                                      accessibilityRole="button" style={styles.greenButton}>Save recipe</Text>
                                                                 </Pressable>

                                                        </View>
                                                  </View>
                                                 )
                                               }
                                            )}
                                       </View>
                                       <View style={{justifyContent:"center",alignItems:"center"}}>
                                          <FilteringAnimation />
                                       </View>

                                       <View style={{justifyContent:"center",alignItems:"center"}}>
                                           <Pressable accessible={true} accessibilityLabel="pause search" accessibilityRole="button"
                                             style={{marginTop:90}} underlayColor="transparent" onPress={() => self.pauseSearch() }>
                                               <Text style={styles.blueButton}>Pause search</Text>
                                           </Pressable>
                                       </View>
                                       <View style={{justifyContent:"center",alignItems:"center"}}>
                                           <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                             style={{marginTop:90}} to="/pantry/" underlayColor="transparent">
                                               <Text style={styles.redButton}>Cancel search and start again</Text>
                                           </Link>
                                       </View>
                               </View>

                        }

                        { this.state.refinedRecipeList.length > 0 && paused &&


                                <View>
                                        {save_paused &&
                                           <Text style={styles.title}>Saving recipe...</Text>
                                        }
                                        <Text style={styles.mainTitle}>Your results</Text>
                                        <View>
                                              {this.state.refinedRecipeList.map(function(item,index){
                                                 return(
                                                   <View style={styles.container} key={index}>
                                                        <View style={{justifyContent:"center",alignItems:"center"}}>

                                                                    <Text accessible={true} accessibilityRole="text"
                                                                      accessibilityLabel={item[0].toString()}
                                                                      style={{justifyContent:"center",fontSize:18,fontWeight:'bold',
                                                                      textAlign:"center"}}>{item[0]}</Text>


                                                                    <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${item[1]}`)}>
                                                                      <Text accessible={true} accessibilityLabel="!!!!! Go to recipe website" accessibilityRole="link"
                                                                        style={styles.greenButton}>Go to recipe website</Text>
                                                                    </Pressable>

                                                                    <Pressable style={{justifyContent:"center"}} onPress={() => self.saveRecipe(item)}>
                                                                       <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                                         accessibilityRole="button" style={styles.greenButton}>Save recipe</Text>
                                                                    </Pressable>

                                                           </View>
                                                     </View>
                                                    )
                                                  }
                                               )}
                                          </View>

                                          { save_paused === false &&
                                              <View style={{justifyContent:"center",alignItems:"center"}}>
                                                  <Pressable accessible={true} accessibilityLabel="pause search" accessibilityRole="button"
                                                    style={{marginTop:90}} underlayColor="transparent" onPress={() => self.pauseSearch() }>
                                                      <Text style={styles.blueButton}>Unpause</Text>
                                                  </Pressable>
                                              </View>
                                          }

                                          <View style={{justifyContent:"center",alignItems:"center"}}>
                                              <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                style={{marginTop:90}} to="/pantry/" underlayColor="transparent">
                                                  <Text style={styles.redButton}>Cancel search and start again</Text>
                                              </Link>
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
  redButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'pink',
    textAlign: "center",
    marginTop: 10,

  },
  title: {
    fontSize:18,
    fontWeight:'bold',
    textAlign: 'center',
  },
  mainTitle: {
    fontSize:28,
    marginBottom:10,
    textAlign:"center",
  },
});
