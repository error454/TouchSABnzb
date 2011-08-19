enyo.kind({
	name: "TouchSabNZB.History",
	kind: enyo.VFlexBox,
	components: [
		{kind: "WebService", name: "getHistory",
		  onSuccess: "gotHistory",
		  onFailure: "gotHistoryFailure"
		},	
		{kind: "WebService", name: "deleteHistory",
		},
		{kind: "PageHeader", className: "enyo-header-dark", 
		components: [
			{layoutKind: "VFlexLayout", flex: 1,
			components: [
				{content: "History"},
				{name: "rightHeader", className: "enyo-item-secondary"}
			]},
			{layoutKind: "HFlexLayout", pack: "end", flex: 1,
			components: [
				{kind: "Button", name: "clearButton", caption: "Clear", onclick: "clearHistory"},
				{kind: "Spinner", align: "right", onclick: "refresh"}
			]}
		]},
		//A scroller
		{kind: "Scroller", flex: 1, components: [
			{name: "list", kind: "VirtualRepeater", onSetupRow: "getListItem",
				components: [
					{kind: "SwipeableItem", layoutKind: "VFlexLayout", onConfirm: "clearItem", flex: 1,
					components: [
						{name: "title"},
						{layoutKind: "HFlexLayout",
						components: [
							{name: "status", className: "enyo-item-secondary", flex: 5},
							{name: "timestamp", className: "enyo-item-secondary", flex: 1},
							{name: "size", className: "enyo-item-secondary", flex: 1}
						]}
					]}
				]
			}
		]},
		{kind: "Toolbar", components: [
			{icon: "images/menu-icon-back.png", onclick: "pageLeft"},
			{name: "historyPage", caption: "-"},
			{icon: "images/menu-icon-forward.png", onclick: "pageRight"}
		]}
	],
	create: function() {
	  this.inherited(arguments);
	  this.slots = [];
	  this.timer;
	  this.currentPage = 1;
	  this.slotCount = 0;
	  this.$.spinner.show();
	},
	getHistoryClick: function() {
		this.refresh();
	},
	gotHistory: function(inSender, inResponse, inRequest){		
		this.$.spinner.stop();
		this.slotCount = inResponse.history.noofslots;		
		this.slots = [];
		
		for(i = 0; i < inResponse.history.slots.length; i++){
			this.slots[i] = 
			{ 
				name: inResponse.history.slots[i].name,
				id: inResponse.history.slots[i].nzo_id,
				status: inResponse.history.slots[i].status,
				size: inResponse.history.slots[i].size
			};
		}
		
		if(this.slots.length > 0){
			this.$.rightHeader.setContent(this.slotCount + " Items in History");
		}
		else{
			this.$.rightHeader.setContent("No items in History");
		}		
		
		this.$.historyPage.setCaption(this.currentPage + " / " + Math.ceil(this.slotCount / historyItems));
		this.$.list.render();
	},
	gotHistoryFailure: function(inSender, inResponse){
		this.$.rightHeader.setContent("Failure!");
		this.$.spinner.stop();
	},
	getListItem: function(inSender, inIndex){
		if(this.slots[inIndex]){
			this.$.title.setContent(this.slots[inIndex].name);
			this.$.size.setContent(this.slots[inIndex].size);
			this.$.status.setContent(this.slots[inIndex].status);
			return true;
		}
	},
	refresh: function(){
		this.$.getHistory.setUrl(createSabURL("mode=history&start=" + (this.currentPage - 1) * historyItems + "&limit=" + historyItems + "&output=json"));
		this.$.getHistory.setHandleAs("json");
		this.$.getHistory.call();
		this.$.spinner.start();
		this.timer = setTimeout(enyo.bind(this, "refresh"), queueRefresh * 1000);
	},
	clearHistory: function(){		
		this.$.deleteHistory.setUrl(createSabURL("mode=history&name=delete&value=all"));
		this.$.deleteHistory.call();
		//this.refresh();
	},
	clearItem: function(inSender, inIndex){
		this.$.deleteHistory.setUrl(createSabURL("mode=history&name=delete&value=" + this.slots[inIndex].id));
		this.$.deleteHistory.call();
		this.refresh();		
	},
	startTimer: function(){
		this.refresh();
		this.timer = setTimeout(enyo.bind(this, "refresh"), queueRefresh * 1000);
	},
	stopTimer: function(){
		clearInterval(this.timer);
	},
	pageLeft: function(){
		if(this.currentPage > 1){
			this.currentPage--;
			this.refresh();
		}
	},
	pageRight: function(){
		if(this.currentPage < Math.ceil(this.slotCount / historyItems)){
			this.currentPage++;
			this.refresh();
		}
	}
});