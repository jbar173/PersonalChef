import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable } from 'react-native';


class ApiCalls extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      fResponse: [],
      keywords: this.props.keywords,
      next: 'first',
      count: null,
      call: 0,
      maxCalls: 0,
      call_over: false,
    },
    this.apiCall = this.apiCall.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.finishedHandler = this.finishedHandler.bind(this)
  };

  componentDidMount(){
    console.log("Api component mounted")
    this.apiCall()
  }

  componentDidUpdate(){
    console.log("this.state.next: " + this.state.next)
    console.log("this.state.count: " + this.state.count)

    if(this.state.count !== null){
      console.log("count has been set")
    }else{
      var values = [10,]
      var maximum = count/20
      console.log("maximum: " + maximum)
      if(maximum >= 10){
        this.setState({
          maxCalls:10
        })
      }else{
        this.setState({
          maxCalls: maximum
        })
        values.push(maximum)
      }
    }
    // Checks whether api function has finished calling
    //  each page, triggers next function if so:
    if(values.includes(this.state.call)) {
      this.finishedHandler()
    }else{
      this.apiCall()
    }
    // Marks the component as finished with its calls:
    if(this.state.call_over === true){
      console.log("finished")
      this.finishedHandler()
    }
 }

// Calls first api 10 times (allowance is 10 hits per minute),
//  collects 200 recipe apis (if that many are returned):
  apiCall(){
    console.log("calling APIs")

    var keywords = this.state.keywords
    var num = this.state.call

    if(this.state.next === 'first'){
      var url = `https://api.edamam.com/api/recipes/v2?type=public&q=${keywords}&app_id=f70ab024&app_key=ac8f093ed1576baa704c95c1df284d3f&field=label`

    }else{
      var url = this.state.next
    }
    num += 1

    fetch(url)
    .then(response => response.json())
    .then(data => {
        this.setState({
          fResponse: [
            ...this.state.fResponse,
            data
          ],
          next: data['_links']['next']['href'],
          count: data['count'],
          call: num
        })
    })
  }


// Passes back the recipe url list to the
//  main RecipeResults component:
  finishedHandler(){
    var initial = this.state.fResponse
    this.props.passDataBack(initial)
    this.setState({
      call_over: true
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
