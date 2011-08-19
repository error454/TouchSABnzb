enyo.kind({
	name: "TouchSabNZB.Overview",
	kind: enyo.VFlexBox,
	components: [
		{kind: "WebService", name: "matrixSearchDetails",
		  onSuccess: "searchResultsSuccess",
		  onFailure: "searchResultsFailure"
		},
		{kind: "PageHeader", className: "enyo-header-dark",
		components: [
			{layoutKind: "VFlexLayout", 
			components: [
				{content: "Overview"}
			]}
		]},
		{kind: "HFlexBox", flex: 1,
		components: [
			{content: "Coming Soon"}
		]}
	],
	create: function() {
		this.inherited(arguments);
	},
	searchResultsSuccess: function(){
		//TODO hide scrim
	},
	searchResultsFailure: function(){
		//TODO hide scrim, show failure message
	}
});