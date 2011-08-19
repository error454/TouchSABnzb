enyo.kind({
	name: "TouchSabNZB.Main",
	kind: enyo.HFlexBox,
	components: [
		{kind:enyo.VFlexBox, width:'200px', style:"border-right: 2px solid;", components: [
			{
				kind: "PageHeader", 
				className: "enyo-header-dark",
				components: [
				{content: "TouchSabNZB",}
			]},
			{flex: 1, kind: "Pane", components: [
				{flex: 1, kind: "Scroller", components: [
					{kind: "Button", name: "overviewButton", caption: "Overview", onclick: "viewOverviewClick"},
					{kind: "Button", name: "queueButton", caption: "Queue", onclick: "viewQueueClick"},
					{kind: "Button", name: "historyButton", caption: "History", onclick: "viewHistoryClick"},
					{kind: "Button", name: "nzbMatrixButton", caption: "NZB Matrix", onclick: "nzbMatrixClick"}
				]}
			]}
		]},
		{name: "pane1", kind: "Pane", flex: 1, onSelectView: "viewSelected",
          components: [
			{name: "overview", className: "enyo-bg", kind: "TouchSabNZB.Overview"},	
			{name: "queue", className: "enyo-bg", kind: "TouchSabNZB.Queue"},
			{name: "history", className: "enyo-bg", kind: "TouchSabNZB.History"},
			{name: "nzbMatrix", className: "enyo-bg", kind: "TouchSabNZB.Search"},
			{name: "settings", className: "enyo-bg", kind: "TouchSabNZB.Settings"},
			{name: "about", className: "enyo-bg", kind: "TouchSabNZB.About"},	
          ]
		},
		{kind: "AppMenu", components: [
			{caption: "Preferences", onclick: "viewSettingsClick"},
			{caption: "About", onclick: "aboutClick"},
		]}
	],
	create: function() {
	  this.inherited(arguments);
	  this.viewOverviewClick();
	},
	viewQueueClick: function() {
		
		this.$.pane1.selectViewByName("queue");
		
		this.$.queue.startTimer();
		this.$.history.stopTimer();
		
		this.$.queueButton.setStyle("background-color: pink");
		this.$.historyButton.setStyle("background-color: ");
		this.$.nzbMatrixButton.setStyle("background-color: ");
		this.$.overviewButton.setStyle("background-color: ");
	},
	viewHistoryClick: function() {
		this.$.pane1.selectViewByName("history");
		this.$.queue.stopTimer();
		this.$.history.startTimer();
		
		this.$.queueButton.setStyle("background-color: ");
		this.$.historyButton.setStyle("background-color: pink");
		this.$.nzbMatrixButton.setStyle("background-color: ");
		this.$.overviewButton.setStyle("background-color: ");
	},
	viewSettingsClick: function() {
		this.$.pane1.selectViewByName("settings");
		
		this.$.history.stopTimer();
		this.$.queue.stopTimer();
		
		this.$.queueButton.setStyle("background-color: ");
		this.$.historyButton.setStyle("background-color: ");
		this.$.nzbMatrixButton.setStyle("background-color: ");
		this.$.overviewButton.setStyle("background-color: ");
	},
	nzbMatrixClick: function() {
		this.$.pane1.selectViewByName("nzbMatrix");
		
		this.$.history.stopTimer();
		this.$.queue.stopTimer();
		
		this.$.nzbMatrixButton.setStyle("background-color: pink");
		this.$.queueButton.setStyle("background-color: ");
		this.$.historyButton.setStyle("background-color: ");
		this.$.overviewButton.setStyle("background-color: ");
	},
	viewOverviewClick: function() {
		this.$.pane1.selectViewByName("overview");
		this.$.overviewButton.setStyle("background-color: pink");
		this.$.queueButton.setStyle("background-color: ");
		this.$.historyButton.setStyle("background-color: ");
		this.$.nzbMatrixButton.setStyle("background-color: ");
	},
	aboutClick: function() {
		this.$.pane1.selectViewByName("about");
		this.$.overviewButton.setStyle("background-color: ");
		this.$.queueButton.setStyle("background-color: ");
		this.$.historyButton.setStyle("background-color: ");
		this.$.nzbMatrixButton.setStyle("background-color: ");
	}
});