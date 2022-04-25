import React from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


class HomePage extends React.Component {
      constructor(props){
      super(props);
      this.state = {
        userId: 12345,
        savedRecipeList: [],
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.getDeviceData = this.getDeviceData.bind(this)
  };

  componentDidMount(){
    console.log("Homepage mounted")
    var recipes_key = '@saved-recipes'
    var recipes = this.getDeviceData(recipes_key)
    .then(recipes => {
      this.setState({
        savedRecipeList: recipes,
      })
    })
  }

  componentDidUpdate(){
    console.log("Homepage updated")
    // console.log("this.state.savedRecipeList: " + this.state.savedRecipeList)
  }

  getDeviceData = async (key) => {
       console.log("getting device data")
       try {
            console.log("try")
            var data = await AsyncStorage.getItem(key)
            if(data !== null) {
                var value = JSON.parse(data)
                // console.log("value: " + value)
            }else{
                var value = "@saved-recipes was null"
                // console.log("value: " + value)
            }
            return value;
        }
        catch(e) {
            console.log("SavedRecipesPage: Error reading data for saved recipes in getDeviceData: " + e);
        }
  }

  render(){
      return(
        <View style={styles.container}>

            <Text accessible={true} accessibilityLabel="Welcome to PersonalChef" accessibilityRole="text"
             style={styles.mainTitle}>PersonalChef</Text>

            <TouchableOpacity activeOpacity={1} underlayColor="transparent">
                <Link accessible={true} accessibilityLabel="Find a recipe for your ingredients"
                  accessibilityRole="button" to="/pantry/" underlayColor="transparent" >
                   <Text style={styles.greenButton}>Find a recipe for your ingredients</Text>
                </Link>
            </TouchableOpacity>

            { this.state.savedRecipeList !== "@saved-recipes was null" &&
              <TouchableOpacity activeOpacity={1} underlayColor="transparent">
                  <Link accessible={true} accessibilityLabel="Go to your saved recipes"
                    accessibilityRole="button" to="/saved-recipes/" underlayColor="transparent" >
                     <Text style={styles.greenButton}>Go to your saved recipes</Text>
                  </Link>
              </TouchableOpacity>
            }

        </View>
      );
   }
};





class SearchMethod extends React.Component {
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
        ingredients_rough: {},
        moreNeeded:  false,
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.radioButtonPressedHandler = this.radioButtonPressedHandler.bind(this)
  };

  componentDidMount(){
    console.log("Search method mounted")
    var ingreds = this.props.location.state.ingreds
    var more_needed = this.props.location.state.more_needed
    var initial = this.props.location.state.initial_data
    if(initial !== undefined){
      this.setState({
        initialData: initial,
        ingredients_rough: ingreds,
        moreNeeded: more_needed
      })
    }else{
      this.setState({
        ingredients_rough: ingreds,
        moreNeeded: more_needed
      })
    }
  }

  componentDidUpdate(){
    console.log("Search method updated")
    // console.log("this.state.savedRecipeList: " + this.state.savedRecipeList)
  }

  radioButtonPressedHandler(value){
    this.setState({
        initialData:{
          ...this.state.initialData,
          searchMethod: value
        },
     })
  }

