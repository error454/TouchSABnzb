enyo.kind({
	name: "TouchSabNZB.NZBMatrixSearchResult",
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
				{content: "Search Details"}
			]}
		]},
		{kind: "HFlexBox", flex: 1,
		components: [
			//{name: "image", kind: "Image", style: "height: 350px"}, //IMAGE
			{name: "webView", kind: "BasicWebView", flex: 1}
		]}
	],
	create: function() {
		this.inherited(arguments);
	},
	search: function(link){
		enyo.error("WTF NZBMatrix?: " + link);
//		this.$.webView.setUrl(link);
	//		+ "&username=" + nzbMatrixUser
		//	+ "&apikey=" + nzbMatrixAPI);
		/*
		enyo.error("got nzbid: " + nzbid);
		this.$.matrixSearchDetails.setUrl(
			"https://api.nzbmatrix.com/v1.1/details.php?id="
			+ nzbid
			+ "&username=" + nzbMatrixUser
			+ "&apikey=" + nzbMatrixAPI);

		this.$.matrixSearchDetails.setHandleAs("json");
		this.$.matrixSearchDetails.call();	
		*/
	},
	searchResultsSuccess: function(){
		//TODO hide scrim
	},
	searchResultsFailure: function(){
		//TODO hide scrim, show failure message
	}
});