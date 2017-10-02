Enable WebView httpsource, edit ios/WebViewreloader/Info.plist as follow:
        <key>NSAppTransportSecurity</key>
	<!--See http://ste.vn/2015/06/10/configuring-app-transport-security-ios-9-osx-10-11/ -->
	<dict>
		<key>NSAllowsArbitraryLoads</key>
    		<true/>
	</dict>

