import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';



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
        "searchMethod": ''
      },
      both: false,
      moreNeeded: true,
      confirmed: false,
      populate: false,
      ingredients_rough: {},
      pantry: [],
      favourites: [],
      getFaves: false,
      updateFaves: false,
      redirect: false,
      readyToRedirect: false,
      noIngredientsError: false,
      times: '',
      fiveIngredients: [],
      fiveChosen: false,
      fiveConfirmed: false
    }
    this.abortController = new AbortController()
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.confirmIngredients = this.confirmIngredients.bind(this)
    this.populateInitialData = this.populateInitialData.bind(this)
    this.updateFavourites = this.updateFavourites.bind(this)
    this.fiveConfirmedChanged = this.fiveConfirmedChanged.bind(this)
    this.ingredientCheck = this.ingredientCheck.bind(this)

    this.saveDeviceData = this.saveDeviceData.bind(this)
    this.getDeviceData = this.getDeviceData.bind(this)
    this.getData = this.getData.bind(this)
    this.saveData = this.saveData.bind(this)

    this.redirectIsReady = this.redirectIsReady.bind(this)

  };

  saveDeviceData = async ( key, data ) => {
        console.log("confirm d")
        try {
            console.log("confirm e")
            await AsyncStorage.setItem(key, JSON.stringify(data))
        }
        catch (e) {
            console.log(`ConfirmList: Error in saveDeviceData, saving data for key ${key}: `, data);
            throw e;
        }
  }

  getDeviceData = async (key) => {
       console.log("confirm f")
       try {
            console.log("confirm g")
            var data = await AsyncStorage.getItem(key)
            if(data !== null) {
                var value = JSON.parse(data)
                console.log("value: " + value)
                console.log("111111111111111")
            }else{
                console.log("0000000000000000")
                var value = 'no favourites yet'
            }
            return value;
        }
        catch(e) {
            console.log("ConfirmList: Error reading data for favourites in getDeviceData: " + e);
        }
  }

  saveData(key,data){
       try {
           this.saveDeviceData(key,data);
           console.log("SAVED")
       } catch (e) {
           console.log("ConfirmList: Error saving in saveData: " + e)
       }
  }

  getData(key){
      try {
          var my_data = this.getDeviceData(key);
          console.log("RETRIEVED")
          return my_data
      } catch (e) {
          console.log("ConfirmList: Error getting data in getData: " + e)
          return 0
      }
  }


  componentDidMount(){
    console.log("Confirm page mounted")
    var initial_data = this.props.location.state.initial_data
    var ingreds = this.props.location.state.ingreds
    for([key,value] of Object.entries(ingreds)){
      console.log(key + ": " + value)
      value.sort()
      console.log("SORTED: " + key + ": " + value)
    }
    var either = this.props.location.state.either
    var more_needed = this.props.location.state.more_needed
    var favourites_key = '@favourite-ingredients'
    var faves = this.getData(favourites_key)
    .then(faves => {
        this.setState({
           favourites: faves
         })
     })
    .catch(error => {
        console.log("ConfirmList: getfavourites error: " + error.message)
    })

    if(initial_data.time === '0'){
      var times_from_start_page = this.props.location.state.times
      this.setState({
        initialData: initial_data,
        ingredients_rough: ingreds,
        both: either,
        moreNeeded: more_needed,
        times: times_from_start_page
      })
    }else if(more_needed === undefined){
      this.setState({
        initialData: initial_data,
        ingredients_rough: ingreds,
        both: either
      })
    }else{
      this.setState({
        initialData: initial_data,
        ingredients_rough: ingreds,
        both: either,
        moreNeeded: more_needed
      })
    }
  }

  componentWillUnmount(){
    console.log("Confirm page unmounted")
    this.setState({
      updateFaves: false,
      readyToRedirect: false
    })
    this.abortController.abort()
  }

  componentDidUpdate(){
    console.log("Confirm page updated")
    console.log("this.state.initialData.time: " + this.state.initialData.time)
    console.log("~~~~this.state.initialData.searchMethod: " + this.state.initialData.searchMethod)
    if(this.state.initialData.time === '0'){
      var hrs = parseInt(this.state.times.hours)
      var mins = parseInt(this.state.times.mins)
      var added = hrs + mins
      var sum = added.toString()
      this.setState({
        initialData: {
          ...this.state.initialData,
          time:sum
        }
      })
    }
    if(this.state.populate){
      console.log("confirm a")
      this.populateInitialData()
    }
    if(this.state.updateFaves){
      console.log("confirm c")
      this.updateFavourites()
    }
    if(this.state.redirect){
      console.log("redirect function triggered")
      this.redirectIsReady()
    }
  }

  redirectIsReady(){
    console.log("REDIRECTING NOW")
    this.setState({
       redirect: false,
       populate: false,
       updateFaves: false,
       readyToRedirect: true
    })
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
    var original_pantry = []

    // Makes sure that any ingredients already in pantry at beginning
    //  that may have been added again by user are only included once
    //  in final ingredients:
    for([key,value] of Object.entries(rough)){
        console.log("key: " + key)
        var title = key
        console.log("value: " + value)
        if(key === 'Already in pantry'){
          console.log("confirm j")
          original_pantry.push(rough[key])
          original_pantry = original_pantry.flat()
          final.push(rough[key])
        }else{
          console.log("confirm k")
          if(original_pantry.length > 0 ){
            console.log("confirm l")
            var list = rough[key]
            console.log("list: " + list)
            // console.log("list.length: " + list.length)
            var x
            for(x in list){
                  console.log("confirm m")
                  if(original_pantry.includes(list[x])){
                      console.log("confirm n")
                      var gone = rough[key].splice(x,1)
                      console.log("gone: " + gone)
                  }else{
                      console.log(rough[key][x] + " not found in pantry")
                  }
             }
          }
          console.log("confirm o")
          final.push(rough[key])
        }
    }

    final = final.flat()

    if(final.length === 0){
      console.log("confirm p")
      this.setState({
        noIngredientsError: true,
        populate: false,
      })
      return 0;           // Triggered if no ingredients are entered (thus rendering error screen)
    }
    console.log("confirm q")
    this.setState({
      initialData: {
        ...this.state.initialData,
        ingredients: final,
        ingredientCount: final.length
      },
      pantry: final,
      updateFaves: true,
      populate: false,
    })
    console.log("confirm r")
  }

