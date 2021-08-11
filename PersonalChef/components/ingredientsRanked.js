import React from 'react';
// import cleaned_ingredients from get_common_ingredients.py


class GetLowestRanked extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        initialData: {
          "ingredients": [],
          "ingredientCount": 0,
        },
      }
      const Ranks = {
        '1': 'salt',
        '2': 'pepper',
        '3': 'onion',
        '4': 'stock',
      }
      this.componentDidMount = this.componentDidMount.bind(this)
      this.countIngredientOccurences = this.countIngredientOccurences.bind(this)
   };

  componentDidMount(){
    console.log("Ranked ingredients mounted")
    // setstate of ingredients as cleaned_ingredients (from python file)
    this.countIngredientOccurences()
  }


  countIngredientOccurences(){
    var list = this.state.ingredients
    var already_found = {}
    var length = list.length
    var found = false
    var i
    for(i=0;i<length;i++){
      var item = list[i]
      for([key,value] of Object.entries(already_found)){
        if(key === item){
          value++
          found = true
          break;
        }
      }
      if(found === true){
        // pop item from list
        i--
      }else{
        already_found.`${item}` = 1
        // pop item from list
        i--
      }
    }
      //

    }

 };
 
export { GetLowestRanked };
