import React from 'react';
import { StyleSheet, Text, View, Button, Pressable, SafeAreaView } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";


class WetIngredientsChecklist extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      initialList: {
        "milk": false,
        "butter": false,
        "cream": false,
        "eggs": false,
        "cream cheese": false,
        "vanilla extract": false,
        "cooking oil": false,
        "cooking spray": false,
      },
      updated:false,
      confirmedList:[],
      confirmed: false,
    }
    this.itemSelectedHandler = this.itemSelectedHandler.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.confirmedHandler = this.confirmedHandler.bind(this)
  };

  itemSelectedHandler(item){
    console.log("item (de)selected")
    var new_item = item
    new_item[1] = !new_item[1]
    this.setState({
      initialList: {
        ...this.state.initialList,
        [`${new_item[0]}`] : item[1],
      },
      updated:true,
    })
  }

  componentDidUpdate(){
    console.log("did update")

    if(this.state.updated === true){
      console.log("updated = true")
      var initial = this.state.initialList
      var confirmed = []
      for([key,value] of Object.entries(initial)){
         if(value === true){
             console.log(key + " added to confirmed list")
             confirmed.push(key)
           }
       }
      this.setState({
        updated: false,
        confirmedList: confirmed
      })
    }
  }

  confirmedHandler(){
    var new_state = !this.state.confirmed
    this.setState({
      confirmed:new_state,
    })
  }


  render(){
    var list = this.state.initialList
    var self = this
    var confirmed = this.state.confirmed

    return(
      <SafeAreaView>
            <View style={styles.container}>
              {Object.entries(list).map(function(item,index){
                return(
                  <Pressable key={index} onPress={() => self.itemSelectedHandler(item)}>
                    {item[1] === false ?
                      (
                        <Text accessible={true} accessibilityLabel={item[0]} accessibilityRole="button"
                         accessibilityHint="Click to select this ingredient" style={styles.blueButton}>{item}</Text>
                      )
                      :
                      (
                        <Text accessible={true} accessibilityLabel={item[0]} accessibilityRole="button"
                         accessibilityHint="Click to deselect this ingredient" style={styles.greenButton}>{item}</Text>
                      )
                    }
                  </Pressable>
                )
               }
              )}
            </View>
            <View style={{alignItems:"center",marginTop:40}}>
                <Pressable onPress={() =>this.props.updateListHandler(this.state.confirmedList)}
                    onPressIn={this.confirmedHandler}>
                      { confirmed === false ?
                        (
                          <Text accessible={true} accessibilityLabel="Confirm" accessibilityRole="button"
                           accessibilityHint="Click to confirm your ingredients" style={styles.greenButton}>Confirm Selection</Text>
                        )
                        :
                        (
                          <Text accessible={true} accessibilityLabel="Change selection" accessibilityRole="button"
                           accessibilityHint="Click to change your ingredients" style={styles.blueButton}>Change selection</Text>
                        )
                      }
                </Pressable>
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


export {WetIngredientsChecklist};