// Updates user's favourites with new confirmed list via
//  saveDeviceData method, triggers redirect to ApiCalls:
  updateFavourites(){
    var faves = this.state.favourites
    console.log("typeof(faves): " + typeof(faves))
    if(faves === 'no favourites yet'){
      var favs = []
    }
    else{
      var favs = faves
    }
    for(x in favs){
      console.log("1. FAVES[x]: " + faves[x])
    }
    var list = this.state.pantry
    for(x in list){
      console.log("1. PANTRY[x]: " + list[x])
    }
    var i
    var length = list.length
    for(i=0;i<length;i++){
      // console.log("confirm t")
      if( !(favs.includes(list[i])) ){
        console.log("confirm u")
        favs.push(list[i])
      }
    }
    for(x in favs){
      console.log("2. FAVS[x]: " + favs[x])
    }
    console.log("confirm v")

    var favourites_key = '@favourite-ingredients'
    var pantry_key = '@pantry-ingredients'

    var favourites_saved = this.saveData(favourites_key,favs)
    var pantry_saved = this.saveData(pantry_key,list)

    console.log("confirm w")
    this.setState({
      updateFaves: false,
      redirect: true,
    })
    console.log("confirm x")
  }

  // Triggers when 'back' button is clicked (to re-select five ingredients):
    fiveConfirmedChanged(status){
      console.log("FIVE CONFIRMED?: " + this.state.fiveConfirmed)
      if(status==="back"){
        console.log("Five confirmed now false")
        this.setState({
          fiveConfirmed: false
        })
      }else{
        var changed_state = !(this.state.fiveConfirmed)
        console.log("----CHANGED STATE (five confirmed?): " + changed_state)
        this.setState({
          fiveConfirmed: changed_state
        })
      }
    }

    ingredientCheck(ingredient){
      console.log("INGREDIENT: " + ingredient)
      var add = true
      var j
      for(j in this.state.fiveIngredients){
        console.log(j + ". " + this.state.fiveIngredients[j])
      }
      if(this.state.fiveIngredients.includes(ingredient)){
          add = false
          console.log("INGREDIENT ALREADY IN LIST!: " + ingredient)
          var i
          for(i in this.state.fiveIngredients){
            if(this.state.fiveIngredients[i] === ingredient){
              var five = this.state.fiveIngredients
              five.splice(i,1)
              this.setState({
                fiveIngredients: five,
                fiveChosen: false
              })
            }
          }
          console.log("this.state.fiveChosen: " + this.state.fiveChosen)
          return;
      }
      console.log("ADD IS TRUE!")
      if(this.state.fiveIngredients.length === 4){
          console.log("LENGTH IS 4!!!!!!!!!")
          this.setState({
            fiveIngredients: [
              ...this.state.fiveIngredients,
              ingredient
            ],
            fiveChosen: true
          })
      }else{
          console.log("!!!!!!!!LENGTH IS NOT 4!!!!!!!!!")
          this.setState({
            fiveIngredients: [
              ...this.state.fiveIngredients,
              ingredient
            ],
            fiveChosen: false
          })
      }
      console.log("**this.state.fiveChosen: " + this.state.fiveChosen)
    }


  render(){
    console.log("Confirm page rendered")
    console.log("**this.state.fiveChosen: " + this.state.fiveChosen)
    var initial = this.state.initialData
    var either = this.state.both
    var ingreds = this.state.ingredients_rough
    var redirect = this.state.readyToRedirect
    var more_needed = this.state.moreNeeded
    var self = this
    var five_ingredients = this.state.fiveIngredients
    console.log("five_ingredients.length: " + five_ingredients.length)
    var a
    console.log("RENDER 5 INGREDIENTS:")
    for(a in five_ingredients){
      console.log(a + ". " + five_ingredients[a])
    }

    return(

      <SafeAreaView style={styles.container}>
        <ScrollView>

              <View>
                     {this.state.noIngredientsError === false && ingreds !== undefined && initial.searchMethod !== "user's choice" &&

                          <View style={styles.container}>

                              <Text accessible={true} accessibilityLabel="Confirm your ingredients here, or click go back to edit them."
                                accessibilityRole="text" style={styles.mainTitle}>Confirm pantry ingredients</Text>

                              {Object.entries(ingreds).map(function(item,index){
                                  return(
                                      <View key={index} style={{ alignItems:"center", marginBottom:10 }}>
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

                              { more_needed &&
                                  <Link to={{pathname:"/both-alcohol/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                                    underlayColor="transparent">
                                      <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                        style={styles.blueButton}>Back</Text>
                                  </Link>
                              }

                              { more_needed === false &&
                                  <Link to={{pathname:"/type-time/", state:{ initial_data: initial, either: either, ingreds: ingreds, more_needed: more_needed } }}
                                    underlayColor="transparent">
                                      <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                        style={styles.blueButton}>Back</Text>
                                  </Link>
                              }

                              { redirect === true && <Redirect to={{ pathname:'/api-calls/',
                                state:{ initial_data: initial, either: either,
                                        ingreds: ingreds, five_keywords: five_ingredients } }} />
                              }

                           </View>
                      }


                      {this.state.noIngredientsError === false && ingreds !== undefined &&
                        initial.searchMethod === "user's choice" && this.state.fiveConfirmed &&

                           <View style={styles.container}>

                               <Text accessible={true} accessibilityLabel="Confirm your ingredients here, or click go back to edit them."
                                 accessibilityRole="text" style={styles.mainTitle}>Confirm pantry ingredients</Text>

                                {Object.entries(ingreds).map(function(item,index){
                                    return(
                                       <View key={index} style={{ alignItems:"center", marginBottom:10 }}>
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


                               <Pressable onPress={() => self.fiveConfirmedChanged("back")}>
                                   <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                     style={styles.blueButton}>Back</Text>
                               </Pressable>


                               { redirect === true && <Redirect to={{ pathname:'/api-calls/',
                                 state:{ initial_data: initial, either: either,
                                         ingreds: ingreds, five_keywords: five_ingredients, } }} />
                               }

                            </View>
                       }


                       {initial.searchMethod === "user's choice" &&

                            <View>

                                 {this.state.fiveChosen && this.state.fiveConfirmed === false &&

                                   <View style={styles.container}>

                                        <Text accessible={true} accessibilityLabel="Select your five search focus ingredients here"
                                          accessibilityRole="text" style={styles.mainTitle}>Select five search focus ingredients</Text>

                                                 {Object.entries(ingreds).map(function(item,index){
                                                     return(
                                                        <View key={index} style={{ alignItems:"center", marginBottom:10 }}>
                                                            {item[1].map(function(ingredient,ind){
                                                              return(
                                                                  <View key={ind} style={{ alignItems:"center", paddingVertical:10 }}>
                                                                    { five_ingredients.includes(ingredient) &&
                                                                      <View>
                                                                          <Text accessible={true} accessibilityLabel={ingredient} accessibilityRole="text"
                                                                             >{ingredient}     </Text>
                                                                          <Pressable onPress={() => self.ingredientCheck(ingredient)}>
                                                                             <Text><Icon name="check-square-o" size={20} color="black" /></Text>
                                                                          </Pressable>
                                                                      </View>
                                                                    }
                                                                    { !(five_ingredients.includes(ingredient)) &&
                                                                      <View>
                                                                          <Text accessible={true} accessibilityLabel={ingredient} accessibilityRole="text"
                                                                             >{ingredient}      </Text>
                                                                          <Pressable disabled={true}>
                                                                             <Text><Icon name="square-o" size={20} color="black" /></Text>
                                                                          </Pressable>
                                                                      </View>
                                                                    }
                                                                  </View>
                                                                )
                                                              })
                                                            }
                                                        </View>
                                                      )
                                                    }
                                                 )}
                                                 <Pressable onPress={() => self.fiveConfirmedChanged("0")}>
                                                     <Text accessible={true} accessibilityLabel="Confirm five" accessibilityRole="button"
                                                      style={styles.blueButton}>Confirm five</Text>
                                                 </Pressable>
                                                 { more_needed &&
                                                      <Link to={{pathname:"/both-alcohol/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                                                        underlayColor="transparent">
                                                          <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                            style={styles.blueButton}>Back</Text>
                                                      </Link>
                                                 }

                                                 { more_needed === false &&
                                                      <Link to={{pathname:"/type-time/", state:{ initial_data: initial, either: either, ingreds: ingreds, more_needed: more_needed } }}
                                                        underlayColor="transparent">
                                                          <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                            style={styles.blueButton}>Back</Text>
                                                      </Link>
                                                 }
                                        </View>
                                 }

                                 {this.state.fiveChosen === false &&

                                   <View style={styles.container}>

                                           <Text accessible={true} accessibilityLabel="Select your five search focus ingredients here"
                                              accessibilityRole="text" style={styles.mainTitle}>Select five search focus ingredients</Text>

                                           {Object.entries(ingreds).map(function(item,index){
                                               return(
                                                  <View key={index} style={{ justifyContent:"center", marginBottom:10 }}>
                                                      {item[1].map(function(ingredient,ind){
                                                        return(
                                                                <View key={ind} style={{ alignItems:"center", paddingVertical:10 }}>
                                                                  { five_ingredients.includes(ingredient) &&
                                                                    <View>
                                                                        <Text accessible={true} accessibilityLabel={ingredient} accessibilityRole="text"
                                                                           >{ingredient}     </Text>
                                                                        <Pressable onPress={() => self.ingredientCheck(ingredient)}>
                                                                           <Text><Icon name="check-square-o" size={20} color="black" /></Text>
                                                                        </Pressable>
                                                                    </View>
                                                                  }
                                                                  { !(five_ingredients.includes(ingredient)) &&
                                                                    <View>
                                                                        <Text accessible={true} accessibilityLabel={ingredient} accessibilityRole="text"
                                                                           >{ingredient}       </Text>
                                                                        <Pressable onPress={() => self.ingredientCheck(ingredient)}>
                                                                             <Text><Icon name="square-o" size={20} color="black" /></Text>
                                                                        </Pressable>
                                                                    </View>
                                                                  }
                                                                </View>
                                                              )
                                                            }
                                                          )
                                                        }
                                                  </View>
                                                  )
                                                }
                                              )
                                           }
                                           { more_needed &&
                                                <Link to={{pathname:"/both-alcohol/", state:{ initial_data: initial, either: either, ingreds: ingreds } }}
                                                  underlayColor="transparent">
                                                    <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                      style={styles.blueButton}>Back</Text>
                                                </Link>
                                           }

                                           { more_needed === false &&
                                                <Link to={{pathname:"/type-time/", state:{ initial_data: initial, either: either, ingreds: ingreds, more_needed: more_needed } }}
                                                  underlayColor="transparent">
                                                    <Text accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                      style={styles.blueButton}>Back</Text>
                                                </Link>
                                           }
                                   </View>
                                 }




                            </View>

                        }


                        {this.state.noIngredientsError &&

                              <View style={styles.container}>

                                  <Text accessible={true} accessibilityLabel="Error: No ingredients were selected!"
                                    accessibilityRole="text" style={styles.mediTitle}> Error: No ingredients were selected! </Text>

                                  <Link accessible={true} accessibilityLabel= "Start again"
                                    accessibilityHint="Click button to go back to homepage"
                                    to="/" accessibilityRole="button" underlayColor="transparent">
                                      <Text style={styles.blueButton}> Start again </Text>
                                  </Link>

                              </View>

                        }

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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 280,
    paddingVertical: 20,
    paddingRight:20,
    paddingLeft: 30,
  },
  twoColumns: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'nowrap',
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
  redButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'pink',
    textAlign: "center",
    // marginHorizontal: 128,
    // marginTop: 50,
  },
});

export { ConfirmList };
