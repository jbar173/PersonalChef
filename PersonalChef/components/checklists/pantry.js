import React from 'react';
import { StyleSheet, Text, View, Button, Pressable, SafeAreaView } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import * as previous from './json_ingredient_lists/previous_search.json';
import * as all from './json_ingredient_lists/all_previous_searches.json';


class PantryCheckList extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        jsonPantry: [],
        jsonFavourites: [],
        empty: false,
        start: false,
        initialDict: {},
        display: false,

        confirmed: false,
        newPantry: [],
        finalConfirm: false
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.selectOrDeselect = this.selectOrDeselect.bind(this)
      this.displayFavourites = this.displayFavourites.bind(this)
      this.confirmedHandler = this.confirmedHandler.bind(this)
    };

    componentDidMount(){
      console.log("PantryChecklist mounted")
      var p = previous.ingredients
      var a = all.ingredients
      if(p.length==0){
        this.setState({
          empty: true
        })
        return 1;
      }
      this.setState({
        jsonPantry: p,
        jsonFavourites: a,
        start: true
      })
    }

    componentDidUpdate(){
      console.log("PantryChecklist unmounted")
      var new_dictionary = {}
      if(this.state.start){
        var i
        var length = this.state.jsonPantry.length
        for(i=0;i<length;i++){
          var name = this.state.jsonPantry[i]
          new_dictionary[name] = true
        }
        this.setState({
          initialDict: new_dictionary,
          start: false
        })
      }
      if(this.state.finalConfirm){
        this.props.updateListHandler(this.state.newPantry)
        this.setState({
          finalConfirm: false
        })
      }
    }

    selectOrDeselect(item){
      var new_item = item
      var list = this.state.initialDict
      new_item[1] = !new_item[1]
      if(new_item.length === 2){
        this.setState({
          initialDict: {
            ...this.state.initialDict,
            [`${new_item[0]}`]: new_item[1],
          },
          confirmed: false
        }); return 1;
      }
      this.setState({
        initialDict: {
          ...this.state.initialDict,
          [`${new_item}`]: true,
        },
        confirmed: false
      })
    }

    confirmedHandler(){
      console.log("confirmed")
      var state = !this.state.confirmed
      var new_pantry = []
      for([key,value] of Object.entries(this.state.initialDict)){
        if(value === true){
          new_pantry.push(key)
        }
      }
      this.setState({
        confirmed: state,
        newPantry: new_pantry,
        finalConfirm: true
      })
    }

    displayFavourites(){
      var new_state = this.state.display
      new_state = !new_state
      this.setState({
        display: new_state
      })
    }



    render(){
      var pantry = this.state.initialDict
      var favourites = this.state.jsonFavourites
      var self = this
      var confirmed = this.state.confirmed
      var display = this.state.display

      return(

          <SafeAreaView style={styles.container}>
                <View>
                    {this.state.empty == false &&
                      <View>
                         <View style={styles.container}>
                            <Text style={styles.title}>In your pantry:</Text>
                            <Text>(click on an ingredient to remove it from your pantry)</Text>
                              {Object.entries(pantry).map(function(item,index){
                                  return(
                                        <View>
                                            {item[1] == true &&
                                              <Pressable style={styles.greenButton} onPress={() => self.selectOrDeselect(item)}>
                                                  <Text>{item}</Text>
                                              </Pressable>
                                            }
                                            {item[1] == false &&
                                              <Pressable style={styles.blueButton} onPress={() => self.selectOrDeselect(item)}>
                                                  <Text>{item}</Text>
                                              </Pressable>
                                            }
                                        </View>
                                    )
                                  }
                               )}
                          </View>


                          <View style={{alignItems:"center",marginTop:40}}>
                                  { confirmed === false &&
                                    <View>
                                      <Pressable onPress={this.confirmedHandler}>
                                          <Text accessible={true} accessibilityLabel="Confirm" accessibilityRole="button"
                                           accessibilityHint="Click to confirm your ingredients" style={styles.greenButton}>Confirm Pantry ingredients</Text>
                                      </Pressable>
                                   </View>
                                  }
                                  { confirmed &&
                                    <View>
                                      <Pressable onPress={this.confirmedHandler}>
                                          <Text accessible={true} accessibilityLabel="Change selection" accessibilityRole="button"
                                           accessibilityHint="Click to change your ingredients" style={styles.blueButton}>Change Pantry ingredients</Text>
                                      </Pressable>
                                    </View>
                                   }
                          </View>

                          <View style={{alignItems:"center",marginTop:40}}>
                                {display === false &&
                                  <View>
                                      <Pressable style={styles.greenButton} onPress={this.displayFavourites}>
                                          <Text>Use previous favourites</Text>
                                      </Pressable>
                                  </View>
                                }

                                {display &&
                                  <View style={{alignItems:"center",marginVertical:20}}>
                                      <Pressable style={styles.greenButton} onPress={this.displayFavourites}>
                                          <Text>Hide favourites</Text>
                                      </Pressable>
                                      <Text>Click item to add to pantry above:</Text>
                                      <View style={styles.container}>
                                              {favourites.map(function(item,index){
                                                  return(
                                                        <View key={index}>
                                                          <Pressable onPress={() =>self.selectOrDeselect(item)}
                                                            style={styles.greenButton} key={index}>
                                                              <Text>{item}</Text>
                                                          </Pressable>
                                                        </View>
                                                    )
                                                })
                                              }
                                       </View>
                                   </View>
                                  }
                            </View>
                        </View>
                        }

                        {this.state.empty &&
                            <View style={{alignItems:"center",marginTop:40}}>
                                  <Text style={{marginVertical:40,fontSize:18}}>Your pantry is empty!</Text>
                                  <Pressable style={styles.blueButton}>
                                       <Link accessible={true} accessibilityLabel= "Your pantry is empty"
                                         accessibilityHint="Press here to add items to your pantry"
                                         to="/type-time/" accessibilityRole="button" underlayColor="transparent">
                                         <Text>Add items</Text>
                                       </Link>
                                  </Pressable>
                                  <Pressable style={styles.blueButton}>
                                       <Link accessible={true} accessibilityLabel= "Go back"
                                         accessibilityHint="Press to go back"
                                         to="/" accessibilityRole="button" underlayColor="transparent">
                                         <Text>Back</Text>
                                       </Link>
                                  </Pressable>
                            </View>
                         }
                  </View>
          </SafeAreaView>

      );

    }

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize:18,
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
});


export { PantryCheckList };
