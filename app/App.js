import React from 'react';

import KeepAwake from 'react-native-keep-awake';

import { StatusBar, Text, View, Button } from 'react-native';

import Config from 'react-native-config';

import { PageSettings } from "./PageSettings"
import { PageReloader } from "./PageReloader"

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      viewSettings: false,
      settingsTimeoutId: null,
      settingsTimeout: 10
    };
  }

  componentDidMount() {
    //activate the keepawake component
    KeepAwake.activate();
    
    //settings page timeout
    var settingsTimeoutId = setInterval(() => {
        this.setState({
          settingsTimeout: this.state.settingsTimeout - 1
        });
      }, 1000);
    this.setState({
      settingsTimeoutId: settingsTimeoutId
    });

    //load a settings
    PageSettings.get("firstLoad").then(
      (value) => {
        if(value == null) {
          this.setState({viewSettings: true});
        }
      });
  }
  
  componentDidUpdate() {
    //check settings timeout
    if(this.state.settingsTimeout == 0) {
      clearInterval(this.state.settingsTimeoutId);
    }
  }

  componentWillUnmount() {
    //clear settings timeout
    clearInterval(this.state.setIntervalId);
  }

  render() {
    //check status bar visibility
    StatusBar.setHidden(Config.HIDE_STATUS_BAR == "true");

    //view settings
    if(this.state.viewSettings)
      return <PageSettings onSave={ () => {
          clearInterval(this.state.settingsTimeoutId);
          this.setState({
            viewSettings: false,
            settingsTimeout: 0
          });
        }}/>

    //settings timeout
    if(this.state.settingsTimeout > 0) {
      return (
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between' }}>
          <View style={{height: 70}} />
          <View style={{height: 70}}>
            <Text style={{textAlign: "center" }}>
              <Text style={{fontSize: 15 }}>
                Loading In
              </Text>
              {"\n"}
              <Text style={{fontSize: 40, fontWeight: "bold"}}>
                {this.state.settingsTimeout}
              </Text>
              {" "}
              <Text style={{fontSize: 20}}>
                seconds
              </Text>
            </Text>           
          </View>
          <View style={{height: 70, padding: 10}}>
            <Button onPress={() => {
              clearInterval(this.state.settingsTimeoutId);
              this.setState({
                viewSettings: true,
                settingsTimeout: 0
              });
            }} title="Tap to view Settings" />
          </View>
        </View>);
    }

    //view reloader
    return <PageReloader />;
  }
}
