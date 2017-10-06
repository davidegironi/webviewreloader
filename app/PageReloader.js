import React from 'react';

import { Text, WebView, View } from 'react-native';

import Config from 'react-native-config';

import { PageSettings } from "./PageSettings";

var moment = require("moment");

const WEBVIEW_REF = "webview";

export class PageReloader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setIntervalId: null,
      seconds: 0,
      reloadTimeDisabled: 0,
      heartBeat: false
    };
  }

  componentDidMount() {
    //load settings
    this.loadSetting("webUrl");
    this.loadSetting("reloadSeconds");
    this.loadSetting("reloadTime");

    //start the interval
    var setIntervalId = setInterval(() => {
        this.setState({
          seconds: (this.state.reloadSeconds != 0 ? this.state.seconds + 1 : this.state.seconds),
          reloadTimeDisabled: (this.state.reloadTimeDisabled > 0 ? this.state.reloadTimeDisabled - 1 : 0),
          heartBeat: !this.state.heartBeat
        });
      }, 1000);
    this.setState({
      setIntervalId: setIntervalId
    });
  }
  
  componentWillUnmount() {
    //clear internval counter
    clearInterval(this.state.setIntervalId);
  }

  componentDidUpdate() {
    //check if the page has to be reloaded
    let bySeconds = (this.state.reloadSeconds != null && this.state.reloadSeconds != 0 && this.state.seconds == this.state.reloadSeconds);
    let byTime = (this.state.reloadTime != null && moment().format('HH:mm').toString() == this.state.reloadTime);
    if(
      bySeconds ||
      (byTime && this.state.reloadTimeDisabled == 0)
      ) {
      if(byTime) {
        this.setState({
          reloadTimeDisabled: 60
        });
      }
      this.setState({
        seconds: 0
      });
      this.refs[WEBVIEW_REF].reload();
    }
  }

  loadSetting(key) {
    //load a settings from pagesettings
    PageSettings.get(key).then(
      (value) => {
        let stateObj = {};
        stateObj[key] = (value != null ? value : "");
        this.setState(stateObj);
      });
  }

  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        marginTop: 0
      }}>
        {Config.SHOW_RELOADER == "true" ?
          <View style={{backgroundColor: 'skyblue'}}>
            <Text>
              {this.state.seconds.toString()}{Config.SHOW_HEARTBEAT == "true" && this.state.heartBeat ? " _" : null}
            </Text>
          </View>
          :
          null
        }
        <View style={{flex: 1}}>
          {this.state.webUrl != null ?
          <WebView
            ref={WEBVIEW_REF}
            source={{uri: this.state.webUrl}}
            style={{flex: 1, zIndex: 0}}
          />
          : null }
          {Config.SHOW_HEARTBEAT == "true" ?
          <Text style={{zIndex: 1, position: "absolute", bottom: 0, right: 0, paddingRight: 5}}>
             {this.state.heartBeat ? "." : ""}
          </Text>
          : null}
        </View>
      </View>
    );
  }
}
