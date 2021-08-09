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
      maxCalls: null,
      call_over: false,
      finish: false
    },
    this.abortController = new AbortController()
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.apiCall = this.apiCall.bind(this)
    this.onePageOfResults = this.onePageOfResults.bind(this)
    this.finishedHandler = this.finishedHandler.bind(this)
  };


  componentDidMount(){
    console.log("Api component mounted")
    this.apiCall()
  }

  componentWillUnmount(){
    console.log("Api component unmounted")
    this.abortController.abort()
  }

  componentDidUpdate(){
    console.log("this.state.count: " + this.state.count)

    if(this.state.maxCalls !== null){
      console.log("maxCalls has been set")
      console.log("maxCalls: " + this.state.maxCalls)
    }else{
      var values = [10,]
      var maximum = this.state.count/20
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

    if(this.state.next === 'none'){
      this.onePageOfResults()
    }
    // Checks whether api function has finished calling
    //  each page, triggers next function if so:
    if(this.state.call === this.state.maxCalls || this.state.finish) {
      this.finishedHandler()
    }else if(this.state.next !== 'none'){
      this.apiCall()
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
      console.log("test_url: " + url)
    }else{
      var url = this.state.next
      console.log("this url: " + url)
    }
    num += 1
    fetch(url, { signal: this.abortController.signal } )
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
    .catch(error => {
      console.log("api call error: " + error)
      this.setState({
        call: 0,
        maxCalls: 1,
        next: 'none',
      })
    });
}


// In case only 1 page of results (executes after catch statement in apiCall() sets next:'none'):
  onePageOfResults(){
    var keywords = this.state.keywords
    if(this.state.next === 'none'){
      var url = `https://api.edamam.com/api/recipes/v2?type=public&q=${keywords}&app_id=f70ab024&app_key=ac8f093ed1576baa704c95c1df284d3f&field=label`
      fetch(url, { signal: this.abortController.signal } )
      .then(response => response.json())
      .then(data => {
          this.setState({
            fResponse: [
              ...this.state.fResponse,
              data
            ],
            count: data['count'],
            finish: true
          })
      })
      .catch(error => {
        console.log("Single page error: " + error)
      })
  }
}


// Passes back the recipe url list to the
//  main RecipeResults component:
  finishedHandler(){
    var initial = this.state.fResponse
    this.props.passDataBack(initial)
    this.setState({
      finish: false
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
