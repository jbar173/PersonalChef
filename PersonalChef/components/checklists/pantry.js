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
        start: false,
        initialDict: {},
        print: false,
        confirmed: false,
        display: false,
        newPantry: [],
        newFavourites: []
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.selectOrDeselect = this.selectOrDeselect.bind(this)
      this.printInitialDict = this.printInitialDict.bind(this)
      this.confirmedHandler = this.confirmedHandler.bind(this)
      this.displayFavourites = this.displayFavourites.bind(this)
    };

    componentDidMount(){
      console.log("PantryChecklist mounted")
      var p = previous.ingredients
      var a = all.ingredients
      this.setState({
        jsonPantry: p,
        jsonFavourites: a,
        start: true
      })
      console.log("p[0]['name']: " + p[0]['name'])
    }

    componentDidUpdate(){
      console.log("PantryChecklist unmounted")
      var new_dictionary = {}
      if(this.state.start){
        var i
        var length = this.state.jsonPantry.length
        for(i=0;i<length;i++){
          var name = this.state.jsonPantry[i]['name']
          var selected = true
          new_dictionary[name] = selected
        }
        this.setState({
          initialDict: new_dictionary,
          print: true,
          start: false
        })
      }
      if(this.state.print){
        this.printInitialDict()
      }
    }

    selectOrDeselect(item){
      var new_item = item
      var list = this.state.initialDict
      new_item[1] = !new_item[1]
      if(new_item.name){
        var name = new_item.name
        this.setState({
          initialDict: {
            ...this.state.initialDict,
            [`${name}`]: new_item[1],
          },
          print: true,
          confirmed: false
        }); return 1;
      }
      this.setState({
        initialDict: {
          ...this.state.initialDict,
          [`${new_item[0]}`]: new_item[1],
        },
        print: true,
        confirmed: false
      })
    }

    printInitialDict(){
      var initial_dict = this.state.initialDict
      var new_pantry = this.state.newPantry
      console.log("~~~~~~~~~")
      for([key,value] of Object.entries(initial_dict)){
        console.log(key + ":" + value)
      }
      console.log("- - - - - ")
      for(x in new_pantry){
        console.log("new_pantry[x]: " + new_pantry[x])
      }
      this.setState({
        print: false
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
        print: true
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

              <SafeAreaView>
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
                        <Pressable onPress={() =>this.props.updateListHandler(this.state.newPantry)}
                            onPressIn={this.confirmedHandler}>
                              { confirmed === false ?
                                (
                                  <Text accessible={true} accessibilityLabel="Confirm" accessibilityRole="button"
                                   accessibilityHint="Click to confirm your ingredients" style={styles.greenButton}>Confirm Pantry ingredients</Text>
                                )
                                :
                                (
                                  <Text accessible={true} accessibilityLabel="Change selection" accessibilityRole="button"
                                   accessibilityHint="Click to change your ingredients" style={styles.blueButton}>Change Pantry ingredients</Text>
                                )
                              }
                        </Pressable>
                    </View>

                    <View style={{alignItems:"center",marginTop:40}}>
                        {display === false &&
                          <View>
                              <Pressable style={styles.greenButton} onPress={this.displayFavourites}>
                                  <Text>Use previous favourites</Text>
                              </Pressable>
                              <Pressable style={styles.greenButton} onPress={this.displayFavourites}>
                                  <Text>Select new ingredients</Text>
                              </Pressable>
                          </View>
                        }

                        {display &&
                          <View style={{alignItems:"center",marginTop:10}}>
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
                                                      <Text>{item.name}</Text>
                                                  </Pressable>
                                                </View>
                                            )
                                        })
                                      }
                              </View>
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
