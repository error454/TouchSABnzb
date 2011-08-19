enyo.kind({
	name: "TouchSabNZB.Settings",
	kind: enyo.VFlexBox,
	components: [
		{kind: "PageHeader", className: "enyo-header-dark",
		components: [
			{layoutKind: "VFlexLayout", 
			components: [
				{content: "Settings"}
			]}
		]},
		{kind: "Scroller", flex: 1, components: [
			{kind: "RowGroup", caption: "Server Settings",
			components: [
				{kind: "Item", className: "enyo-row",
				components: [
					{kind: "Input", name: "ipAddress", hint: "IP Address of SabNZBd", 
						onchange: "ipChange", autoKeyModifier: "num-lock", 
						autocorrect: "false", autoCapitalize: "lowercase", autoWordComplete: "false",
						components: [
							{content: "IP Address", className: "settings-item"}
						]
					}
				]},
				{kind: "Item", className: "enyo-row",
				components: [
					{kind: "Input", name: "port", hint: "Port of SabNZBd", onchange: "portChange", autoKeyModifier: "num-lock",
					autocorrect: "false", autoCapitalize: "lowercase", autoWordComplete: "false",
					components: [
						{content: "Port", className: "settings-item"}
					]
					}
				]},
				{kind: "HFlexBox", pack: "center", align: "center",
				components: [
					{kind: "ToggleButton", flex: 1, name: "sslChecked", onLabel: "yes", offLabel: "no", onChange: "sslChange"},
					{content: "Use SSL", className: "settings-item"}
				]},
				{kind: "Item", className: "enyo-row",
				components: [
					{kind: "Input", name: "apiKey", hint: "SabNZB API Key Here", onchange: "apiKeyChange", 
					autocorrect: "false", autoCapitalize: "lowercase", autoWordComplete: "false",
					components: [
						{content: "API Key", className: "settings-item"}
					]
					}
				]},
				{kind: "HFlexBox", 
				components: [
					{kind: "HtmlContent", name: "testSettings", flex: 1, onLinkClick: "htmlContentLinkClick"},
					{content: "Open Browser to Server", className: "settings-item"}
				]}
			]},
			{kind: "RowGroup", caption: "Misc Settings",
			components: [
				{kind: "HFlexBox", pack: "center", align: "center",
				components: [
					{kind: "IntegerPicker", flex: 1, name: "historyItems", onChange: "historyItemsChange", label: "", min: 5, max: 50, value: 10},
					{content: "History items per page", className: "settings-item"}
				]},			
				{kind: "HFlexBox", pack: "center", align: "center",
				components: [
					{ kind: "IntegerPicker", flex: 1, name: "queueTime", onChange: "queueChange", label: "", min: 3, max: 60, value: 10},
					{content: "Number of seconds for queue refresh", className: "settings-item"}
				]}				
			]},
			{kind: "RowGroup", caption: "NZBMatrix Settings",
			components: [
				{kind: "Item", className: "enyo-row", align: "center", 
				components: [
					{kind: "Input", name: "nzbMatrixAPIKey", hint: "NZB Matrix API Key here", 
					onchange: "nzbMatrixKeyChange", autocorrect: "false", autoCapitalize: "lowercase", autoWordComplete: "false",
					components: [
						{content: "NZB Matrix API Key", className: "settings-item"},
					]
					}				
				]},
				{kind: "Item", className: "enyo-row", align: "center",
				components: [
					{kind: "Input", name: "nzbMatrixUsername", hint: "NZB Matrix Username here", 
					onchange: "nzbMatrixUserChange", autocorrect: "false", autoCapitalize: "lowercase", autoWordComplete: "false",
					components: [
						{content: "NZB Matrix Username", className: "settings-item"},
					]
					}					
				]},
				{kind: "HFlexBox", align: "center",
				components: [
					{kind: "ToggleButton", flex: 1, name: "nzbMatrixImages", onLabel: "yes", offLabel: "no", onChange: "nzbMatrixImagesChanged"},
					{content: "Load Images", className: "settings-item"}					
				]}				
			]}
		]}
	],
	ipChange: function() {
		enyo.setCookie("ip", this.$.ipAddress.getValue());
		this.updateTestURL();
	},
	portChange: function() {
		enyo.setCookie("port", this.$.port.getValue());
		this.updateTestURL();
	},
	apiKeyChange: function() {
		enyo.setCookie("api", this.$.apiKey.getValue());
		this.updateTestURL();
	},
	nzbMatrixKeyChange: function() {
		enyo.setCookie("nzbMatrixAPI", this.$.nzbMatrixAPIKey.getValue());
		nzbMatrixAPI = this.$.nzbMatrixAPIKey.getValue();
	},
	nzbMatrixUserChange: function(){
		enyo.setCookie("nzbMatrixUser", this.$.nzbMatrixUsername.getValue());
		nzbMatrixUser = this.$.nzbMatrixUsername.getValue();
	},
	nzbMatrixImagesChanged: function(inSender, inState){
		enyo.setCookie("nzbMatrixImages", inState);
		nzbMatrixImages = inState;
	},
	sslChange: function(inSender, inState) {
		enyo.setCookie("ssl", inState);
		this.updateTestURL();
	},
	historyItemsChange: function(){
		enyo.setCookie("historyItems", this.$.historyItems.getValue());
		historyItems = this.$.historyItems.getValue();
	},
	queueChange: function() {
		enyo.setCookie("queue", this.$.queueTime.getValue());
		queueRefresh = this.$.queueTime.getValue();
	},
	create: function() {
		this.inherited(arguments);
		  
		//Globals
		configuredIP = enyo.getCookie("ip");
		configuredPort = enyo.getCookie("port");
		configuredSSL = enyo.getCookie("ssl") == "true";
		configuredAPI = enyo.getCookie("api");
		nzbMatrixAPI = enyo.getCookie("nzbMatrixAPI");
		historyItems = enyo.getCookie("historyItems") || 25;
		queueRefresh = enyo.getCookie("queue") || 10;
		nzbMatrixUser = enyo.getCookie("nzbMatrixUser");
		nzbMatrixImages = enyo.getCookie("nzbMatrixImages") == "true";
	
		if(!queueRefresh || queueRefresh <= 0){
			queueRefresh = 3;
		}
		
		this.$.queueTime.setValue(queueRefresh);
		
		if(configuredIP){
			this.$.ipAddress.setValue(configuredIP);
		}
		  
		if(configuredPort){
			this.$.port.setValue(configuredPort);
		}
		
		if(configuredSSL){
			this.$.sslChecked.setState(configuredSSL);
		}
		
		if(configuredAPI){
			this.$.apiKey.setValue(configuredAPI);
		}
		
		if(nzbMatrixAPI){
			this.$.nzbMatrixAPIKey.setValue(nzbMatrixAPI);
		}
		
		if(nzbMatrixUser){
			this.$.nzbMatrixUsername.setValue(nzbMatrixUser);
		}
		
		if(nzbMatrixImages){
			this.$.nzbMatrixImages.setState(nzbMatrixImages);
		}
		
		if(historyItems){
			this.$.historyItems.setValue(historyItems);
		}
		
		this.updateTestURL();
	},
	htmlContentLinkClick: function(inSender, inUrl){
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'open',
			parameters: {
			  id: 'com.palm.app.browser',
			  params: {
				target: inUrl
			  }
			}
		});
	},
	updateTestURL: function(){
		configuredIP = enyo.getCookie("ip");
		configuredPort = enyo.getCookie("port");
		configuredSSL = enyo.getCookie("ssl") == "true";
		configuredAPI = enyo.getCookie("api");
		
		if(configuredIP && configuredPort){
			var temp;
			if(configuredSSL == true){
				temp = "https://";
			} else{
				temp = "http://";
			}
			
			temp = temp + configuredIP + ":" + configuredPort;
			
			this.$.testSettings.setContent("<a href=\"" + temp + "\">" + temp + "</a>");
		}
		else{
			this.$.testSettings.setContent("no server defined");
		}
	}
});