import React from 'react';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";


class DryIngredientsChecklist extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      initialList: {
        flour: false,
        sugar: false,
        pasta: false,
      },
      updated:false,
      confirmedList:[],
      confirmed: false
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
      <View>
        <View style={{alignItems:"flex-start"}}>
          {Object.entries(list).map(function(item,index){
            return(
              <Pressable key={index} onPress={() => self.itemSelectedHandler(item)}>
                {item[1] === false ?
                  (
                    <Text style={styles.blueButton}>{item}</Text>
                  )
                  :
                  (
                    <Text style={styles.greenButton}>{item}</Text>
                  )
                }
              </Pressable>
            )
           }
          )}
        </View>
        <View style={{alignItems:"center"}}>
            <Pressable onPress={() =>this.props.updateListHandler(this.state.confirmedList)}
              onPressIn={this.confirmedHandler}>
                { confirmed === false ?
                  (
                    <Text style={styles.greenButton}>Confirm Selection</Text>
                  )
                  :
                  (
                    <Text style={styles.blueButton}>Change selection</Text>
                  )
                }
            </Pressable>
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


export {DryIngredientsChecklist};
