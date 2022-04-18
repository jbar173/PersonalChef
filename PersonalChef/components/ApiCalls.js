import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, Linking, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { AlterKeywords } from './AlterKeywords.js';
import { RefineResults } from './RefineResults.js';
import { AlmostList } from './AlmostList.js';
import { SearchingPageAnimation, FilteringAnimation, SavingRecipeAnimation, ChangingTabsAnimation } from "./Animations.js";
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
      tryAgain: false,
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
      substitutesDict: {},

      searchPaused: false,
      pauseAndSave: false,
      saveStopwatchTriggered: false,
      recipeClicked: '',
      recipesToSave: [],
      savedRecipeIndexes: [],

      finished: false,
      changeTabs: false,
      almostClicked: false,
      showAlmost: false,
      almostList: [],
      almostsSavedRecipeInfo: {
        'first url': 'missing ingredient'
      },
      almostsUrlList: [],
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
    this.checkForDuplicates = this.checkForDuplicates.bind(this)
    this.deleteAKeyword = this.deleteAKeyword.bind(this)

    this.setStates = this.setStates.bind(this)
    this.tryAgain = this.tryAgain.bind(this)

    this.saveDeviceData = this.saveDeviceData.bind(this)
    this.saveData = this.saveData.bind(this)
    this.saveRecipe = this.saveRecipe.bind(this)
    this.sevenSecondStopwatch = this.sevenSecondStopwatch.bind(this)
    this.eightSecondStopwatch = this.eightSecondStopwatch.bind(this)

    this.switchAlmost = this.switchAlmost.bind(this)
    this.animationOver = this.animationOver.bind(this)

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

    if(this.state.searchPaused){

          if(this.state.pauseAndSave){

              if(this.state.stopwatchRunning && this.state.saveStopwatchTriggered){
                 this.sevenSecondStopwatch()
              }
              if(this.state.saveStopwatchTriggered === false){
                var to_save = this.state.recipesToSave
                var recipe_key = '@saved-recipes'
                this.saveData(recipe_key, to_save)
              }

          }
          else if(this.state.changeTabs){

              if(this.state.stopwatchRunning && this.state.saveStopwatchTriggered){
                 this.sevenSecondStopwatch()
              }
              if(this.state.saveStopwatchTriggered === false){
                 var almost_state = this.state.almostClicked
                 this.setStates(almost_state)
              }

          }
          else if(this.state.stopwatchRunning){
            /// 8 second timeout until searchPaused === false
            console.log("~~~~~SEARCH PAUSED~~~~~~")
            this.eightSecondStopwatch()
          }

    }else{
        if(this.state.changeTabs){
          var almost = this.state.almostClicked
          this.setStates(almost)
        }
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
        if(this.state.refinedRecipeList.length === 0 && this.state.noMoreKeywords){
          console.log("Re-jig search here if only a few results??")
        }
    }
  }

  switchAlmost(state){
    if(this.state.apiError === false){
      this.setState({
        searchPaused: true,
        changeTabs: true,
        almostClicked: state,
        saveStopwatchTriggered: true,
        stopwatchRunnning: true
      })
    }else{
      this.setState({
        changeTabs: true,
        almostClicked: state,
      })
    }
  }

  setStates(option){
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
      this.setState({
        showAlmost: option,
        changeTabs: false,
        searchPaused: false,
        almostClicked: false
      })
    }
  }

  sevenSecondStopwatch(){
    console.log("starting 7 second stopwatch")
    var cmponent = this
    setTimeout(function(){
        console.log("7 second stopwatch finished")
        cmponent.setState({
          saveStopwatchTriggered: false,
          stopwatchRunning: false,
        })
      }, 7000)
  }

  eightSecondStopwatch(){
    console.log("starting 8 second pause stopwatch")
    var cmponent = this
    setTimeout(function(){
        console.log("8 second pause stopwatch finished")
      }, 8000)
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
          tryAgain: false,
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
          tryAgain: false,
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
       var this_index = this.state.recipeClicked
       var indexes = this.state.savedRecipeIndexes
       if(this.state.recipeClicked !== ''){
         indexes.push(this_index)
       }
       try {
           var res = this.saveDeviceData(key,data)
           .then(res => {
             this.setState({
               saved: true,
               savedRecipes: data,
               searchPaused: false,
               pauseAndSave: false,
               recipeClicked: '',
               savedRecipeIndexes: indexes
             })
           })
           console.log("RECIPE SAVED")
       } catch (e) {
           console.log("ApiCalls: Error saving in saveData: " + e)
       }
  }

  saveRecipe(recipe,index,url_list=0,saved_recipes_info=0){
    console.log("saveRecipe function")
    console.log("recipe[0]: " + recipe[0])
    var almosts_urls = this.state.almostsUrlList
    var almosts_info = this.state.almostsSavedRecipeInfo
    if(url_list !== 0){
      almosts_urls = url_list
      almosts_info = saved_recipes_info
    }
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
      recipeClicked: index,
      recipesToSave: saved_list,
      searchPaused: true,
      pauseAndSave: true,
      stopwatchRunning: true,
      saveStopwatchTriggered: true,
      almostsSavedRecipeInfo: almosts_info,
      almostsUrlList: almosts_urls
    })
  }

