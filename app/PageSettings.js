import React from 'react';

import { Platform, View, Text, AsyncStorage, TextInput, Button } from 'react-native';

var validate = require("validate.js");

export class PageSettings extends React.Component {
  static navigationOptions = {
    title: 'Settings'
  }

  static get = (key) => {
    return AsyncStorage.getItem(key);
  }

  constructor() {
    super();
    this.state = {
      webUrl: null,
      reloadSeconds: null,
      reloadTime: null
    };
  }

  componentDidMount() {
    this.load("webUrl", "http://www.example.com");
    this.load("reloadSeconds", 600);
    this.load("reloadTime", null);
  }

  load = (key, defaultValue) => {
    AsyncStorage.getItem("firstLoad").then(
      (value) => {
        if(value == null) {
          if(defaultValue != null)
            AsyncStorage.setItem(key, defaultValue.toString());
          this.setValue(key, defaultValue);
          AsyncStorage.setItem("firstLoad", "1");
        } else {
          AsyncStorage.getItem(key).then(
            (value) => {
              this.setValue(key, value);
            });
        }
      });    
  }

  setValue = (key, value) => {
    let stateObj = {};
    stateObj[key] = (value != null ? value : "");
    this.setState(stateObj);
  }

  getValue = (key) => {
    const state = this.state;
    if(state[key] != null)
      return state[key].toString();
    else
      return null;
  }

  handleChange = (value, key, validate) => {
    let errore = null;
    if(validate != null) {
      errore = validate(value);
    }
    if(errore == null)
      AsyncStorage.setItem(key, value);
    let stateObj = {};
    if(value != null && value.length == 0)
      value = null;
    stateObj[key] = value;
    stateObj[key + "e"] = errore;
    this.setState(stateObj);
  }

  render() {
    const { onSave } = this.props;
    
    return (
      <View style={{flex: 1}}>
        <View style={{
          height: 38,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "lightgrey"
        }}>
          <Text style={{
            fontWeight: "bold",
            fontSize: 16, 
            ...Platform.select({
              ios: {
                lineHeight: 38
              },
              android: {
                paddingTop: 8
              } 
            }),
            paddingLeft: 10 }}>Settings</Text>
          <Button onPress={() => { (onSave != null ? onSave() : null); }} title="Save and View" />
        </View>
        <View style={{padding: 10}}>
          <Text style={{fontWeight: "bold"}}>
            Reload URL
          </Text>
          {this.state.webUrle != null ? <Text> {this.state.webUrle} </Text> : null }
          <TextInput
            style={{paddingTop: 0}}
            autoCapitalize="none"
            keyboardType="url"
            onChangeText={(e) => this.handleChange(e,
              "webUrl", (v) => { return validate.single(v, {presence: true, url: true}); })}
            value={this.getValue("webUrl")} />
          <Text style={{fontWeight: "bold"}}>
            Reload Seconds
          </Text>
          {this.state.reloadSecondse != null ? <Text> {this.state.reloadSecondse} </Text> : null }
          <TextInput
            style={{paddingTop: 0}}
            keyboardType="numeric"
            onChangeText={(e) => this.handleChange(e,
              "reloadSeconds", (v) => { return validate.single(v, {presence: true, numericality: {onlyInteger: true}}); })}
            value={this.getValue("reloadSeconds")} />
          <Text style={{fontWeight: "bold"}}>
            Reload Time
          </Text>
          {this.state.reloadTimee != null ? <Text> {this.state.reloadTimee} </Text> : null }
          <TextInput
            style={{paddingTop: 0}}
            keyboardType="default"
            onChangeText={(e) => this.handleChange(e,
              "reloadTime", (v) => { return validate.single(v, {format: /^([01]\d|2[0-3]):?([0-5]\d)|()$/}); })}
            value={this.getValue("reloadTime")} />
        </View>        
      </View>
    );
  }
}
