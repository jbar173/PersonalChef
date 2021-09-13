import React from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, TouchableOpacity, TextInput, Pressable } from 'react-native';
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

            <Text accessible={true} accessibilityLabel="Welcome to PersonalChef" accessibilityRole="text"
             style={styles.mainTitle}>PersonalChef</Text>

            <TouchableOpacity activeOpacity={1} underlayColor="transparent">
                <Link accessible={true} accessibilityLabel="Find a recipe for your ingredients"
                  accessibilityRole="button" to="/pantry/" underlayColor="transparent" >
                   <Text style={styles.greenButton}>Find a recipe for your ingredients</Text>
                </Link>
            </TouchableOpacity>

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
        "time": '0',
        "ingredients": [],
        "ingredientCount": 0,
        "type": '',
      },
      both: false,
      validHoursInput: true,
      validMinutesInput: true,
      validTimes: false,
      finished: true,
      times: {
        "hours": '0',
        "mins": '0'
      },

      ingredients_rough: {},
      firstResponse: [],

      initialRecipeLinkList: [],
      responseList: [],

      refinedRecipeList: [],
    }
    this.radioButtonPressedHandler = this.radioButtonPressedHandler.bind(this)
    this.onChangeTimeHoursHandler = this.onChangeTimeHoursHandler.bind(this)
    this.onChangeTimeMinsHandler = this.onChangeTimeMinsHandler.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
  };

  componentDidMount(){
    var ingreds = this.props.location.state.ingreds
    this.setState({
      ingredients_rough: ingreds,
    })
    for(x in ingreds){
      console.log("**** ingreds: " + ingreds[x])
    }
  }

   radioButtonPressedHandler(value){
      if (value === "dessert" || value === "other"){
        this.setState({
          initialData:{
            ...this.state.initialData,
            type: value
          }
        })
      }else{
        this.setState({
          initialData:{
            ...this.state.initialData,
            type: "other"
          },
          both: true
        })
      }
   }


  onChangeTimeHoursHandler(h){
      var chars = [ '', '0' ]

      if(isNaN(h)){
        this.setState({
          validHoursInput: false,
          validTimes: false
        });
        return 0;
      }else{
        var hrs = h*60
        this.setState({
          validHoursInput: true,
          times:{
            ...this.state.times,
            hours: hrs
          },
        })
      }

      if(chars.includes(h) && chars.includes(this.state.times.mins)){
        this.setState({
          validTimes: false,
        })
      }else if(this.state.validMinutesInput === false || this.state.validHoursInput === false){
        this.setState({
          validTimes: false,
          finished: false
        })
      }else{
        this.setState({
          validTimes: true,
        })
      }
   }


  onChangeTimeMinsHandler(minutes){
      var chars = [ '', '0' ]

      if(isNaN(minutes)){
        this.setState({
          validMinutesInput: false,
          validTimes: false,
        });
        return 0;
      }else{
        this.setState({
          validMinutesInput: true,
          times: {
            ...this.state.times,
            mins: minutes
          },
        })
      }

      if(chars.includes(minutes) && chars.includes(this.state.times.hours)){
        this.setState({
          validTimes: false,
          times:{
            ...this.state.times,
            mins: minutes
          },
        })
      }else if(this.state.validMinutesInput === false || this.state.validHoursInput === false){
        this.setState({
          validTimes: false,
          finished: false
        })
      }else{
        this.setState({
          validTimes: true,
        })
      }
   }


  componentDidUpdate(){
    console.log("did update")
    if(this.state.finished === false){
      this.onChangeTimeHoursHandler(this.state.times.hours);
      this.onChangeTimeMinsHandler(this.state.times.mins);
      this.setState({
        finished:true
      })
    }
  }


    render(){
      var recipe_type = this.state.initialData.type
      var initial = this.state.initialData
      var either = this.state.both
      var times = this.state.times
      var ingreds = this.state.ingredients_rough
      var valid = this.state.validTimes


      return(

            <View style={styles.container}>

                <View>

                        <Text accessible={true} accessibilityLabel="How much time do you have?" accessibilityRole="text"
                          style={{marginBottom:20,marginTop:20}}>How much time do you have?</Text>
                        <TextInput
                          style={styles.input}
                          onChangeText={text => this.onChangeTimeHoursHandler(text)}
                          placeholder='0 hours'
                          keyboardType="numeric"
                          accessibilityLabel="hours textbox"
                          accessibilityHint="type number of hours here"
                          accessibilityRole="adjustable"
                        />
                        {this.state.validHoursInput === false && <Text accessible={true} accessibilityLabel="Please enter a number"
                          accessibilityRole="alert" style={styles.red}>Please enter a number</Text>}
                        <TextInput
                          style={styles.input}
                          onChangeText={text => this.onChangeTimeMinsHandler(text)}
                          placeholder='20 minutes'
                          keyboardType="numeric"
                          accessibilityLabel="minutes textbox"
                          accessibilityHint="type number of minutes here"
                          accessibilityRole="adjustable"
                        />
                        {this.state.validMinutesInput === false && <Text accessible={true} accessibilityLabel="Please enter a number"
                          accessibilityRole="alert" style={styles.red}>Please enter a number</Text>}

                </View>

                <View>

                    { recipe_type === "" ?

                       (
                         <View>

                              <Text accessible={true} accessibilityLabel="What type of meal are you looking for?" accessibilityRole="text"
                                style={{marginBottom:30,marginTop:40,textAlign:"center"}}>What type of meal are you looking for?</Text>

                                    <TouchableOpacity accessible={true} accessibilityLabel="Dessert" accessibilityRole="button"
                                      underlayColor="white" onPress={() => this.radioButtonPressedHandler("dessert")}>
                                        <Text style={styles.blueButton}>Dessert</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity accessible={true} accessibilityLabel="Starter or Main" accessibilityRole="button"
                                       underlayColor="white" onPress={() => this.radioButtonPressedHandler("other")}>
                                      <Text style={styles.blueButton}>Starter or Main</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity accessible={true} accessibilityLabel="Either" accessibilityRole="button"
                                       underlayColor="white" onPress={() => this.radioButtonPressedHandler("both")}>
                                      <Text style={styles.blueButton}>Either</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                      underlayColor="white">
                                          <Link style={{marginTop:90}} to="/pantry/" underlayColor="transparent">
                                            <Text style={styles.blueButton}>Back</Text>
                                          </Link>
                                    </TouchableOpacity>

                          </View>
                       )

                       :

                       (
                          <View>

                                 <Text accessible={true} accessibilityLabel="What type of meal are you looking for?" accessibilityRole="text"
                                  style={{marginBottom:30,marginTop:40,textAlign:"center"}}>What type of meal are you looking for?</Text>

                                       <TouchableHighlight accessible={true} accessibilityLabel="Dessert" accessibilityRole="button"
                                          underlayColor="white" onPress={() => this.radioButtonPressedHandler("dessert")}>
                                         <Text style={styles.blueButton}>Dessert</Text>
                                       </TouchableHighlight>

                                       <TouchableHighlight accessible={true} accessibilityLabel="Starter or Main" accessibilityRole="button"
                                          underlayColor="white" onPress={() => this.radioButtonPressedHandler("other")}>
                                         <Text style={styles.blueButton}>Starter or Main</Text>
                                       </TouchableHighlight>

                                       <TouchableHighlight accessible={true} accessibilityLabel="Either" accessibilityRole="button"
                                          underlayColor="white" onPress={() => this.radioButtonPressedHandler("both")}>
                                         <Text style={styles.blueButton}>Either</Text>
                                       </TouchableHighlight>

                                  { recipe_type === "dessert" ?

                                        (
                                          <View>

                                               {valid === true ?

                                                  (
                                                    <View>
                                                        <Link to={{pathname:"/dessert-confectionary/", state:{ initial_data: initial, either: either,
                                                           times: times, ingreds: ingreds } }} underlayColor="transparent">
                                                             <Text accessible={true} accessibilityLabel="Go to dessert ingredients"
                                                              accessibilityRole="button" style={styles.greenButton}>Dessert ingredients</Text>
                                                        </Link>
                                                        <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                          style={{marginTop:90}} to="/pantry/" underlayColor="transparent">
                                                             <Text style={styles.blueButton}>Back</Text>
                                                        </Link>
                                                    </View>
                                                  )

                                                  :

                                                  (
                                                    <View>
                                                        <TouchableHighlight underlayColor="none" onPress={() => this.setState({ showInvalid: true })}>
                                                            <Text accessible={true} accessibilityLabel="Go to dessert ingredients"
                                                              accessibilityRole="button" style={styles.greenButton}>Dessert ingredients</Text>
                                                        </TouchableHighlight>

                                                        {this.state.showInvalid === true && <Text accessible={true} accessibilityLabel="Please enter times above"
                                                         accessibilityRole="alert" style={styles.red}>Please enter times above</Text>}

                                                        <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                          style={{marginTop:90}} to="/pantry/" underlayColor="transparent">
                                                             <Text style={styles.blueButton}>Back</Text>
                                                        </Link>
                                                    </View>
                                                  )

                                                }

                                          </View>
                                        )

                                        :

                                        (
                                          <View>
                                                {valid === true ?
                                                  (
                                                    <View>
                                                        <Link accessible={true} accessibilityLabel="Go to savoury ingredients" accessibilityRole="button"
                                                          to={{pathname:"/other-meat/", state:{ initial_data: initial, either: either, times: times,
                                                            ingreds: ingreds } }} underlayColor="transparent" >
                                                            <Text accessible={true} accessibilityLabel="Go to savoury ingredients"
                                                              style={styles.greenButton}>Savoury ingredients</Text>
                                                        </Link>
                                                        <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                          style={{marginTop:90}} to="/pantry/" underlayColor="transparent">
                                                            <Text style={styles.blueButton}>Back</Text>
                                                        </Link>
                                                    </View>
                                                  )
                                                  :
                                                  (
                                                    <View>
                                                        <TouchableHighlight accessible={true} accessibilityLabel="Go to savoury ingredients"
                                                           accessibilityRole="button" underlayColor="white" onPress={ () => this.setState({ showInvalid: true }) }>
                                                           <Text style={styles.greenButton}>Savoury ingredients</Text>
                                                        </TouchableHighlight>

                                                        {this.state.showInvalid === true && <Text accessible={true} accessibilityLabel="Please enter times above"
                                                          accessibilityRole="alert" style={styles.red}>Please enter times above</Text>}

                                                        <Link accessible={true} accessibilityLabel="Go back" accessibilityRole="button"
                                                          style={{marginTop:90}} to="/pantry/" underlayColor="transparent">
                                                            <Text style={styles.blueButton}>Back</Text>
                                                        </Link>
                                                    </View>
                                                  )
                                                }
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
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize:28,
    marginBottom:20
  },
  greenButton: {
    padding: 10,
    marginTop: 3,
    marginHorizontal: 50,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    backgroundColor:'lightgreen',
    textAlign: "center",
  },
  blueButton: {
    padding: 10,
    marginTop: 3,
    marginHorizontal: 50,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor:'lightblue',
    textAlign: "center",
  },
  input: {
    height: 40,
    marginTop: 3,
    marginHorizontal: 50,
    borderWidth: 1,
    textAlign: "center",
  },
  red: {
    color: 'red',
    textAlign: 'center',
  }
});

export { HomePage, TimeAndType };
