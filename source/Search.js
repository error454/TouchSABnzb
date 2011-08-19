enyo.kind({
	name: "TouchSabNZB.Search",
	kind: enyo.VFlexBox,
	components: [
		{name: "slidingPane", kind: "SlidingPane", flex: 1, onSelectView: "slidingSelected", 
		components: [
			{name: "left", fixedWidth: true, flex: 1, components: [
				{kind: "TouchSabNZB.NZBMatrix", flex: 1, onGo: "next", onSearchItemSelected: "showSearchItem"}
			]},
			/*
			{name: "right", dragAnywhere: true, peekWidth: 68, width: "70px",
			components: [
				{name: "results", kind: "TouchSabNZB.NZBMatrixSearchResult", flex: 1, onGo: "next", 
				components: [
					{kind: "Toolbar", 
					components: [
						{kind: "GrabButton"}
					]}
				]}
			]}
			*/
		]}
	],
	detailsHandler: function(inSender, inEvent){
		enyo.error("DETAILS!");
	},
	next: function() {
		this.$.slidingPane.next();
	},
	peekItemClick: function(inSender) {
		this.$.info.setContent("You clicked: " + inSender.caption);
		this.$.slidingPane.selectView(this.$.middle);
	},
	showRight: function() {
		
		this.$.right.setShowing(true);
	},
	hideRight: function() {
		
		this.$.right.setShowing(false);
	},
	slidingSelected: function(inSender, inSliding, inLastSliding) {
		this.log(inSliding.id, (inLastSliding || 0).id);
	},
	slidingResize: function(inSender) {
		this.log(inSender.id);
	},
	rightHide: function() {
		this.$.info.setContent("hide right");
	},
	rightShow: function() {
		this.$.info.setContent("show right");
	},
	backHandler: function(inSender, e) {
		this.$.slidingPane.back(e);
	},
	showSearchItem: function(inSender, link){
		this.$.results.search(link);
	}
});