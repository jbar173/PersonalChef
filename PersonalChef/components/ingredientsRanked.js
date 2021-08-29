import React from 'react';
import * as data from './checklists/json_ingredient_lists/all.json';
import { StyleSheet, Text, Pressable, View, SafeAreaView, ScrollView } from 'react-native';


class RankedDict extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        initialData: {
          "ingredients": [],
          "ingredientCount": 0,
        },
        ranked_ingredients: {},
      },
      this.componentDidMount = this.componentDidMount.bind(this)
      this.sortByCountFunction = this.sortByCountFunction.bind(this)
   };

  componentDidMount(){
    console.log("Ranked ingredients mounted")
    var ingrs_json = data.children
    var ranked_ingrs =  ingrs_json.sort(this.sortByCountFunction);
    this.setState({
      ranked_ingredients:ranked_ingrs,
    })
  }

  sortByCountFunction(a,b){
    if (a.count < b.count) {
        return 1;
    }
    if (a.count > b.count) {
        return -1;
    }
    return 0;
  }


 render(){
   var length = this.state.ranked_ingredients.length

   return(
           <SafeAreaView style={styles.container}>
             <ScrollView>
                 <View>
                       { length && <View>
                                       {this.state.ranked_ingredients.map(function(item,index){
                                           return(
                                             <View key={item.count}>
                                               <Text>{item.count}. {item.name}</Text>
                                             </View>
                                           )
                                          }
                                        )}
                                   </View>
                        }
                  </View>
              </ScrollView>
            </SafeAreaView>
        );
   }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal:20,
  },
})




export { RankedDict };