  render(){
      var initial = this.state.initialData
      var ingreds = this.state.ingredients_rough
      var more_needed = this.state.moreNeeded
      var search_type = this.state.initialData.searchMethod
      return(
        <View style={styles.container}>

            <Text accessible={true} accessibilityLabel="Welcome to PersonalChef" accessibilityRole="text"
             style={{marginBottom:30,marginTop:40,textAlign:"center"}}>How would you like us to search for recipes?</Text>

             {search_type === "frequently used" &&
                <TouchableHighlight accessible={true} accessibilityLabel="Most frequently used ingredients selected" accessibilityRole="button"
                   underlayColor="white">
                  <Text style={styles.greenButton}>By most frequently used ingredients</Text>
                </TouchableHighlight>
             }
             {search_type !== "frequently used" &&
                <TouchableHighlight accessible={true} accessibilityLabel="Most frequently used ingredients" accessibilityRole="button"
                   underlayColor="white" onPress={() => this.radioButtonPressedHandler("frequently used")}>
                  <Text style={styles.blueButton}>By most frequently used ingredients</Text>
                </TouchableHighlight>
             }
             {search_type === "most perishable" &&
              <TouchableHighlight accessible={true} accessibilityLabel="Most perishable ingredients selected" accessibilityRole="button"
                 underlayColor="white">
                <Text style={styles.greenButton}>By most perishable ingredients</Text>
              </TouchableHighlight>
              }
              {search_type !== "most perishable" &&
                <TouchableHighlight accessible={true} accessibilityLabel="Most perishable ingredients" accessibilityRole="button"
                   underlayColor="white" onPress={() => this.radioButtonPressedHandler("most perishable")}>
                  <Text style={styles.blueButton}>By most perishable ingredients</Text>
                </TouchableHighlight>
              }
              {search_type === "user's choice" &&
                <TouchableHighlight accessible={true} accessibilityLabel="Choose five ingredients to focus my search on selected" accessibilityRole="button"
                   underlayColor="white" >
                  <Text style={styles.greenButton}>Choose five ingredients to focus my search on</Text>
                </TouchableHighlight>
              }
              {search_type !== "user's choice" &&
                <TouchableHighlight accessible={true} accessibilityLabel="Choose five ingredients to focus my search on " accessibilityRole="button"
                   underlayColor="white" onPress={() => this.radioButtonPressedHandler("user's choice")}>
                  <Text style={styles.blueButton}>Choose five ingredients to focus my search on</Text>
                </TouchableHighlight>
              }

              {search_type !== '' &&
                <Link accessible={true} accessibilityLabel="Go to savoury ingredients" accessibilityRole="button"
                  to={{pathname:"/type-time/", state:{ initial_data: initial, ingreds: ingreds, more_needed: more_needed, } }} underlayColor="transparent" >
                    <Text accessible={true} accessibilityLabel="Go to savoury ingredients"
                      style={styles.greenNextButton}>Next page</Text>
                </Link>
              }
              <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                style={{marginTop:10}} to="/pantry/" underlayColor="transparent">
                  <Text style={styles.backButton}>Back</Text>
              </Link>

        </View>
      );
   }
};







class TimeAndType extends React.Component {
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
      validHoursInput: true,
      validMinutesInput: true,
      validTimes: false,
      finished: true,
      times: {
        "hours": '0',
        "mins": '0'
      },

      ingredients_rough: {},
      moreNeeded:  false,
      firstResponse: [],

      initialRecipeLinkList: [],
      responseList: [],

