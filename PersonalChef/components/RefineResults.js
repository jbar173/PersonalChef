import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';


const RefineResults = props => {

  console.log("refining")
  console.log("props.initialResponseList: " + props.initialResponseList)
  var max_time = props.maxTime
  var response_list = props.initialResponseList.flat()
  response_list = response_list.flat()
  var filtered_results = []
  if(response_list[0] != undefined){
    for(item in response_list){
      if(response_list[item]['recipe']['totalTime'] > max_time || response_list[item]['recipe']['totalTime'] == 0){
        response_list.splice(item,1);
        console.log("2. response_list.length: " + response_list.length);
      }
    }
  }
  filtered_results = response_list

  return(
      <View>
        <Pressable onPress={() => props.filterIndividualRecipes(filtered_results)}>
          <Text  accessible={true} accessibilityLabel="See your recipes" style={styles.greenButton}>See your recipes</Text>
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
});


export { RefineResults };
