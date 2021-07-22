import React from 'react';
import { StyleSheet, Text, View, Button, Pressable, Linking, SafeAreaView, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import { RefineResults } from './RefineResults.js';
import { ApiCalls } from './ApiCalls.js';


class RecipeResults extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        userId: 12345,
        initialData: {
          "time": '0',
          "ingredients": [],
          "ingredientCount": 0,
          "type": '',
        },
        both: false,
        update_initial: false,
        apiCall: false,
        callIndividual: false,
        filter: false,
        finished: false,

        ingredients_rough: {},
        firstResponse: [],

        initialRecipeLinkList: [],
        responseList: [],

        refinedRecipeList: [],
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
      initialData: initial_data,
      ingredients_rough: ingreds,
      both: either,
      update_initial: true
    })
  }


  componentDidUpdate(){
    console.log("results did update")
    if(this.state.update_initial === true){
        this.populateInitialData()
    }
    if(this.state.callIndividual === true){
        this.fetchIndividualRecipes()
    }
    if(this.state.filter === true && this.state.finished === false){
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


  firstAPICall(url_list){
    console.log("called the first api")
    this.setState({
      initialRecipeLinkList: url_list,
      apiCall: false,
      callIndividual:true
    })
  }


  fetchIndividualRecipes(){
    var url_list = this.state.initialRecipeLinkList
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
          })
       )
    }
  }


  filterIndividualRecipes(filtered_results){
    console.log("filtered initial")
    var results = filtered_results.flat()
    this.setState({
      refinedRecipeList: results,
      finished: true,
      filter: true
    })
  }


  render(){
    var first_response = this.state.firstResponse
    var refined = this.state.refinedRecipeList
    var filter = this.state.filter
    var api_call = this.state.apiCall

    return(

        <View>

              { filter === false ?

                  (
                    <View style={styles.container}>
                          <Text accessible={true} accessibilityLabel= "Searching" accessibilityRole="text"
                            style={styles.mainTitle}>Searching...</Text>
                          <Text accessible={true} accessibilityLabel= "Search is complete" accessibilityRole="text"
                            style={styles.mainTitle}>Complete</Text>
                            {api_call === true ?
                              (
                                <ApiCalls firstAPICall={this.firstAPICall}
                                  keywords={this.state.initialData.ingredients}
                                  initialRecipeLinkList={this.state.initialRecipeLinkList}/>
                              )
                              :
                              (
                                <br/>
                              )
                            }
                          <RefineResults filterIndividualRecipes={this.filterIndividualRecipes}
                            initialResponseList={this.state.responseList} maxTime={this.state.initialData.time}/>
                    </View>
                  )

                  :

                  (
                    <View style={styles.container}>
                        {refined.map(function(item,index){
                           return(
                                    <View key={item} style={styles.container}>

                                        <Text accessible={true} accessibilityLabel= {item['recipe']['label']} accessibilityRole="text"
                                          style={styles.title}>{index+1}. {item['recipe']['label']}</Text>

                                        <Text accessible={true} accessibilityHint="Total time to make dish" accessibilityRole="text"
                                          accessibilityLabel= {item['recipe']['totalTime']}>
                                          Takes: {item['recipe']['totalTime']} minutes
                                        </Text>

                                        <Pressable onPress={() => Linking.openURL(`${item['recipe']['url']}`)}>
                                          <Text accessible={true} accessibilityLabel= "Go to recipe website" accessibilityRole="link"
                                            style={styles.greenButton}>Go to recipe website</Text>
                                        </Pressable>

                                    </View>
                                  )
                             }
                           )
                         }
                        <Link accessible={true} accessibilityLabel= "Start again" to="/" accessibilityRole="button">
                          <Text style={styles.blueButton}>Start again</Text>
                        </Link>
                     </View>
                   )

              }

        </View>

      );
    }

};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  mediTitle: {
    fontSize:24,
    marginBottom:20
  },
  title: {
    fontSize:18,
    fontWeight:'bold'
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
    padding: 7,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    marginHorizontal: 80,
  },
});


export { RecipeResults };