// Calls first api 10 times (allowance is 10 hits per minute),
//  collects 200 recipe apis (if that many are returned):
  apiCall(){
    console.log("calling APIs")
    var keywords = this.state.searchKeywords
    var time = this.state.initialData.time
    var ingr = this.state.initialData.ingredientCount + 1
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
      tryAgain: true,
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
      ////////// Button at end of results giving option to extend search (knocks another ingredient off)
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

 checkForDuplicates(recipes,which){
   console.log("Duplicate check")
   if(which === 'rel'){
      var current = this.state.refinedRecipeList
   }else{
     var current = this.state.almostList
   }
   var indexes_to_splice = []
   var recipe
   // Checks that new recipe links aren't already in almosts/refined (from previous response pages):
   for(recipe in recipes){
       console.log("recipes[recipe][1]: " + recipes[recipe][1])
       var result
       for(result in current){
           if(recipes[recipe][1] === current[result][1]){
               console.log("Link already listed")
               var this_recipe = recipes[recipe]
               var ind = recipes.indexOf(this_recipe)
               indexes_to_splice.push(ind)
           }
       }
   }
   if(indexes_to_splice.length>0){
       var ind = indexes_to_splice.length-1
       var it
       for(it=ind;it>=0;it--){
         var to_splice = indexes_to_splice[it]
         recipes.splice(to_splice,1)
       }
   }
   var x
   for(x in recipes){
     current.push(recipes[x])
   }
   return current
}

// Takes in the final list of relevant recipes returned
//  from RefineResults component, saves to state:
  getRelevantRecipes(relevant_recipes,almost_recipes,substitutes_dict){
    console.log("filtered initial")
    console.log("relevant_recipes.length: " + relevant_recipes.length)
    var relevants = this.checkForDuplicates(relevant_recipes,'rel')
    var almosts = this.checkForDuplicates(almost_recipes,'almost')
    var subs = this.state.substitutesDict
    console.log("substitutes_dict: " + substitutes_dict)
    var x
    for(x in substitutes_dict){
      console.log("x: " + substitutes_dict[x])
    }
    // console.log("initial subs length: " + subs.length)
    for([key,value] of Object.entries(substitutes_dict)){
      subs[`${key}`] = value
      console.log("Key: " + key)
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~value: " + value)
    }
    // console.log("subs length now: " + subs.length)
    if(relevant_recipes.length === 0){
      console.log("No relevant results on these pages")
    }else{
      console.log("found relevant results")
    }
    this.setState({
      fResponse: [],
      refinedRecipeList: relevants,
      almostList: almosts,
      substitutesDict: subs,
      startRefine: false,
    })
  }

  pauseSearch(){
    var new_state = !(this.state.searchPaused)
    this.setState({
      searchPaused: new_state
    })
  }

  animationOver(state){
    console.log("animation over")
  }


  render(){
    console.log("Api component rendered")
    var self = this
    var alter_or_reorder_keywords = this.state.reduceKeywords
    var api_error = this.state.apiError
    var response = this.state.fResponse
    var filtering = false
    if(this.state.noMorePages === false && this.state.nextCall === false){
      filtering = true
    }
    var start_refine = this.state.startRefine
    var final_results = this.state.finalResults
    var paused = this.state.searchPaused
    var save_paused = this.state.pauseAndSave
    var recipe_clicked = this.state.recipeClicked
    var no_more_keywords = this.state.noMoreKeywords
    var saved_indexes = this.state.savedRecipeIndexes
    var almost_tab = this.state.showAlmost
    var results = false
    if(this.state.refinedRecipeList.length > 0 || this.state.almostList.length > 0){
      results = true
    }
    var show_searching = false
    if(this.state.tryAgain === true || results === false && no_more_keywords === false && api_error === false){
      show_searching = true
    }
    var changing_tabs = this.state.changeTabs
    var subs = this.state.substitutesDict

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
                      <ScrollView style={{marginBottom:40}}>
                          <View style={{alignItems:"center"}}>
                                 <Text style={{fontSize:18,fontWeight:"bold",marginBottom:10}}>Sorry, there was an error!</Text>

                                 <Pressable style={{justifyContent:"center"}} onPress={this.tryAgain}>
                                      <Text style={styles.greenButton}>Try again</Text>
                                 </Pressable>
                                 <Link accessible={true} accessibilityLabel= "An error occurred"
                                   accessibilityHint="Click button to report the error and try again"
                                   to="/" accessibilityRole="button" underlayColor="transparent">
                                     <Text style={styles.greenButton}>Report and go back to homepage</Text>
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

                   { show_searching &&
                     <SafeAreaView style={styles.container}>
                       <ScrollView>
                         <View style={styles.container}>
                             <View style={{justifyContent:"center"}}>
                                <SearchingPageAnimation />
                             </View>
                             <View style={{justifyContent:"center",alignItems:"center"}}>
                                 <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                   style={{marginTop:500,alignSelf:"flex-end"}} to="/" underlayColor="transparent">
                                     <Text style={styles.redButton}>Cancel search and start again</Text>
                                 </Link>
                             </View>
                         </View>
                       </ScrollView>
                     </SafeAreaView>
                   }


                   { almost_tab === false && this.state.tryAgain === false &&

                       <View>

                           { this.state.refinedRecipeList.length === 0 && no_more_keywords &&
                             <SafeAreaView style={styles.container}>
                               <ScrollView>
                                 <View>
                                     <View style={{textAlign:"center",justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{fontWeight:"bold"}}>No recipe matches found, sorry!</Text>
                                        <Text style={{fontWeight:"bold",marginBottom:20}}>Check 'Almost!' tab for possible alternatives</Text>
                                        <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                          style={styles.blueBackToHomepageButton} to="/" underlayColor="transparent">
                                            <Text>Back to homepage</Text>
                                        </Link>
                                     </View>
                                 </View>
                               </ScrollView>
                             </SafeAreaView>
                           }

                           { results && this.state.noMorePages && this.state.tryAgain === false &&
                             <SafeAreaView style={styles.container}>
                               <ScrollView>
                                   <View style={{display:"flex"}}>
                                           <View style={{flexDirection:"row",}}>
                                               <Text style={styles.mainTitleTabLeft}>Your results</Text>
                                               <Pressable accessible={true} accessibilityLabel="Back to recipe matches" accessibilityRole="button"
                                                 style={{textAlign:"center",marginLeft:30}}
                                                 underlayColor="transparent" onPress={()=> self.switchAlmost(true)}>
                                                   <Text style={styles.blueButton}>Almost!</Text>
                                               </Pressable>
                                           </View>
                                           { changing_tabs &&
                                               <View>
                                                    <ChangingTabsAnimation />
                                               </View>
                                           }
                                           <View>
                                                 { this.state.refinedRecipeList.map(function(item,index){
                                                    return(
                                                         <View style={styles.container} key={index}>
                                                              <View style={{justifyContent:"center",alignItems:"center"}}>

                                                                         <Text accessible={true} accessibilityRole="text"
                                                                           accessibilityLabel={item[0].toString()}
                                                                           style={{justifyContent:"center",fontSize:18,fontWeight:"bold",
                                                                           textAlign:"center",marginBottom:10}}>{item[0]}</Text>

                                                                           { Object.entries(subs).map(function(entry,i) {
                                                                               return(
                                                                                     <View key={i}>
                                                                                        {entry[0] === item[1] &&
                                                                                          <View>
                                                                                              {entry[1].map(function(substitute,it) {
                                                                                                  return(
                                                                                                     <View key={it}>
                                                                                                     { substitute[3] &&
                                                                                                         <Text style={{textAlign:"center",marginBottom:5}}>Substitution made? {substitute[3].toString()}: Your ingredient {substitute[2]} could possibly be used in place of {substitute[0]}*</Text>
                                                                                                     }
                                                                                                     </View>
                                                                                                   )
                                                                                                })
                                                                                              }
                                                                                          </View>
                                                                                        }
                                                                                     </View>
                                                                               )
                                                                             })
                                                                           }

                                                                         <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${item[1]}`)}>
                                                                           <Text accessible={true} accessibilityLabel="!!!!! Go to recipe website" accessibilityRole="link"
                                                                             style={styles.greenButton}>Go to recipe website</Text>
                                                                         </Pressable>

                                                                         { !(saved_indexes.includes(index)) &&
                                                                           <Pressable style={{justifyContent:"center"}} onPress={() => self.saveRecipe(item,index)}>
                                                                              <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                                                accessibilityRole="button" style={styles.greenButton}>Save recipe</Text>
                                                                           </Pressable>
                                                                         }
                                                                         { saved_indexes.includes(index) &&
                                                                           <Pressable style={{justifyContent:"center"}}>
                                                                              <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                                                accessibilityRole="button" style={styles.redButton}>Recipe saved</Text>
                                                                           </Pressable>
                                                                         }

                                                               </View>
                                                          </View>
                                                       )
                                                     }
                                                 )}
                                           </View>
                                           <View style={{justifyContent:"center",alignItems:"center"}}>
                                               <Link accessible={true} accessibilityLabel= "Start again"
                                                   accessibilityHint="Click button to go back to homepage"
                                                   style={{marginTop:90,marginBottom:40}}
                                                   to="/" accessibilityRole="button" underlayColor="transparent">
                                                     <Text style={styles.blueButton}>Start again</Text>
                                               </Link>
                                           </View>
                                     </View>
                                   </ScrollView>
                                 </SafeAreaView>
                           }

                           { results && paused === false && this.state.tryAgain === false &&
                                     <View style={{display:"flex"}}>
                                             <View style={{flexDirection:"row",}}>
                                                 <Text style={styles.mainTitleTabLeft}>Your results</Text>
                                                 <Pressable accessible={true} accessibilityLabel="Back to recipe matches" accessibilityRole="button"
                                                   style={{textAlign:"center",marginLeft:30}}
                                                   underlayColor="transparent" onPress={()=> self.switchAlmost(true)}>
                                                     <Text style={styles.blueButton}>Almost!</Text>
                                                 </Pressable>
                                             </View>
                                             { changing_tabs &&
                                                 <View>
                                                      <ChangingTabsAnimation />
                                                 </View>
                                             }
                                             <View>
                                                   {this.state.refinedRecipeList.map(function(item,index){
                                                      return(
                                                        <View style={styles.container} key={index}>
                                                             <View style={{justifyContent:"center",alignItems:"center"}}>

                                                                         <Text accessible={true} accessibilityRole="text"
                                                                           accessibilityLabel={item[0].toString()}
                                                                           style={{justifyContent:"center",fontSize:18,fontWeight:'bold',
                                                                           textAlign:"center",marginBottom:10}}>{item[0]}</Text>

                                                                           { Object.entries(subs).map(function(entry,i) {
                                                                               return(
                                                                                     <View key={i}>
                                                                                        {entry[0] === item[1] &&
                                                                                          <View>
                                                                                              {entry[1].map(function(substitute,it) {
                                                                                                  return(
                                                                                                     <View key={it}>
                                                                                                      { substitute[3] &&
                                                                                                         <Text style={{textAlign:"center",marginBottom:5}}>Substitution made? {substitute[3].toString()}: Your ingredient {substitute[2]} could possibly be used in place of {substitute[0]}*</Text>
                                                                                                      }
                                                                                                     </View>
                                                                                                   )
                                                                                                })
                                                                                              }
                                                                                          </View>
                                                                                        }
                                                                                     </View>
                                                                               )
                                                                             })
                                                                           }


                                                                         <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${item[1]}`)}>
                                                                           <Text accessible={true} accessibilityLabel="!!!!! Go to recipe website" accessibilityRole="link"
                                                                             style={styles.greenButton}>Go to recipe website</Text>
                                                                         </Pressable>

                                                                         { !(saved_indexes.includes(index)) &&
                                                                           <Pressable style={{justifyContent:"center"}} onPress={() => self.saveRecipe(item,index)}>
                                                                              <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                                                accessibilityRole="button" style={styles.greenButton}>Save recipe</Text>
                                                                           </Pressable>
                                                                         }
                                                                         { saved_indexes.includes(index) &&
                                                                           <Pressable style={{justifyContent:"center"}}>
                                                                              <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                                                accessibilityRole="button" style={styles.redButton}>Recipe saved</Text>
                                                                           </Pressable>
                                                                         }

                                                                </View>
                                                          </View>
                                                         )
                                                       }
                                                    )}
                                               </View>
                                               { filtering && api_error === false &&
                                                   <View style={{justifyContent:"center",alignItems:"center"}}>
                                                      <FilteringAnimation />
                                                   </View>
                                               }
                                               { filtering === false &&
                                                   <View style={{justifyContent:"center",alignItems:"center"}}>
                                                      <Text>Search finished.</Text>
                                                   </View>
                                               }

                                               <View style={{justifyContent:"center",alignItems:"center"}}>
                                                   <Pressable accessible={true} accessibilityLabel="pause search" accessibilityRole="button"
                                                     style={{marginTop:90}} underlayColor="transparent" onPress={() => self.pauseSearch() }>
                                                       <Text style={styles.blueButton}>Pause search</Text>
                                                   </Pressable>
                                               </View>
                                               <View style={{justifyContent:"center",alignItems:"center"}}>
                                                   <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                     style={{marginTop:90,marginBottom:40}} to="/pantry/" underlayColor="transparent">
                                                       <Text style={styles.redButton}>Cancel search and start again</Text>
                                                   </Link>
                                               </View>
                                       </View>

                            }

                            { results && paused && this.state.tryAgain === false &&

                                        <View style={{display:"flex"}}>
                                                <View style={{flexDirection:"row",}}>
                                                    <Text style={styles.mainTitleTabLeft}>Your results</Text>
                                                    <Pressable accessible={true} accessibilityLabel="Back to recipe matches" accessibilityRole="button"
                                                      style={{textAlign:"center",marginLeft:30}}
                                                      underlayColor="transparent" onPress={()=> self.switchAlmost(true)}>
                                                        <Text style={styles.blueButton}>Almost!</Text>
                                                    </Pressable>
                                                </View>
                                                { changing_tabs &&
                                                    <View>
                                                       <ChangingTabsAnimation />
                                                    </View>
                                                }
                                                <View>
                                                      {this.state.refinedRecipeList.map(function(item,index){
                                                         return(
                                                           <View style={styles.container} key={index}>
                                                                <View style={{justifyContent:"center",alignItems:"center"}}>

                                                                            <Text accessible={true} accessibilityRole="text"
                                                                              accessibilityLabel={item[0].toString()}
                                                                              style={{justifyContent:"center",fontSize:18,fontWeight:'bold',
                                                                              textAlign:"center",marginBottom:10}}>{item[0]}</Text>

                                                                              { Object.entries(subs).map(function(entry,i) {
                                                                                  return(
                                                                                        <View key={i}>
                                                                                           {entry[0] === item[1] &&
                                                                                             <View>
                                                                                                 {entry[1].map(function(substitute,it) {
                                                                                                     return(
                                                                                                        <View key={it}>
                                                                                                          { substitute[3] &&
                                                                                                            <Text style={{textAlign:"center",marginBottom:5}}>Substitution made? {substitute[3].toString()}: Your ingredient {substitute[2]} could possibly be used in place of {substitute[0]}*</Text>
                                                                                                          }
                                                                                                        </View>
                                                                                                      )
                                                                                                   })
                                                                                                 }
                                                                                             </View>
                                                                                           }
                                                                                        </View>
                                                                                  )
                                                                                })
                                                                              }

                                                                            <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${item[1]}`)}>
                                                                              <Text accessible={true} accessibilityLabel="!!!!! Go to recipe website" accessibilityRole="link"
                                                                                style={styles.greenButton}>Go to recipe website</Text>
                                                                            </Pressable>

                                                                            { !(saved_indexes.includes(index)) &&
                                                                              <Pressable style={{justifyContent:"center"}} onPress={() => self.saveRecipe(item,index)}>
                                                                                 <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                                                   accessibilityRole="button" style={styles.greenButton}>Save recipe</Text>
                                                                              </Pressable>
                                                                            }
                                                                            { saved_indexes.includes(index) &&
                                                                              <Pressable style={{justifyContent:"center"}}>
                                                                                 <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                                                   accessibilityRole="button" style={styles.redButton}>Recipe saved</Text>
                                                                              </Pressable>
                                                                            }

                                                                   </View>

                                                                   { save_paused && recipe_clicked === index &&
                                                                       < SavingRecipeAnimation />
                                                                   }

                                                             </View>
                                                            )
                                                          }
                                                       )}
                                                  </View>

                                                  { save_paused === false && this.state.changeTabs === false &&
                                                      <View style={{justifyContent:"center",alignItems:"center"}}>
                                                          <Pressable accessible={true} accessibilityLabel="pause search" accessibilityRole="button"
                                                            style={{marginTop:90}} underlayColor="transparent" onPress={() => self.pauseSearch() }>
                                                              <Text style={styles.blueButton}>Unpause</Text>
                                                          </Pressable>
                                                      </View>
                                                  }

                                                  <View style={{justifyContent:"center",alignItems:"center"}}>
                                                      <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                        style={{marginTop:90,marginBottom:40}} to="/" underlayColor="transparent">
                                                          <Text style={styles.redButton}>Cancel search and start again</Text>
                                                      </Link>
                                                  </View>
                                          </View>

                            }
                            <View>
                                <Text style={{textAlign:"center",marginBottom:5}}>* Some suggested substitutions may not be appropriate - please research whether required
                                        quantities/cooking methods/times will differ for any suggested replacement ingredients. </Text>
                            </View>
                        </View>

                    }

                    { almost_tab && this.state.tryAgain === false &&
                        <View>
                            <View style={{display:"flex"}}>
                                <View style={{flexDirection:"row",}}>
                                    <Pressable accessible={true} accessibilityLabel="Back to recipe matches" accessibilityRole="button"
                                      style={{textAlign:"center",marginRight:30,marginLeft:10}} underlayColor="transparent" onPress={()=> self.switchAlmost(false)}>
                                        <Text style={styles.blueButton}>Full matches</Text>
                                    </Pressable>
                                    <Text style={styles.mainTitleTabRight}>Almost!</Text>
                                </View>
                                <View style={{alignItems:"center"}}>
                                    <Text style={{textAlign:"center",fontWeight:"bold"}}>Only one ingredient away from these recipes!:</Text>
                                    { changing_tabs &&
                                        <View>
                                             <ChangingTabsAnimation />
                                        </View>
                                    }
                                    < AlmostList
                                      almosts={this.state.almostList}
                                      substitutes={this.state.substitutesDict}
                                      newRecipeToSave={this.saveRecipe}
                                      saved_recipes_info={this.state.almostsSavedRecipeInfo}
                                      url_list={this.state.almostsUrlList} />
                                </View>
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
  mainTitleTabLeft: {
    fontSize:28,
    marginBottom:10,
    marginLeft: 50,
    textAlign:"center",
  },
  mainTitleTabRight: {
    fontSize:28,
    marginBottom:10,
    marginRight: 40,
    textAlign:"center",
  },
  blueBackToHomepageButton: {
    padding: 10,
    marginTop: 5,
    minWidth: 100,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
  },
});
