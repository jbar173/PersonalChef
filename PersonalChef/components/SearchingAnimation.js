import React from 'react';



class Searching extends React.Component {
    constructor(props){
      super(props);
      this.componentDidMount = this.componentDidMount.bind(this)
      this.componentWillUnmount = this.componentWillUnmount.bind(this)
    };

  componentDidMount(){
    console.log("Trigger animation here")
  }

  componentWillUnmount(){
    console.log("stop animation here")
  }


  render(){

    return(
            <View>
              <Text>Searching animation here...</Text>
            </View>

          );

   }

};

export { Searching };
