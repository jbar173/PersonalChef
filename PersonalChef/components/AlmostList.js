import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable, Linking, SafeAreaView, ScrollView } from 'react-native';


class AlmostList extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        almostList: this.props.almosts,
        savedRecipeIndexes: [],
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)

      this.refreshPage = this.refreshPage.bind(this)
      this.sendBackRecipeToSave = this.sendBackRecipeToSave.bind(this)
    };

    componentDidMount(){
      console.log("Almost list mounted")
      var item
      for(item in this.state.almostList){
        console.log("almost list item: " + this.state.almostList[item])
      }
    }

    componentDidUpdate(){
      console.log("Almost list updated")
    }

    componentWillUnmount(){
      console.log("Almost list dismounting")
    }

    refreshPage(){
      console.log("Refresh component here (get 'almost' recipes sent through from apiCalls again, will include any new ones)")
    }

    sendBackRecipeToSave(recipe,index){
      var recipes_saved = this.state.savedRecipeIndexes
      recipes_saved.push(index)
      recipe.pop()
      console.log("ALMOST recipe.length (should be 2): " + recipe.length)
      this.props.newRecipeToSave(recipe,index)
      this.setState({
        savedRecipeIndexes: recipes_saved
      })
    }



    render(){
      var recipe_list = this.state.almostList
      var saved_indexes = this.state.savedRecipeIndexes
      var self = this

      return(

              <View>

                    {recipe_list.map(function(item,index) {

                        return(
                            <View key={index}>
                                <View style={{justifyContent:"center",alignItems:"center"}}>
                                      <Text style={{justifyContent:"center",fontSize:18,fontWeight:'bold',
                                        textAlign:"center",marginBottom:10,marginTop:30}}>{item[0]}</Text>
                                      <Text style={{fontWeight:"bold",marginBottom:5,textAlign:"center"}}>Missing ingredient: {item[2]}</Text>

                                      <Pressable style={{justifyContent:"center"}} onPress={() => Linking.openURL(`${item[1]}`)}>
                                        <Text accessible={true} accessibilityLabel="Go to recipe website" accessibilityRole="link"
                                          style={styles.greenButton}>Go to recipe website</Text>
                                      </Pressable>

                                      { !(saved_indexes.includes(index)) &&
                                        <Pressable style={{justifyContent:"center"}} onPress={() => self.sendBackRecipeToSave(item,index)}>
                                           <Text accessible={true} accessibilityLabel="Save this recipe to your device"
                                             accessibilityRole="button" style={styles.greenButton}>Save recipe</Text>
                                        </Pressable>
                                      }
                                      { saved_indexes.includes(index) &&
                                        <Pressable style={{justifyContent:"center"}}>
                                           <Text accessible={true} accessibilityLabel="Recipe has been saved"
                                             accessibilityRole="button" style={styles.redButton}>Recipe saved</Text>
                                        </Pressable>
                                      }

                                </View>
                            </View>
                        )
                      })

                    }

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
