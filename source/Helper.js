(function(){
	//[string] in the below comment will be replaced with the parameter
	//http://server:port/sabnzbd/api?[string]&output=json&apikey=key
	createSabURL = function(string){
		var temp;
		if(configuredSSL == true){
			temp = "https://";
		} else{
			temp = "http://";
		}
			
		temp = temp 
			+ configuredIP 
			+ ":" 
			+ configuredPort 
			+ "/sabnzbd/api?" 
			+ string 
			+ "&apikey=" 
			+ configuredAPI;
		
		return temp;
	}
	
	/*
		http://api.nzbmatrix.com/v1.1/search.php? = URL to use. No other URL is supported, please do not try to use them.
		search={SEARCH TERM} = Search Term
		&catid={CATEGORYID} = OPTIONAL, if left blank all categories are searched, category ID used from site.
		&num={MAX RESULTS} = OPTIONAL, if left blank a maximum of 5 results will display, 5 is the maximum number of results that can be produced.
		&age={MAX AGE} = OPTIONAL, if left blank full site retention will be used. Age must be number of "days" eg 200
		&region={SEE DESC} = OPTIONAL, if left blank results will not be limited 1 = PAL, 2 = NTSC, 3 = FREE
		&group={SEE DESC} = OPTIONAL, if left blank all groups will be searched, format is full group name "alt.binaries.X"
		&username={USERNAME} = Your account username.
		&apikey={APIKEY} = Your API Key.
		&larger={MIN SIZE} = OPTIONAL, minimum size in MB
		&smaller={MAX SIZE} = OPTIONAL, maximum size in MB
		&minhits={MIN HITS} = OPTIONAL, minimum hits
		&maxhits={MAX HITS} = OPTIONAL, maximum hits
		&maxage={MAX AGE} = OPTIONAL, same as &age (above) here for matching site search vars only
		&englishonly=1{ENGLISH ONLY} = OPTIONAL, if added the search will only return ENGLISH and UNKNOWN matches
		&searchin={SEARCH FIELD} = OPTIONAL, (name, subject, weblink) if left blank or not used then search filed is "name"

	*/
	createNZBMatrixURL = function(search, max){
		var temp = "https://api.nzbmatrix.com/v1.1/search.php?search=" 
			+ search 
			+ "&num=" + max 
			+ "&apikey=" + nzbMatrixAPI
			+ "&username=" + nzbMatrixUser;
		return temp;
	}
	
})();