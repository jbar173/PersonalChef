import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, SafeAreaView, ScrollView, Linking, } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import AsyncStorage from '@react-native-async-storage/async-storage';



class SavedRecipesPage extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        savedRecipeList: [],
        sortedRecipeList: [],
        recipeListToSave: [],
        updated: false,
        noRecipesSaved: false,
        separateRecipes: false,
        ready: false,
        expanded: false,
        deleteAnItem: false,
        indexToDelete: '',
        saveNewList: false,
        refreshList: false
      }
      this.getDeviceData = this.getDeviceData.bind(this)
      this.saveDeviceData = this.saveDeviceData.bind(this)
      this.saveData = this.saveData.bind(this)

      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)

      this.checkRecipeList = this.checkRecipeList.bind(this)
      this.sortRecipeData = this.sortRecipeData.bind(this)
      this.expandHandler = this.expandHandler.bind(this)
      this.deleteHandler = this.deleteHandler.bind(this)
      this.deleteRecipe = this.deleteRecipe.bind(this)
      this.finishSaving = this.finishSaving.bind(this)

    };

    getDeviceData = async (key) => {
         console.log("getting device data")
         try {
              console.log("try")
              var data = await AsyncStorage.getItem(key)
              if(data !== null) {
                  var value = JSON.parse(data)
              }else{
                  var value = "@saved-recipes was null"
              }
              return value;
          }
          catch(e) {
              console.log("SavedRecipesPage: Error reading data for saved recipes in getDeviceData: " + e);
          }
    }

    saveDeviceData = async ( key, data ) => {
          try {
              await AsyncStorage.setItem(key, JSON.stringify(data))
          }
          catch (e) {
              console.log(`SavedRecipes: Error in saveDeviceData, saving data for key ${key}: `, data);
              throw e;
          }
    }

    saveData(key,data){
         try {
             this.saveDeviceData(key,data);
             console.log("SAVED")
         } catch (e) {
             console.log("SavedRecipes: Error saving in saveData: " + e)
         }
    }


    deleteRecipe(){
      console.log("deleting recipe")
      var index = this.state.indexToDelete
      if(index === 0){
        var new_index = 0
      }else{
        var new_index = index*2
      }
      var new_data = this.state.savedRecipeList
      var gone = new_data.splice(new_index,2)
      this.setState({
        deleteAnItem: false,
        recipeListToSave: new_data,
        saveNewList: true
      })
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
      if(this.state.updated){
        this.checkRecipeList()
      }
      if(this.state.separateRecipes){
        console.log("separating recipes now")
        this.sortRecipeData()
      }
      if(this.state.deleteAnItem){
        this.deleteRecipe()
      }
      if(this.state.saveNewList){
        this.finishSaving()
      }
      if(this.state.refreshList){
        this.refreshRecipes()
      }
   }

   refreshRecipes(){
     var recipes_key = '@saved-recipes'
     var recipes = this.getDeviceData(recipes_key)
     .then(recipes => {
       this.setState({
         savedRecipeList: recipes,
         updated: true,
         refreshList: false,
         expanded: false,
       })
     })
   }

   finishSaving(){
     var new_list = this.state.recipeListToSave
     this.saveData('@saved-recipes',new_list)
     this.setState({
       saveNewList: false,
       refreshList: true
     })
   }

   componentWillUnmount(){
      console.log("SavedRecipesPage dismounting")
   }

   checkRecipeList(){
      var data = this.state.savedRecipeList

      if(data[0] === 0){
        var popped = data.splice(0,1)
        if(data.length === 0){
          this.setState({
            savedRecipeList: [],
            sortedRecipeList: [],
            noRecipesSaved: true,
            updated: false,
          })
          return 0
        }
        this.setState({
          savedRecipeList: data,
          updated: false,
          separateRecipes: true
        })
        return 0

      }else if(data.length > 0){
        this.setState({
          updated: false,
          separateRecipes: true
        })

      }else{
        this.setState({
          savedRecipeList: [],
          sortedRecipeList: [],
          noRecipesSaved: true,
          updated: false,
        })
      }
   }

   sortRecipeData(){
      var data = this.state.savedRecipeList
      var sorted_data = []
      var not_finished = true
      var final_index = data.length-1
      while(not_finished){
        var count = 0
        var pair = []
        var x
        var index = -1
          for(x in data){
              index += 1
              count += 1
              if(count % 2 !== 0){
                  pair.push(data[x])
              }else{
                  pair.push(data[x])
                  count = 0
                  sorted_data.push(pair)
                  pair = []
                  if(index == final_index){
                      not_finished = false
                      this.setState({
                        sortedRecipeList: sorted_data,
                        separateRecipes: false,
                        ready: true
                      })
                  }
              }
          }
       }
    }

    expandHandler(ind=null){
      var original_state = this.state.expanded
      var new_state = !(this.state.expanded)
      this.setState({
        expanded: new_state,
        indexToDelete: ind
      })
    }

    deleteHandler(){
      this.setState({
        deleteAnItem: true
      })
    }


    render(){
      var saved_recipes = this.state.sortedRecipeList
      var ready = this.state.ready
      var no_saved_recipes = this.state.noRecipesSaved
      var expanded = this.state.expanded
      var self = this
      if(this.state.indexToDelete === undefined){
        var to_delete = ''
      }else{
        var to_delete = this.state.indexToDelete
      }


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

                                              <Text style={{fontWeight:"bold",marginTop:25,fontSize:18,marginHorizontal:55,textAlign:"center"}}>{recipe[1][0]}</Text>
                                              <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${recipe[1][1]}`)}>
                                                <Text accessible={true} accessibilityLabel="Go to recipe website" accessibilityRole="link"
                                                  style={styles.greenButton}>Go to recipe website</Text>
                                              </Pressable>

                                              {expanded === false &&
                                                    <Pressable style={{justifyContent:"center"}} onPress={() => self.expandHandler(index)}>
                                                      <Text accessible={true} accessibilityLabel="Delete recipe" accessibilityRole="button"
                                                        style={styles.redButton}>Delete recipe</Text>
                                                    </Pressable>
                                              }

                                              {expanded && index === to_delete &&
                                                  <View style={{display:"flex"}}>
                                                      <View style={{flexDirection:"row",justifyContent:"center"}}>
                                                        <Pressable style={{justifyContent:"center",alignSelf:"center"}} onPress={() => self.deleteHandler()}>
                                                          <Text accessible={true} accessibilityLabel="Delete recipe" accessibilityRole="button"
                                                            style={styles.expandedRedButton}>Delete</Text>
                                                        </Pressable>
                                                        <Pressable style={{justifyContent:"center",alignSelf:"center"}} onPress={() => self.expandHandler()}>
                                                          <Text accessible={true} accessibilityLabel="Cancel delete" accessibilityRole="button"
                                                            style={styles.expandedBlueButton}>Cancel</Text>
                                                        </Pressable>
                                                      </View>
                                                  </View>
                                              }
                                              {expanded && index !== to_delete &&
                                                  <Pressable style={{justifyContent:"center"}}>
                                                    <Text accessible={true} accessibilityLabel="Delete recipe" accessibilityRole="button"
                                                      style={styles.redButton}>Delete recipe</Text>
                                                  </Pressable>
                                              }
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
                            style={styles.blueButtonMain}>Back to homepage</Text>
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
  expandedRedButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'pink',
    textAlign: "center",
    marginBottom: 5,
  },
  expandedBlueButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
    marginBottom: 5,
  },
  blueButtonMain: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
    marginHorizontal: 105,
    marginTop: 40,
  },

  greenButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
    textAlign: "center",
    marginHorizontal: 105,
    marginTop: 10,
    marginBottom: 5
  },
  blueButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
    marginHorizontal: 128,
    marginBottom: 10,
  },
  redButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'pink',
    textAlign: "center",
    marginHorizontal: 128,
    marginBottom: 5,
  },
});


export { SavedRecipesPage };
