import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";


class ResultsInitial extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        userId: 12345,
        initialData: {
          "time":'0',
          "ingredients":[],
          "ingredientCount":0,
          "type":'',
        },
        both: false,
        update_initial: false,
        apiCall: false,
        sortFirst: false,
        callIndividual: false,
        refineRecipes: false,

        ingredients_rough: {},
        firstResponse: {},

        initialRecipeLinkList: [],
        responseList: [],

        refinedRecipeList:[],
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.populateInitialData = this.populateInitialData.bind(this)
      this.firstAPICall = this.firstAPICall.bind(this)
      this.fetchIndividualRecipes = this.fetchIndividualRecipes.bind(this)
      this.filterIndividualRecipes = this.filterIndividualRecipes.bind(this)
    };


  componentDidMount(){
      console.log("Results mounted")
      var initial_data = this.props.location.state.initial_data
      var either = this.props.location.state.either
      var ingreds = this.props.location.state.ingreds
      this.setState({
        initialData:initial_data,
        ingredients_rough:ingreds,
        both:either,
        update_initial: true
      })
   }


  componentDidUpdate(){
      console.log("results did update")
      console.log("**this.state.responseList.length: " + this.state.responseList.length)

      if(this.state.update_initial === true){
          this.populateInitialData()
      }
      if(this.state.apiCall === true){
          this.firstAPICall()
      }
      if(this.state.sortFirst === true){
          this.sortFirstAPICall()
      }
      if(this.state.callIndividual === true){
          this.fetchIndividualRecipes()
      }
      if(this.state.refineRecipes === true){
          this.filterIndividualRecipes()
      }
   }


  populateInitialData(){
    var rough = this.state.ingredients_rough
    var final = []
    for([key,value] of Object.entries(rough)){
      final.push(rough[key])
    }
    final = final.flat()
    this.setState({
      initialData: {
        ...this.state.initialData,
        ingredients: final,
        ingredientCount: final.length
      },
      update_initial: false,
      apiCall: true
    })
  }


  firstAPICall(){
    console.log("calling the first api")
    var keywords = this.state.initialData.ingredients
    var b = 'b'    // app_id
    var c = 'c'    // app_key
    var ings = this.state.initialData.ingredientCount
    // var ing_co = `1-${ings}`
    var x = 1
    var y = 20
    var ing_co = `${x}-${y}`
    // var url = `https://api.edamam.com/api/recipes/v2?type=public&q=${keywords}&app_id=${b}&app_key=${c}&ingr=${ing_co}&field=label`
    var test_url = `https://api.edamam.com/api/recipes/v2?type=public&q=${keywords}&app_id=f70ab024&app_key=1bc57900faadcf33ca18df72b930788e&field=label`
    console.log("test_url: " + test_url)
    fetch(test_url)
    .then(response => response.json())
    .then(data =>
        this.setState({
          firstResponse: data,
          apiCall: false,
          sortFirst: true,
        })
      )
      .catch(function(err) {
          console.log('Error fetching recipes: ' + err.message);
          console.log('Error stack: ' + err.stack);
      });
  }

  sortFirstAPICall(){
     var first_response = this.state.firstResponse
     // console.log("this.state.firstResponse['count']: " + this.state.firstResponse['count'])
     var count = this.state.firstResponse['count']
     if(count === undefined){
       console.log("pass")
     }else if(count === 0){
       console.log("No recipes found, rejigging your ingredients and searching again")
     }else if(count > 0 && count < 30){
       console.log("Less than 30 recipes found")
       var urls = []
       for(recipe in first_response['hits']){
         var link = first_response['hits'][recipe]['_links']['self']['href']
         urls.push(link)
       }
       this.setState({
         sortFirst: false,
         initialRecipeLinkList: urls,
         callIndividual: true
       })
       return console.log("success");
     }else{
       // console.log("first_response['hits'][0]['recipe']['label']: " + first_response['hits'][0]['recipe']['label'])
       // console.log("first_response['hits'][0]['_links']['self']['href']: " + first_response['hits'][0]['_links']['self']['href'])
       this.setState({
         sortFirst: false,
         initialRecipeLinkList: urls,
         callIndividual: true
       })
       return console.log("success");
     }
     this.setState({
       sortFirst: false
     })
  }

  fetchIndividualRecipes(){
    var url_list = this.state.initialRecipeLinkList
    var responses = []
    for(link in url_list){
      var url = `${url_list[link]}`
      console.log("individual url: " + url)
      fetch(url)
      .then(response => response.json())
      .then(data =>
          this.setState({
            responseList: [
              ...this.state.responseList,
              data
            ],
            callIndividual: false,
            refineRecipes: true
          })
        )
    }
  }

  filterIndividualRecipes(){
    console.log("filtering initial")
    var response_list = []
    for(i in this.state.responseList){
      response_list.push(i)
    }
    var max_time = this.state.initialData.time
    console.log("response_list.length: " + response_list.length)

    // filter by initialData.time value here

    this.setState({
      refineRecipes: false,
      // responseList: response_list
    })
  }


  render(){
    var first_response = this.state.firstResponse
    var refined = this.state.refinedRecipeList

    return(

          <View style={styles.container}>
            <Text style={styles.mainTitle}>Your recipes!</Text>
            <Link to="/"><Text style={styles.blueButton}>Start again</Text></Link>

            <Text>Results:</Text>
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
  mediTitle: {
    fontSize:24,
    marginBottom:20
  },
  title: {
    fontSize:18,
  },
  mainTitle: {
    fontSize:28,
    marginBottom:20
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


export { ResultsInitial };
