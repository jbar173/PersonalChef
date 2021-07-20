import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback, Pressable } from 'react-native';


class ApiCalls extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      fResponse: [],
      urlList: [],
      keywords: this.props.keywords,
      initial: this.props.initialRecipeLinkList
    },
    this.apiCall = this.apiCall.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.sortResponse = this.sortResponse.bind(this)
  };

    componentDidMount(){
      this.apiCall()
    }

    componentDidUpdate(){
      if(this.state.fResponse.length != 0 && this.state.urlList.length === 0) {
        this.sortResponse()
      }
    }

    apiCall(){
      console.log("calling APIs")
      var keywords = this.state.keywords
      var b = 'b'    // app_id
      var c = 'c'    // app_key
      // var url = `https://api.edamam.com/api/recipes/v2?type=public&q=${keywords}&app_id=${b}&app_key=${c}&ingr=${ing_co}&field=label`
      var test_url = `https://api.edamam.com/api/recipes/v2?type=public&q=${keywords}&app_id=f70ab024&app_key=1bc57900faadcf33ca18df72b930788e&field=label`
      console.log("test_url: " + test_url)
      fetch(test_url)
      .then(response => response.json())
      .then(data => {
          this.setState({
            fResponse:data
          })
      })
    }

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
         console.log("No recipes found, rejigging your ingredients and searching again")
      }else{
         console.log("Less than 30 recipes found")
         for(recipe in this.state.fResponse['hits']){
           var link = this.state.fResponse['hits'][recipe]['_links']['self']['href']
           urls.push(link)
         }
         this.setState({
           urlList:urls
         })
       }
    }


    render(){

        return (
                <View>
                  <Pressable onPress={() => this.props.firstAPICall(this.state.urlList)}>
                    <Text>..........</Text>
                  </Pressable>
                </View>
               );
    }
};

export { ApiCalls };
