enyo.kind({
	name: "TouchSabNZB.NZBMatrix",
	kind: enyo.VFlexBox,
	events: { onSearchItemSelected: ""},
	components: [
		{kind: "WebService", name: "matrixSearch",
		  onSuccess: "searchResultsSuccess",
		  onFailure: "searchResultsFailure"
		},
		{kind: "WebService", name: "addDownload",
		  onSuccess: "addDownloadSuccess",
		  onFail: "addDownloadFailed"
		},		
		{kind: "PageHeader", className: "enyo-header-dark",
		components: [
			{layoutKind: "VFlexLayout", 
			components: [
				{name: "header", content: "NZB Matrix Search"}
			]}
		]},
		{layoutKind: "HFlexLayout", pack: "center", align: "center",
		components: [
			{kind: "Input", flex: 4, name: "searchField", hint: "Search for string", 
				autocorrect: "true", autoCapitalize: "lowercase", autoWordComplete: "false",
				onkeypress: "searchInput"},
			{kind: "ActivityButton", disabled: false, active: false, flex: 1, name: "searchButton", caption: "Search", onclick: "search"}
		]},
		{kind: "VirtualList", name: "list", onSetupRow: "getSearchListItem", flex: 1,
		components: [
			{kind: "Item", layoutKind: "HFlexLayout", /*onclick: "getDetails",*/
			components: [
				{name: "image", kind: "Image", style: "height: 90px"},
				{kind: "VFlexBox", flex: 1,
				components: [	
					{name: "title"},
					{kind: "HFlexBox",
					components: [
						{name: "size", className: "mid-gray", flex: 1},
						{name: "group", className: "mid-gray", flex: 1},
						{name: "category", className: "mid-gray", flex: 1},
					]},
					{kind: "HFlexBox",
					components: [
						{name: "age", className: "mid-gray", flex: 1},
						{name: "comments", className: "mid-gray", flex: 1},
						{name: "hits", className: "mid-gray", flex: 1}
					]}
				]},
				{kind: "Button", name: "getButton", onclick: "nzbSelected", content: "Get", height: "50px", align: "center", pack: "center"}
			]}
		]}			
	],
	create: function() {
		this.inherited(arguments);
		this.searchResults = [];
		this.searching = false;
	},
	getSearchListItem: function(inSender, inIndex){
		if(this.searchResults[inIndex]){
			if(this.searchResults[inIndex].IMAGE && nzbMatrixImages){
				this.$.image.setSrc(this.searchResults[inIndex].IMAGE);
			}
			else{
				this.$.image.setSrc("");
			}
			//this.$.image.setSrc("images/play.png");
			
			this.$.title.setContent(this.searchResults[inIndex].NZBNAME);
			this.$.size.setContent((parseFloat(this.searchResults[inIndex].SIZE) / 1024 / 1024 / 1024).toFixed(2) + " GB");
			this.$.category.setContent(this.searchResults[inIndex].CATEGORY);
			this.$.age.setContent(this.searchResults[inIndex].USENET_DATE);
			this.$.comments.setContent(this.searchResults[inIndex].COMMENTS);
			this.$.hits.setContent(this.searchResults[inIndex].HITS);
			this.$.group.setContent(this.searchResults[inIndex].GROUP);
			
			//If we just completed the results of a search, clear the button styles
			if(this.searching){
				this.$.getButton.setStyle("background-color:");
			}
			this.$.getButton.setDisabled(false);
			
			return true;
		}
	},
	searchInput: function(source, event){
		if(event.keyCode == 13){
			this.search();
		}
	},
	search: function() {
		this.searching = true;
		this.$.searchButton.setDisabled(true);
		this.$.searchButton.setActive(true);
		
		this.$.matrixSearch.setUrl(
			"https://api.nzbmatrix.com/v1.1/search.php?search=" 
			+ this.$.searchField.getValue()
			+ "&num=50&username=" + nzbMatrixUser
			+ "&apikey=" + nzbMatrixAPI);

		this.$.matrixSearch.setHandleAs("json");
		this.$.matrixSearch.call();	
	},
	searchResultsSuccess: function(inSender, inResponse, inRequest){		
		this.$.searchButton.setDisabled(false);
		this.$.searchButton.setActive(false);
		this.searchResults.length = 0;
		this.$.list.refresh();
		
		//error checking
		if(inResponse.indexOf("error:no_nzb_found") != -1){
			//no search results
		}
		else if(inResponse.indexOf("error:") != -1){
			//misc error
		}
		else{
			//used to hold temporary key/value pairs
			var tempKV = {};

			//The unformatted search results arrive in inResponse
			//Remove whitespace and newlines from the input
			inResponse = inResponse.replace(/(\r\n|\n|\r)/gm,"");

			//search entries are delimited by |
			var results = inResponse.split("|");
			for(var i = 0; i < results.length; i++){
				//key:value pairs in each search result are dlimited by ;
				var pair = results[i].split(";");	 
				
				for(var j = 0; j < pair.length; j++){
					//keys and values are delimited by :
					var kv = pair[j].split(":");
					
					//normal key:value pairs have a length of 2
					if(kv.length == 2){
						//make sure these are treated as strings
						//tempKV["key"] = "value"
						tempKV["" + kv[0]] = "" + kv[1];
					}
					//Else we are parsing an entry like "http://" where there are multiple :'s
					else if(kv.length > 2){
						//store the first chunk of the value
						var val = "" + kv[1]; 
						
						//loop through remaining chunks of the value
						for(var z = 2; z < kv.length; z++){
							//append ':' plus the next value chunk
							val += ":" + kv[z]; 
						}
						//store the key and the constructed value
						tempKV["" + kv[0]] = val; 
					}
				}
				//add the final tempKV array to the searchResults object so long
				//as it seems to be valid and has the NZBNAME field
				if(tempKV.NZBNAME){
					this.searchResults[i] = tempKV;
				}
				//reset the temporary key:value array
				tempKV = {};
			}
		}
		this.$.header.setContent("NZB Matrix Search - " + this.searchResults.length + " results");
		this.$.list.refresh();
		this.searching = false;
	},
	searchResultsFailure: function(inSender, inResponse){
		this.$.searchButton.setDisabled(false);
		this.$.searchButton.setActive(false);
		this.$.rightHeader.setContent(inResponse);
		this.searchResults.length = 0;
		this.$.list.refresh();
	},
	getDetails: function(inSender, inEvent){
		if(this.searchResults[inEvent.rowIndex]){
			this.doSearchItemSelected(this.searchResults[inEvent.rowIndex].LINK);
		}
	},
	nzbSelected: function(inSender, inEvent){
		if(this.searchResults[inEvent.rowIndex]){
			//download the selected item
			var url = createSabURL("mode=addurl&name=" + "https://" + this.searchResults[inEvent.rowIndex].LINK + "&nzbname=" + encodeURIComponent(this.searchResults[inEvent.rowIndex].NZBNAME));
			this.$.addDownload.setUrl(url);
			this.$.addDownload.call();
			
			//TODO should this be a post? I'm getting false successes when the IP address isn't even
			//reachable.
			
			//disable the button
			this.$.getButton.setDisabled(true);
		}
	},
	addDownloadSuccess: function(){
		this.$.getButton.setStyle("background-color:green");
		this.$.getButton.setDisabled(false);
	},
	addDownloadFailed: function(){
		this.$.getButton.setStyle("background-color:red");
		this.$.getButton.setDisabled(false);
	}
});