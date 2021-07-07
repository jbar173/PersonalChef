import React from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, TextInput } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";



class HomePage extends React.Component {
      constructor(props){
      super(props);
      this.state = {
        userId: 12345,
      }
  };

  render(){
      return(
        <View style={styles.container}>

            <Text style={styles.mainTitle}>PersonalChef</Text>
            <TouchableHighlight underlayColor="white">
                <Link to="/type-time/" >
                  <Text style={styles.greenButton}>Find a recipe for your ingredients</Text>
                </Link>
            </TouchableHighlight>

        </View>
      );
   }
};


class TimeAndType extends React.Component {
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
      initialRecipeList: [],
      refinedRecipeList:[],
      times: {
        "hours":'0',
        "mins":'0'
      },
    }
    this.radioButtonPressedHandler = this.radioButtonPressedHandler.bind(this)
    this.onChangeTimeHoursHandler = this.onChangeTimeHoursHandler.bind(this)
    this.onChangeTimeMinsHandler = this.onChangeTimeMinsHandler.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
  };

   radioButtonPressedHandler(value){
      if (value === "dessert" || value === "other"){
        this.setState({
          initialData:{
            ...this.state.initialData,
            type:value
          }
        })
      }else{
        this.setState({
          initialData:{
            ...this.state.initialData,
            type:"other"
          },
          both:true
        })
      }
    }

    onChangeTimeHoursHandler(input){
      var hours_in_mins = input*60
      this.setState({
        times:{
          ...this.state.times,
          hours:hours_in_mins
        }
      })
    }

    onChangeTimeMinsHandler(input){
      this.setState({
        times:{
          ...this.state.times,
          mins:input
        }
      })
    }

    componentDidUpdate(){
      console.log("# updated")
    }

    render(){
      var recipe_type = this.state.initialData.type
      var initial = this.state.initialData
      var either = this.state.both
      var times = this.state.times

      return(
            <View style={styles.container}>
                <View style={styles.container}>
                <Text style={styles.mediTitle}>Time and type page</Text>
                    <Text>How much time do you have?</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={text => this.onChangeTimeHoursHandler(text)}
                      placeholder='0 hours'
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={text => this.onChangeTimeMinsHandler(text)}
                      placeholder='10 minutes'
                      keyboardType="numeric"
                    />
                </View>
                <View style={styles.container}>

                    { recipe_type === "" ?

                       (
                        <View style={styles.container}>
                            <Text style={{paddingBottom:10}}>What type of meal are you looking for?</Text>

                                <TouchableHighlight underlayColor="white">
                                  <Button onPress={() => this.radioButtonPressedHandler("dessert")} style={styles.blueButton}
                                    title="Dessert" accessibilityLabel="Dessert" />
                                </TouchableHighlight>

                                <TouchableHighlight underlayColor="white">
                                  <Button onPress={() => this.radioButtonPressedHandler("other")} style={styles.blueButton}
                                    title="Starter or Main" accessibilityLabel="Starter or Main" />
                                </TouchableHighlight>

                                <TouchableHighlight underlayColor="white">
                                  <Button onPress={() => this.radioButtonPressedHandler("both")} style={styles.blueButton}
                                    title="Either" accessibilityLabel="Either" />
                                </TouchableHighlight>

                            <TouchableHighlight underlayColor="white">
                                  <Link to="/"><Text style={styles.blueButton}>Back</Text></Link>
                            </TouchableHighlight>

                        </View>
                       )

                       :

                       (
                         <View style={styles.container}>

                             <Text style={{paddingBottom:10}}>What type of meal are you looking for?</Text>

                                   <TouchableHighlight underlayColor="white">
                                     <Button onPress={() => this.radioButtonPressedHandler("dessert")} style={styles.blueButton}
                                       title="Dessert" accessibilityLabel="Dessert" />
                                   </TouchableHighlight>

                                   <TouchableHighlight underlayColor="white">
                                     <Button onPress={() => this.radioButtonPressedHandler("other")} style={styles.blueButton}
                                       title="Starter or Main" accessibilityLabel="Starter or Main" />
                                   </TouchableHighlight>

                                   <TouchableHighlight underlayColor="white">
                                     <Button onPress={() => this.radioButtonPressedHandler("both")} style={styles.blueButton}
                                       title="Either" accessibilityLabel="Either" />
                                   </TouchableHighlight>

                                { recipe_type === "dessert" ?

                                  (
                                    <View>
                                        <Link to={{pathname:"/dessert-confectionary/", state:{ initial_data: initial, either: either, times: times } }} >
                                           <Text style={styles.greenButton}>Link to confectionary list</Text>
                                        </Link>
                                        <Link to="/"><Text style={styles.blueButton}>Back to homepage</Text></Link>
                                    </View>
                                  )
                                  :
                                  (
                                    <View>
                                        <Link to={{pathname:"/other-meat/", state:{ initial_data: initial, either: either, times: times } }} >
                                            <Text style={styles.greenButton}>Link to meat list</Text>
                                        </Link>
                                        <Link to="/"><Text style={styles.blueButton}>Back to homepage</Text></Link>
                                    </View>
                                  )

                                }

                           </View>
                         )
                     }
                </View>
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
    fontSize:26,
    marginBottom:20
  },
  title: {
    fontSize:18,
    marginBottom:20,
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
  greenShadowButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightgreen',
    shadowColor:'black',
    shadowOpacity: 1,
    shadowOffset: {
      height:0,
      width:0,
    },
    elevation: 3,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});

export { HomePage, TimeAndType };