      refinedRecipeList: [],
    }
    this.radioButtonPressedHandler = this.radioButtonPressedHandler.bind(this)
    this.onChangeTimeHoursHandler = this.onChangeTimeHoursHandler.bind(this)
    this.onChangeTimeMinsHandler = this.onChangeTimeMinsHandler.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
  };

  componentDidMount(){
    console.log("Time and Type did mount")
    var ingreds = this.props.location.state.ingreds
    var more_needed = this.props.location.state.more_needed
    var initial = this.props.location.state.initial_data
    this.setState({
      initialData: initial,
      ingredients_rough: ingreds,
      moreNeeded: more_needed
    })
    var x
    for(x in ingreds){
      console.log("**** ingreds: " + ingreds[x])
    }
  }

  componentWillUnmount(){
    console.log("Time and Type unmounting")
  }

  radioButtonPressedHandler(value){
      if (value === "dessert" || value === "other"){
        this.setState({
            initialData:{
              ...this.state.initialData,
              type: value
            },
            both: false
         })
      }else{
        this.setState({
            initialData:{
              ...this.state.initialData,
              type: "other"
            },
            both: true
         })
       }
   }


  onChangeTimeHoursHandler(h){
      var chars = [ '', '0' ]

      if(isNaN(h)){
        this.setState({
          validHoursInput: false,
          validTimes: false
        });
        return 0;
      }else{
        var hrs = h*60
        this.setState({
          validHoursInput: true,
          times:{
            ...this.state.times,
            hours: hrs
          },
        })
      }

      if(chars.includes(h) && chars.includes(this.state.times.mins)){
        this.setState({
          validTimes: false,
        })
      }else if(this.state.validMinutesInput === false || this.state.validHoursInput === false){
        this.setState({
          validTimes: false,
          finished: false
        })
      }else{
        this.setState({
          validTimes: true,
        })
      }
   }


  onChangeTimeMinsHandler(minutes){
      var chars = [ '', '0' ]

      if(isNaN(minutes)){
        this.setState({
          validMinutesInput: false,
          validTimes: false,
        });
        return 0;
      }else{
        this.setState({
          validMinutesInput: true,
          times: {
            ...this.state.times,
            mins: minutes
          },
        })
      }

      if(chars.includes(minutes) && chars.includes(this.state.times.hours)){
        this.setState({
          validTimes: false,
          times:{
            ...this.state.times,
            mins: minutes
          },
        })
      }else if(this.state.validMinutesInput === false || this.state.validHoursInput === false){
        this.setState({
          validTimes: false,
          finished: false
        })
      }else{
        this.setState({
          validTimes: true,
        })
      }
   }


  componentDidUpdate(){
    console.log("Time and Type did update")
    console.log("more needed: " + this.state.moreNeeded)
    if(this.state.finished === false){
      this.onChangeTimeHoursHandler(this.state.times.hours);
      this.onChangeTimeMinsHandler(this.state.times.mins);
      this.setState({
        finished: true
      })
    }
  }


   render(){
      var recipe_type = this.state.initialData.type
      var initial = this.state.initialData
      var either = this.state.both
      var times = this.state.times
      var ingreds = this.state.ingredients_rough
      var valid = this.state.validTimes
      var more_needed = this.state.moreNeeded
      console.log("this.state.initialData.time: " + this.state.initialData.time)
      console.log("this.state.validTimes: " + this.state.validTimes)
      console.log("this.state.moreNeeded: " + this.state.moreNeeded)

      return(

            <View style={styles.container}>

                <View>

                        <Text accessible={true} accessibilityLabel="How much time do you have?" accessibilityRole="text"
                          style={{marginBottom:20,marginTop:20}}>How much time do you have?</Text>
                        <TextInput
                          style={styles.input}
                          onChangeText={text => this.onChangeTimeHoursHandler(text)}
                          placeholder='0 hours'
                          keyboardType="numeric"
                          accessibilityLabel="hours textbox"
                          accessibilityHint="type number of hours here"
                          accessibilityRole="adjustable"
                        />
                        {this.state.validHoursInput === false && <Text accessible={true} accessibilityLabel="Please enter a number"
                          accessibilityRole="alert" style={styles.red}>Please enter a number</Text>}
                        <TextInput
                          style={styles.input}
                          onChangeText={text => this.onChangeTimeMinsHandler(text)}
                          placeholder='20 minutes'
                          keyboardType="numeric"
                          accessibilityLabel="minutes textbox"
                          accessibilityHint="type number of minutes here"
                          accessibilityRole="adjustable"
                        />
                        {this.state.validMinutesInput === false && <Text accessible={true} accessibilityLabel="Please enter a number"
                          accessibilityRole="alert" style={styles.red}>Please enter a number</Text>}

                </View>

                <View>

                    { recipe_type === "" ?

                       (
                         <View>

                              <Text accessible={true} accessibilityLabel="What type of meal are you looking for?" accessibilityRole="text"
                                style={{marginBottom:30,marginTop:40,textAlign:"center"}}>What type of meal are you looking for?</Text>

                                    <TouchableOpacity accessible={true} accessibilityLabel="Dessert" accessibilityRole="button"
                                      underlayColor="white" onPress={() => this.radioButtonPressedHandler("dessert")}>
                                        <Text style={styles.blueButton}>Dessert</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity accessible={true} accessibilityLabel="Starter or Main" accessibilityRole="button"
                                       underlayColor="white" onPress={() => this.radioButtonPressedHandler("other")}>
                                      <Text style={styles.blueButton}>Starter or Main</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity accessible={true} accessibilityLabel="Either" accessibilityRole="button"
                                       underlayColor="white" onPress={() => this.radioButtonPressedHandler("both")}>
                                      <Text style={styles.blueButton}>Either</Text>
                                    </TouchableOpacity>

                          </View>
                       )

                       :

                       (
                          <View>

                                 <Text accessible={true} accessibilityLabel="What type of meal are you looking for?" accessibilityRole="text"
                                  style={{marginBottom:30,marginTop:40,textAlign:"center"}}>What type of meal are you looking for?</Text>

                                      {recipe_type === "dessert" &&
                                         <TouchableHighlight accessible={true} accessibilityLabel="Dessert" accessibilityRole="button"
                                            underlayColor="white" onPress={() => this.radioButtonPressedHandler("dessert")}>
                                           <Text style={styles.greenButton}>Dessert</Text>
                                         </TouchableHighlight>
                                      }
                                      {recipe_type !== "dessert" &&
                                         <TouchableHighlight accessible={true} accessibilityLabel="Dessert" accessibilityRole="button"
                                            underlayColor="white" onPress={() => this.radioButtonPressedHandler("dessert")}>
                                           <Text style={styles.blueButton}>Dessert</Text>
                                         </TouchableHighlight>
                                      }
                                      {recipe_type === "other" && this.state.both === false &&
                                       <TouchableHighlight accessible={true} accessibilityLabel="Starter or Main" accessibilityRole="button"
                                          underlayColor="white" onPress={() => this.radioButtonPressedHandler("other")}>
                                         <Text style={styles.greenButton}>Starter or Main</Text>
                                       </TouchableHighlight>
                                       }
                                       {recipe_type === "other" && this.state.both === true &&
                                         <TouchableHighlight accessible={true} accessibilityLabel="Starter or Main" accessibilityRole="button"
                                            underlayColor="white" onPress={() => this.radioButtonPressedHandler("other")}>
                                           <Text style={styles.blueButton}>Starter or Main</Text>
                                         </TouchableHighlight>
                                       }
                                       {recipe_type !== "other" &&
                                         <TouchableHighlight accessible={true} accessibilityLabel="Starter or Main" accessibilityRole="button"
                                            underlayColor="white" onPress={() => this.radioButtonPressedHandler("other")}>
                                           <Text style={styles.blueButton}>Starter or Main</Text>
                                         </TouchableHighlight>
                                       }
                                       {this.state.both === true &&
                                         <TouchableHighlight accessible={true} accessibilityLabel="Either" accessibilityRole="button"
                                            underlayColor="white" onPress={() => this.radioButtonPressedHandler("both")}>
                                           <Text style={styles.greenButton}>Either</Text>
                                         </TouchableHighlight>
                                       }
                                       {this.state.both === false &&
                                         <TouchableHighlight accessible={true} accessibilityLabel="Either" accessibilityRole="button"
                                            underlayColor="white" onPress={() => this.radioButtonPressedHandler("both")}>
                                           <Text style={styles.blueButton}>Either</Text>
                                         </TouchableHighlight>
                                       }

                                  { recipe_type === "dessert" ?

                                        (
                                          <View style={{textAlign:"center"}}>

                                               {valid === true ?

                                                  (
                                                    <View>
                                                      {more_needed &&
                                                        <Link to={{pathname:"/dessert-confectionary/", state:{ initial_data: initial, either: either,
                                                           times: times, ingreds: ingreds, } }} underlayColor="transparent">
                                                             <Text accessible={true} accessibilityLabel="Go to dessert ingredients"
                                                              accessibilityRole="button" style={styles.greenNextButton}>Next page</Text>
                                                        </Link>
                                                      }
                                                      {more_needed === false &&
                                                        <Link to={{pathname:"/confirm/", state:{ initial_data: initial, either: either,
                                                           times: times, ingreds: ingreds, more_needed: more_needed } }} underlayColor="transparent">
                                                             <Text accessible={true} accessibilityLabel="Go to dessert ingredients"
                                                              accessibilityRole="button" style={styles.greenNextButton}>Next page</Text>
                                                        </Link>
                                                      }
                                                    </View>
                                                  )

                                                  :

                                                  (
                                                    <View>
                                                        <TouchableHighlight accessible={true} accessibilityLabel="Go to savoury ingredients"
                                                           accessibilityRole="button" underlayColor="white" onPress={ () => this.setState({ showInvalid: true }) }>
                                                           <Text style={styles.redButton}>Next page</Text>
                                                        </TouchableHighlight>

                                                        {this.state.showInvalid === true && <Text accessible={true} accessibilityLabel="Please enter times above"
                                                         accessibilityRole="alert" style={styles.red}>Please enter times above</Text>}

                                                    </View>
                                                  )

                                                }

                                          </View>
                                        )

                                        :

                                        (
                                          <View>
                                                {valid === true ?
                                                  (
                                                    <View>
                                                        {more_needed &&
                                                          <Link accessible={true} accessibilityLabel="Go to savoury ingredients" accessibilityRole="button"
                                                            to={{pathname:"/other-meat/", state:{ initial_data: initial, either: either, times: times,
                                                              ingreds: ingreds } }} underlayColor="transparent" >
                                                              <Text accessible={true} accessibilityLabel="Go to savoury ingredients"
                                                                style={styles.greenNextButton}>Next page</Text>
                                                          </Link>
                                                         }
                                                         {more_needed === false &&
                                                           <Link accessible={true} accessibilityLabel="Go to savoury ingredients" accessibilityRole="button"
                                                             to={{pathname:"/confirm/", state:{ initial_data: initial, either: either, times: times,
                                                               ingreds: ingreds, more_needed: more_needed } }} underlayColor="transparent" >
                                                               <Text accessible={true} accessibilityLabel="Go to savoury ingredients"
                                                                 style={styles.greenNextButton}>Next page</Text>
                                                           </Link>
                                                         }
                                                    </View>
                                                  )
                                                  :
                                                  (
                                                    <View>
                                                        <TouchableHighlight accessible={true} accessibilityLabel="Go to savoury ingredients"
                                                           accessibilityRole="button" underlayColor="white" onPress={ () => this.setState({ showInvalid: true }) }>
                                                           <Text style={styles.redButton}>Next page</Text>
                                                        </TouchableHighlight>

                                                        {this.state.showInvalid === true && <Text accessible={true} accessibilityLabel="Please enter times above"
                                                          accessibilityRole="alert" style={styles.red}>Please enter times above</Text>
                                                        }

                                                    </View>
                                                  )
                                                }
                                          </View>
                                        )

                                  }

                            </View>
                         )
                     }
                     <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                       style={{marginTop:10}} to={{pathname:"/search-method/", state:{ initial_data: initial, either: either, times: times,
                         ingreds: ingreds, more_needed: more_needed } }} underlayColor="transparent">
                         <Text style={styles.backButton}>Back</Text>
                     </Link>

                </View>
          </View>
        );
     }
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize:28,
    marginBottom:20
  },
  greenButton: {
    padding: 10,
    marginTop: 3,
    marginHorizontal: 50,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
    textAlign: "center",
  },
  starterBlueButton: {
    padding: 10,
    marginTop: 3,
    marginHorizontal: 60,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
  },
  blueButton: {
    padding: 10,
    marginTop: 3,
    marginHorizontal: 60,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
  },
  backButton: {
    padding: 10,
    marginTop: 5,
    marginHorizontal: 128,
    minWidth: 100,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
  },
  greenNextButton: {
    padding: 10,
    marginTop: 50,
    marginHorizontal: 128,
    minWidth: 100,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightgreen',
    textAlign: "center",
  },
  redButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'pink',
    textAlign: "center",
    marginHorizontal: 128,
    marginTop: 50,
  },
  input: {
    height: 40,
    marginTop: 3,
    marginHorizontal: 50,
    borderWidth: 1,
    textAlign: "center",
  },
  red: {
    color: 'red',
    textAlign: 'center',
  }
});

export { HomePage, SearchMethod, TimeAndType };
