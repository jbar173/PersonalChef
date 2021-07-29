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
        checked: false,

        startRefine: false,
        filtered: false,
        finished: false,
        batch: 1,

        ingredients_rough: {},
        firstResponse: [],

        initialRecipeLinkList: [],
        secondHalfLinkList: [],
        responseList: [],

        refinedRecipeList: [],

      }

      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentDidUpdate = this.componentDidUpdate.bind(this)
      this.populateInitialData = this.populateInitialData.bind(this)
      this.fetchIndividualRecipes = this.fetchIndividualRecipes.bind(this)
      this.getFilteredRecipes = this.getFilteredRecipes.bind(this)
      this.apiCallFinished = this.apiCallFinished.bind(this)
      this.checkResponseList = this.checkResponseList.bind(this)

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
    this.checkResponseList()

    if(this.state.update_initial === true){
        this.populateInitialData()
    }
    if(this.state.callIndividual === true){
        this.fetchIndividualRecipes()
        this.setState({
          callIndividual: false,
        })
    }
  }

// Takes data passed from confirm.js (previous screen),
//  populates this component's state with the data,
//  then triggers ApiCalls component to load (by setting
//  apiCall:true ):
  populateInitialData(){
    console.log("populating initial data")
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

// Function is triggered by ApiCalls' finishedHandler function.
//  If the first api call returns nothing it catches here
//  at the moment (will write something in ApiCalls to make sure
//  something is returned), (eg.
//  knock an ingredient off (one with the lowest ranking)
//  until some results are found, using ingredientsRanked.js.)
//  The remainder of the function divides the url list
//  into two (explanation below). Finally the function sets
//  callIndividual:true which triggers the next function
//  via ComponentDidUpdate():
  apiCallFinished(initial){
    console.log("api call finished function")
    if(initial.length === 0){
      console.log("Still searching...")
      this.setState({
        apiCall:false,
      })
     // deal with this catch in ApiCalls (explained above)
     }
    // Site only allows 10 api calls/min. Statement below reduces from
    // a potential 20 responses to 10 maximum (stores the other half
    // to be called later in getFilteredRecipes() ):
    var second = this.state.secondHalfLinkList
    if(initial.length>10){
      var second_half = initial.slice(0,10)
      initial.splice(0,10)
      this.setState({
        initialRecipeLinkList: initial,
        secondHalfLinkList: second_half,
        apiCall: false,
        callIndividual: true
      })
    }
  }

// Calls api for each recipe, stores responses in responseList:
  fetchIndividualRecipes(){
    var url_list = this.state.initialRecipeLinkList
    for(link in url_list){
      var url = `${url_list[link]}`
      console.log("individual url: " + url + "\n")
      fetch(url)
      .then(response => response.json())
      .then(data =>
          this.setState({
            responseList: [
              ...this.state.responseList,
              data
            ],
          })
       )
    }
  }

// On each component update, runs a check to make sure
//  that each individual recipe response has been
//  collected and stored in responseList (checks length
//  of responseList compared to length of
//  initialRecipeLinkList to verify this), before triggering
//  startRefine if it has (which triggers RefineResults component):
  checkResponseList(){
    console.log("...check triggered...")
    var values = [undefined,0]
    var length = this.state.responseList.length

    if(!(values.includes(this.state.responseList.length)) && this.state.checked === false){
      if(length==this.state.initialRecipeLinkList.length){
        console.log("***same length")
        this.setState({
          checked:true,
          startRefine: true
        })
      }else{
        console.log("pass")
      }
    }
  };

// When RefineResults component has finished, this function is triggered
//  via onPress(). Function catches if 0 results have been returned,
//  checks whether all 20 responses have been called and refined yet,
//  or just the first 10 (state.batch will be 1 if only 10).
//  If batch is 1, increments batch and sets state
//  initialRecipeLinkList: secondHalfLinkList, then call_individual: true,
//  starts the above process again with the second 10 links:
  getFilteredRecipes(filtered_results){
    console.log("filtered initial")
    var next = this.state.secondHalfLinkList

    if(filtered_results.length === 0){
      console.log("0 results. Results section not rendered")
      var count = this.state.batch
      if(count === 1){
        this.setState({
          initialRecipeLinkList: next,
          callIndividual: true,
          checked: false,
          startRefine: false,
          batch: 2
        })
        return 1;
      }else{
        console.log("No matches in the first 20 responses")
        // Build app out further to get next 20 responses (count 21 - 41)
        this.setState({
          finished: true,
          startRefine: false
        })
        return 1;
      }
    }

    console.log("Results found")
    this.setState({
      refinedRecipeList: filtered_results,
      filter: true,
      finished: true,
      startRefine: false
    })

  }


  render(){
    var first_response = this.state.firstResponse
    var refined = this.state.refinedRecipeList
    var filter = this.state.filter
    var api_call = this.state.apiCall
    var start_refine = this.state.startRefine

    return(

      <SafeAreaView style={styles.container}>
        <ScrollView>

            { filter === false ?

                (
                  <View style={styles.container}>

                        <Text accessible={true} accessibilityLabel="Searching"
                          accessibilityRole="text"
                          style={styles.mainTitle}>Searching...</Text>

                        {api_call === true && <ApiCalls
                            keywords={this.state.initialData.ingredients}
                            initialRecipeLinkList={this.state.initialRecipeLinkList}
                            passDataBack = {this.apiCallFinished} />
                        }

                        {start_refine === true && <RefineResults
                            getFilteredRecipes={this.getFilteredRecipes}
                            initialResponseList={this.state.responseList}
                            maxTime={this.state.initialData.time}
                            maxIngredients={this.state.initialData.ingredientCount}/>
                        }

                  </View>
                )

                :

                (
                  <View style={styles.container}>
                      <Text accessible={true} accessibilityLabel= "Recipe List" accessibilityRole="text"
                        style={styles.mainTitle}>Your recipes</Text>
                        {refined.map(function(item,index){
                           return(
                                    <View key={index}>

                                        <Text accessible={true} accessibilityRole="text"
                                          accessibilityLabel={item['recipe']['label'].toString()}
                                          style={styles.title}> {index+1}. {item['recipe']['label']}</Text>

                                        <Text accessible={true} accessibilityHint="Total time to make dish" accessibilityRole="text"
                                          accessibilityLabel={item['recipe']['totalTime'].toString()}>
                                            Takes: {item['recipe']['totalTime']} minutes
                                        </Text>

                                        <Pressable onPress={() => Linking.openURL(`${item['recipe']['url']}`)}>
                                          <Text accessible={true} accessibilityLabel="Go to recipe website" accessibilityRole="link"
                                            style={styles.greenButton}>Go to recipe website</Text>
                                        </Pressable>

                                    </View>
                                  )
                             }
                           )
                         }
                        <Pressable style={styles.blueButton}>
                            <Link accessible={true} accessibilityLabel= "Start again"
                                accessibilityHint="Click button to go back to homepage"
                                to="/" accessibilityRole="button">Start again
                            </Link>
                        </Pressable>
                   </View>
                 )

            }

          </ScrollView>
        </SafeAreaView>

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
    textAlign: 'center',
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
