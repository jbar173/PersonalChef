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
      noMorePages: false,
      call: 0,
      maxCalls: null,
    },
    this.abortController = new AbortController()
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.apiCall = this.apiCall.bind(this)
    this.finishedHandler = this.finishedHandler.bind(this)
  };

  componentDidMount(){
    console.log("Api component mounted")
    console.log("this.state.keywords.length: " + this.state.keywords.length)
    this.apiCall()
  }

  componentWillUnmount(){
    console.log("Api component unmounted")
    this.abortController.abort()
  }

  componentDidUpdate(){
    console.log("Api component updated")
    console.log("this.state.count: " + this.state.count)
    console.log("maxCalls: " + this.state.maxCalls)

    if(this.state.maxCalls === null){
      var maximum = this.state.count/20
      console.log("maximum: " + maximum)
      if(maximum >= 10){
        this.setState({
          maxCalls:10
        })
      }else if(maximum < 0.05){
          this.setState({
            fResponse: ['no results',],
            count: 0,
            finish: true
          })
      }else{
        this.setState({
          maxCalls: maximum
        })
      }
    }
    // Checks whether api function has finished calling
    //  each page, triggers next function if so:
    if(this.state.call === this.state.maxCalls || this.state.noMorePages) {
      this.finishedHandler()
    }else{
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
        try{
          var x = this.state.next
          var url = x['next']['href']
          console.log("this url: " + url)
        }catch{
          console.log("No next page")
          this.setState({
            noMorePages: true
          })
        }
    }
    num += 2
    console.log("num: " + num)
    fetch(url, { signal: this.abortController.signal } )
    .then(response => response.json())
    .then(data => {
        this.setState({
          fResponse: [
            ...this.state.fResponse,
            data
          ],
          count: data['count'],
          next: data['_links'],
          call: num,
        })
    })
    .catch(error => {
      console.log("API CALL ERROR: " + error)
    });
  }

// Passes back the recipe url list to the
//  main RecipeResults component:
  finishedHandler(){
    console.log("finished handler")

    if(this.state.count !== null){
      console.log("this.state.fResponse.count: " + this.state.fResponse.count)
      var initial = this.state.fResponse
      this.props.passDataBack(initial)
    }else{
      console.log("FIRST CATCH")
      var initial = ['empty',]
      this.props.passDataBack(initial)
    }
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
