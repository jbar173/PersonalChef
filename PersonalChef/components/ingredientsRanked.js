import React from 'react';


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
   };

  componentDidMount(){
    console.log("Ranked ingredients mounted")
  }


};


export { GetLowestRanked };
