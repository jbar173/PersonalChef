import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, Linking, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link, Redirect } from "react-router-native";
import { SavingRecipeAnimationAlmost  } from "./Animations.js";


class AlmostList extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        almostList: this.props.almosts,
        substitutesDict: this.props.substitutes,
        savedRecipeIndexes: [],
        urlsSavedInThisSearch: this.props.url_list,
        prevUrlLength: '',
        savedRecipeInfo: this.props.saved_recipes_info,
        showAnimation: false,
        recipeClicked: ''
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)

      this.sendBackRecipeToSave = this.sendBackRecipeToSave.bind(this)
      this.animationOver = this.animationOver.bind(this)
    };

    componentDidMount(){
      console.log("Almost list mounted")
      if(this.state.savedRecipeInfo !== undefined){
          for([key,value] of Object.entries(this.state.savedRecipeInfo)){
            console.log("**didMount** key: " + key + " value: " + value)
          }
      }
    }

    componentDidUpdate(){
      console.log("Almost list updated")
      console.log("UPDATE showAnimation?: " + this.state.showAnimation)
    }

    componentWillUnmount(){
      console.log("Almost list dismounting")
    }

    animationOver(state){
      console.log("animationOver function")
      this.setState({
        showAnimation: state
      })
    }

    sendBackRecipeToSave(recipe,index){
      console.log("ALMOST SAVE CLICKED")
      var recipes_saved = this.state.savedRecipeIndexes
      recipes_saved.push(index)
      var saved_recipe_info = this.state.savedRecipeInfo
      var url_list = this.state.urlsSavedInThisSearch

      if(recipe.length === 3){
        var url = recipe[1]
        var missing = recipe.pop()
        saved_recipe_info[url] = missing
        url_list.push(url)
      }

      var ind = ''
      this.props.newRecipeToSave(recipe,ind,url_list,saved_recipe_info)
      this.setState({
        savedRecipeIndexes: recipes_saved,
        urlsSavedInThisSearch: url_list,
        savedRecipeInfo: saved_recipe_info,
        recipeClicked: index,
        showAnimation: true
      })
    }


    render(){
      var recipe_list = this.state.almostList
      var saved_urls = this.state.urlsSavedInThisSearch
      var urls_are_saved = false
      if(saved_urls !== undefined){
        urls_are_saved = true
      }
      var saved_recipe_info = this.state.savedRecipeInfo
      var self = this
      var show_animation = this.state.showAnimation
      var recipe_clicked = this.state.recipeClicked
      var subs = this.state.substitutesDict

      return(

              <View>

                    { recipe_list.map(function(item,index) {

                        return(
                            <View key={index}>
                                <View style={{justifyContent:"center",alignItems:"center"}}>
                                     <Text style={{justifyContent:"center",fontSize:18,fontWeight:'bold',
                                        textAlign:"center",marginBottom:10,marginTop:30}}>{item[0]}</Text>

                                     {item.length === 3 &&
                                        <Text style={{fontWeight:"bold",marginBottom:5,textAlign:"center"}}>Missing ingredient: {item[2]}</Text>
                                     }
                                     {item.length === 2 && urls_are_saved && saved_recipe_info !== undefined &&
                                        <View>
                                          {Object.entries(saved_recipe_info).map(function(info,ind) {
                                              return(
                                                <View key={ind}>
                                                  {saved_urls.includes(info[0]) && item[1] === info[0] &&
                                                      <Text style={{fontWeight:"bold",marginBottom:5,textAlign:"center"}}>Missing ingredient: {info[1]}</Text>
                                                  }
                                                </View>
                                              )
                                            })
                                          }
                                        </View>
                                      }
                                      { Object.entries(subs).map(function(entry,i) {
                                          return(
                                                  <View key={i}>

                                                     {entry[0] === item[1] &&
                                                         <View>
                                                             {entry[1].map(function(substitute,it) {
                                                                 return(
                                                                    <View key={it}>
                                                                        <Text style={{textAlign:"center",marginBottom:5}}>Substitute made: Your ingredient {substitute[1]} could possibly be used in place of {substitute[0]}*</Text>
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
                                      { show_animation === false &&
                                          <View style={{justifyContent:"center",alignItems:"center"}}>
                                              <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${item[1]}`)}>
                                                <Text accessible={true} accessibilityLabel="Go to recipe website" accessibilityRole="link"
                                                    style={styles.greenButton}>Go to recipe website</Text>
                                              </Pressable>
                                              { saved_urls.includes(item[1]) &&
                                                <Pressable style={{justifyContent:"center"}}>
                                                   <Text accessible={true} accessibilityLabel="Recipe has been saved"
                                                     accessibilityRole="button" style={styles.redButton}>Recipe saved</Text>
                                                </Pressable>
                                              }
                                              { !(saved_urls.includes(item[1])) &&
                                                <Pressable style={{justifyContent:"center"}} onPress={() => self.sendBackRecipeToSave(item,index)}>
                                                   <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                     accessibilityRole="button" style={styles.greenButton}>Save recipe</Text>
                                                </Pressable>
                                              }
                                          </View>
                                      }
                                      { show_animation &&
                                          <View style={{justifyContent:"center",alignItems:"center"}}>
                                              <Pressable style={{justifyContent:"center"}}>
                                                <Text accessible={true} accessibilityLabel="Go to recipe website" accessibilityRole="link"
                                                    style={styles.greenButton}>Go to recipe website</Text>
                                              </Pressable>
                                              { saved_urls.includes(item[1]) &&
                                                <Pressable style={{justifyContent:"center"}}>
                                                   <Text accessible={true} accessibilityLabel="Recipe has been saved"
                                                     accessibilityRole="button" style={styles.redButton}>Recipe saved</Text>
                                                </Pressable>
                                              }
                                              { !(saved_urls.includes(item[1])) &&
                                                <Pressable style={{justifyContent:"center"}}>
                                                   <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                                     accessibilityRole="button" style={styles.greenButton}>Save recipe</Text>
                                                </Pressable>
                                              }
                                              { recipe_clicked === index &&
                                                 < SavingRecipeAnimationAlmost
                                                    animationOver={this.animationOver}
                                                 />
                                              }
                                          </View>
                                       }

                                 </View>
                             </View>
                        )
                      })

                    }

                    <View>
                        <Text style={{textAlign:"center",marginBottom:5}}>* Some suggested substitutions may not be appropriate - please research whether required
                                quantities/cooking methods/times will differ for replacement ingredients. </Text>
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
  blueBackToHomepageButton: {
    padding: 10,
    marginTop: 5,
    minWidth: 100,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
  }
});


export { AlmostList };
