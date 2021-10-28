import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, SafeAreaView, ScrollView, Linking, } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import AsyncStorage from '@react-native-async-storage/async-storage';



class SavedRecipesPage extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        savedRecipeList: [],
        updated: false,
        noRecipesSaved: false,
        separateRecipes: false,
        ready: false
      }
      this.getDeviceData = this.getDeviceData.bind(this)
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
      this.checkRecipeList = this.checkRecipeList.bind(this)
      this.sortRecipeData = this.sortRecipeData.bind(this)
      this.deleteRecipeHandler = this.deleteRecipeHandler.bind(this)

    };

    getDeviceData = async (key) => {
         console.log("getting device data")
         try {
              console.log("try")
              var data = await AsyncStorage.getItem(key)
              if(data !== null) {
                  var value = JSON.parse(data)
                  console.log("value: " + value)
              }else{
                  var value = "@saved-recipes was null"
                  console.log("value: " + value)
              }
              return value;
          }
          catch(e) {
              console.log("SavedRecipesPage: Error reading data for saved recipes in getDeviceData: " + e);
          }
    }

    componentDidMount(){
      console.log("SavedRecipesPage mounted")
      var recipes_key = '@saved-recipes'
      var recipes = this.getDeviceData(recipes_key)
      .then(recipes => {
        this.setState({
          savedRecipeList: recipes,
          updated: true
        })
      })
    }

    componentDidUpdate(){
      console.log("SavedRecipesPage updated")
      console.log("savedRecipeList.length: " + this.state.savedRecipeList.length)
      if(this.state.updated){
        this.checkRecipeList()
      }
      var x
      var y
      console.log("this.state.savedRecipeList.length: " + this.state.savedRecipeList.length)
      for(x in this.state.savedRecipeList){
        console.log("ready?: " + this.state.ready)
        console.log("x: " + this.state.savedRecipeList[x])
        console.log("typeof(this.state.savedRecipeList): " + typeof(this.state.savedRecipeList))
        console.log("typeof(x): " + typeof(x))
        console.log("this.state.savedRecipeList[x][0]: " + this.state.savedRecipeList[x][0])
        console.log("this.state.savedRecipeList[x][1]: " + this.state.savedRecipeList[x][1])
        for(y in x){
          console.log("y: " + this.state.savedRecipeList[x][y])
          console.log("typeof(y): " + typeof(y))
        }
      }
      if(this.state.separateRecipes){
        console.log("separating recipes now")
        this.sortRecipeData()
      }
    }

    componentWillUnmount(){
      console.log("SavedRecipesPage dismounting")
    }

    checkRecipeList(){
      var data = this.state.savedRecipeList
      console.log("initial data length: " + data.length)

      if(data[0] === 0){
        var popped = data.splice(0,1)
        console.log("popped: " + popped)
        console.log("data length now: " + data.length)
        if(data.length === 0){
          this.setState({
            savedRecipeList: [],
            noRecipesSaved: true,
            updated: false,
            separateRecipes: true
          })
          return 0
        }
        this.setState({
          savedRecipeList: data,
          updated: false,
          separateRecipes: true
        })
        return 0
        console.log("End of checkRecipeList~~~")
      }
      this.setState({
        updated: false,
        separateRecipes: true
      })
    }

    sortRecipeData(){
      var data = this.state.savedRecipeList

      var sorted_data = []
      var not_finished = true
      var final_index = data.length-1
      console.log("final_index: " + final_index)

      while(not_finished){

        var count = 0
        var pair = []
        var x
        var index = -1

          for(x in data){
              console.log("data[x]: " + data[x])
              index += 1
              console.log("index: " + index)
              console.log("final_index: " + final_index)
              count += 1
              if(count % 2 !== 0){
                  console.log("count: " + count)
                  pair.push(data[x])
              }else{
                  console.log("else count: " + count)
                  pair.push(data[x])
                  count = 0
                  sorted_data.push(pair)
                  pair = []
                  if(index == final_index){
                      console.log("INDEX IS: " + index)
                      console.log("final_index: " + final_index)
                      not_finished = false
                      this.setState({
                        savedRecipeList: sorted_data,
                        separateRecipes: false,
                        ready: true
                      })
                  }
              }
          }
       }
    }

    deleteRecipeHandler(){
      console.log("deleteRecipeHandler")
    }


    render(){
      var saved_recipes = this.state.savedRecipeList
      var ready = this.state.ready
      var no_saved_recipes = this.state.noRecipesSaved


      return(
              <SafeAreaView>
                <ScrollView>
                    <View style={styles.container}>
                        <Text accessible={true} accessibilityLabel="My saved recipes"
                          accessibilityRole="text" style={styles.mainTitle}>My saved recipes</Text>

                          {no_saved_recipes === false && ready &&
                            <View>
                                {Object.entries(saved_recipes).map(function(recipe,index) {
                                  return(
                                      <View style={{justifyContent:"center",alignItems:"center"}} key={index}>
                                          <Text>{recipe[1][0]}</Text>
                                          <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${recipe[1][1]}`)}>
                                            <Text accessible={true} accessibilityLabel="Go to recipe website" accessibilityRole="link"
                                              style={styles.greenButton}>Go to recipe website</Text>
                                          </Pressable>
                                      </View>
                                   )
                                  })
                                 }
                            </View>
                          }
                          {no_saved_recipes &&
                            <View>
                              <Text>No saved recipes yet</Text>
                            </View>
                          }


                        <Link style={{alignItems:"center"}} to="/" underlayColor="transparent">
                            <Text accessible={true} accessibilityLabel="Go back to homepage" accessibilityRole="button"
                            style={styles.blueButton}>Back to homepage</Text>
                        </Link>
                    </View>
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
  mainTitle: {
    fontSize:28,
    marginBottom:20,
    textAlign:'center',
  },
  greenButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
    textAlign: "center",
    marginHorizontal: 128,
    marginTop: 10,
    marginBottom: 20
  },
  blueButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    marginVertical: 20,
  },
});


export { SavedRecipesPage };
