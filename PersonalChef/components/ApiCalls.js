import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable } from 'react-native';


class ApiCalls extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      fResponse: [],
      keywords: this.props.keywords,
      initial: this.props.initialRecipeLinkList,
      call_over: false,
    },
    this.apiCall = this.apiCall.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.sortResponse = this.sortResponse.bind(this)
  };

    componentDidMount(){
      console.log("Api component mounted")
      this.apiCall()
    }

    componentDidUpdate(){
      if(this.state.fResponse.length != 0 && this.state.initial.length === 0) {
        this.sortResponse()
      }
      if(this.state.call_over === true){
        this.finishedHandler()
      }
    }

// Calls first api, returns a list of recipe urls for recipe
//  labels which contain one or more of the keywords:
    apiCall(){
      console.log("calling APIs")
      var keywords = this.state.keywords
      // var b = 'b'     app_id
      // var c = 'c'     app_key
      var test_url = `https://api.edamam.com/api/recipes/v2?type=public&q=${keywords}&app_id=f70ab024&app_key=ac8f093ed1576baa704c95c1df284d3f&field=label`
      fetch(test_url)
      .then(response => response.json())
      .then(data => {
          this.setState({
            fResponse: data,
          })
      })
    }

// Catches if 0 responses found, else pushes the url for each
//  recipe's individual api call into a list:
    sortResponse(){
      var count = this.state.fResponse['count']
      var urls = []
      console.log("count: " + count)
      if(count > 0 && count < 30){
        console.log("Less than 30 recipes found")
      }

      if(count === undefined){
         console.log("pass")
      }else if(count === 0){
         console.log("No recipes found, widening search")
      }else{
         console.log("Less than 30 recipes found")
         for(recipe in this.state.fResponse['hits']){
           var link = this.state.fResponse['hits'][recipe]['_links']['self']['href']
           urls.push(link)
         }
         this.setState({
           initial: urls,
           call_over: true,
         })
       }
    }

// Passes back the recipe url list to the
//  main RecipeResults component:
    finishedHandler(){
      var initial = this.state.initial
      this.props.passDataBack(initial)
      this.setState({
        call_over: false
      })
    }

    render(){
      return(
              <View>
                <Text></Text>
              </View>
           );
    }

};

export { ApiCalls };


const styles = StyleSheet.create({
  greenButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
  },
});
