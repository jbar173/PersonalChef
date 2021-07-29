import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';



const RefineResults = props => {

  console.log("refining")

  var response_list = props.initialResponseList
  var length = response_list.length
  var filtered_results = []

 // filter out dishes that take too long to make:
  var max_time = props.maxTime
  var i
  for(i=0;i<length;i++){
    try{
      var recipe_time = response_list[i]['recipe']['totalTime']
      if(recipe_time > max_time || recipe_time == '0'){
          response_list.splice(i,1);
          length = response_list.length
          i--;
        }
    }catch(error){
      console.log(i + ": times error: " + error);
      response_list.splice(i,1)
    }
  }

// filter out recipes which contain more ingredients than user has:
  var length = response_list.length
  var max_ingredients = props.maxIngredients
  var j
  for(j=0;j<length;j++){
    try{
      var recipe_ings = response_list[j]['recipe']['ingredients']
      var ingredient_list_length = recipe_ings.length
      if(ingredient_list_length > max_ingredients){
        response_list.splice(j,1)
        length = response_list.length
        j--;
      }
    }catch(error){
      console.log(j + ": ingredient count error: " + error)
      response_list.splice(j,1)
    }
  }

  filtered_results = response_list

  return(
      <View>
        <Text accessible={true}
              accessibilityLabel= "Search is complete"
              accessibilityRole="text"
              style={styles.mainTitle}>Complete!</Text>
        <Pressable onPress={() => props.getFilteredRecipes(filtered_results)}>
          <Text accessible={true} accessibilityLabel="Go to your recipes" accessibilityRole="button"
           style={styles.greenButton}>See your recipes</Text>
        </Pressable>
      </View>
    );

};



const styles = StyleSheet.create({
  greenButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
  },
  mainTitle: {
    fontSize:28,
    marginBottom:20
  },
});


export { RefineResults };
