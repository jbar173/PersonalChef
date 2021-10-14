import React from 'react';
import { StyleSheet, Text, View, Button, Pressable, SafeAreaView } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


class PantryCheckList extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        pantry: [],
        favourites: [],
        empty: false,
        displayEmpty: false,

        initialDict: {},
        populated: false,
        display: false,

        confirmed: false,
        newPantry: [],
        finalConfirm: false
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)

      this.populateInitialDict = this.populateInitialDict.bind(this)
      this.selectOrDeselect = this.selectOrDeselect.bind(this)
      this.displayFavourites = this.displayFavourites.bind(this)
      this.confirmedHandler = this.confirmedHandler.bind(this)
      this.favouritesWasEmpty = this.favouritesWasEmpty.bind(this)
    };

   getData = async (key) => {

      try {
         const data = await AsyncStorage.getItem(key)
         if(data !== null) {
            var value = JSON.parse(data)
            if(key === '@favourite-ingredients'){
              this.setState({
                favourites: value
              })
            }else if(key === '@pantry-ingredients'){
                this.setState({
                  pantry: value
                })
            }

         }else{
            this.setState({
              empty: true
            })
         }

      } catch(e) {
          console.log(`PANTRY: Error reading data for ${key}: e.message`);
      }
   }


    componentDidMount(){
      console.log("PantryChecklist mounted")
      var favourites_key = '@favourite-ingredients'
      var pantry_key = '@pantry-ingredients'
      var f = this.getData(favourites_key)
      var p = this.getData(pantry_key)
    }


    populateInitialDict(){
      console.log("start")
      var new_dictionary = {}
      var i
      var length = this.state.pantry.length
      for(i=0;i<length;i++){
        var name = this.state.pantry[i]
        console.log("name: " + name)
        new_dictionary[name] = true
      }
      this.setState({
        initialDict: new_dictionary,
        populated: true
      })
    }


    componentDidUpdate(){
      console.log("PantryChecklist unpdated")

      if(this.state.empty && this.state.finalConfirm === false){
        console.log("empty")
        this.favouritesWasEmpty()
        return 1
      }
      var f_length = this.state.favourites.length
      var p_length = this.state.pantry.length
      if(f_length > 0 && p_length > 0 && this.state.populated === false){
        console.log("f_length: " + f_length)
        console.log("p_length: " + p_length)
        this.populateInitialDict()
      }
      if(this.state.finalConfirm){
        this.props.updateListHandler(this.state.newPantry)
        this.setState({
          finalConfirm: false,
          empty: false
        })
      }

    }


    componentWillUnmount(){
      console.log("PantryChecklist unmounted")
    }


    favouritesWasEmpty(){
      this.setState({
        finalConfirm: true,
        displayEmpty: true
      })
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
      var favourites = this.state.favourites
      var self = this
      var confirmed = this.state.confirmed
      var display = this.state.display

      return(

          <SafeAreaView style={styles.container}>
                <View>
                    {this.state.displayEmpty == false &&
                      <View>
                         <View style={styles.container}>
                            <Text style={styles.title}>In your pantry:</Text>
                            <Text>(click on an ingredient to remove it from your pantry)</Text>
                              {Object.entries(pantry).map(function(item,index){
                                  return(
                                        <View key={index}>
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
                        {this.state.displayEmpty &&

                          <View style={styles.container}>

                              <Text style={styles.title}>Your pantry is empty!</Text>
                              <Text style={{marginVertical:20}}>Click continue to add items to your pantry.</Text>

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
