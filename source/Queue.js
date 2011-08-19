enyo.kind({
	name: "TouchSabNZB.Queue",
	kind: enyo.VFlexBox,
	components: [
		{kind: "WebService", name: "getQueue",
		  onSuccess: "gotQueue",
		  onFailure: "gotQueueFailure"
		},
		{kind: "WebService", name: "sendCommand" //requires no callbacks
		},
		{kind: "PageHeader", className: "enyo-header-dark",
		components: [
			{kind: "HFlexBox", align: "center", flex: 4,
			components: [
				{kind: "VFlexBox", flex: 2, 
				components: [
					{name: "queueHeader", content: "Queue"},
					{name: "rightHeader", className: "enyo-item-secondary"}
				]},
				{kind: "VFlexBox", flex: 2, pack: "center",
				components: [
					{
						name: "speedStatus",
						className: "enyo-item-secondary"
					},
//					{	
	//					name: "mbStatus", 
						//align: "center", 
		//				className: "enyo-item-secondary"
			//		}
				]},
				{	
					kind: "Input", name: "speed", onchange: "speedChange", autoKeyModifier: "num-lock",
					hint: "Limit", selectAllOnFocus: "true",
					autocorrect: "false", autoCapitalize: "lowercase", autoWordComplete: "false",
					classname: "picker-hbox",
					width: "100px"
				},
				{
					content: "kb/s",
					className: "enyo-item-secondary"
				},
				{kind: "Spinner", onclick: "refresh"}
			]}
		]},
		{kind: "Pane", flex: 1, components: [
			{kind: "VirtualList", name: "list", onSetupRow: "getListItem",
				components: [
					{kind: "ProgressBarItem", name: "progressBar", flex: 1, position: "0",
					components: [
						{kind: "SwipeableItem", flex: 1, onConfirm: "deleteItem",
						components: [
							{kind: "HFlexBox", align: "center",
								components: [
								{layoutKind: "VFlexLayout", flex: 4,
									components: [
										{name: "title", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"},
										{
											name: "downloadProgress",
											content: "0 / 1280 MB",
											className: "enyo-item-secondary",
											style: "color: blue"
										}
									]
								},
								{
									content: "Category",
									className: "enyo-label",
									flex: 1
								},
								{
									name: "myPicker",
									flex: 1,
									kind: "ListSelector",
									onChange: "categoryChanged",
									onclick: "categorySelected"
								},
								{
									name: "pauseResumeButton",
									kind: "IconButton",
									//icon: "images/pause2.png",
									onclick: "pauseResumeQueueItem"
								}
								]
							}
						]}
					]}
				],
				
			}
		]},
		{kind: "Toolbar", components: [
			
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.frequency = 1;
		
		//The global variables are defined here
		this.isPaused;			//Whether the global queue is paused
		this.status;			//The state of the app
		this.kbPerSec;			//Current speed of downloads
		this.speedLimit;		//Current speed limit
		this.mbTotal;			//Total number of MB in current queue
		this.mbLeft;			//Number of MB left in current queue
		this.categories = [];	//Categories
		this.scripts = [];		//Post-processing scripts
		this.slots = [];		//Items that are in the queue
		this.currentRow;
		this.timer;
		
		this.$.spinner.show();
		
	},
	getQueueClick: function() {
		this.$.getQueue.setUrl(createSabURL("mode=queue&start=0&limit=999&output=json"));
		this.$.getQueue.setHandleAs("json");
		this.$.getQueue.call();
	},
	gotQueue: function(inSender, inResponse, inRequest){
	
		this.$.spinner.stop();
		this.timer = setTimeout(enyo.bind(this, "refresh"), queueRefresh * 1000);
		
		if(!inResponse){
			this.$.rightHeader.setContent("No items in queue");
			return;
		}
		
		this.categories = [];
		this.scripts = [];
		this.slots = [];
		
		//stuff the categories
		for(i = 0; i < inResponse.queue.categories.length; i++){
			this.categories[i] = {caption: inResponse.queue.categories[i], value: inResponse.queue.categories[i]};
		}
		
		//scripts
		for(i = 0; i < inResponse.queue.scripts.length; i++){
			this.scripts[i] = {caption: inResponse.queue.scripts[i], value: inResponse.queue.scripts[i]};
		}
		
		//slots
		for(i = 0; i < inResponse.queue.slots.length; i++){
			this.slots[i] = 
			{ 
				status: inResponse.queue.slots[i].status,
				index: inResponse.queue.slots[i].index,
				eta: inResponse.queue.slots[i].eta,
				timeleft: inResponse.queue.slots[i].timeleft,
				script: inResponse.queue.slots[i].script,
				msgid: inResponse.queue.slots[i].msgid,
				mb: parseFloat(inResponse.queue.slots[i].mb),
				filename: inResponse.queue.slots[i].filename,			
				priority: inResponse.queue.slots[i].priority,
				category: inResponse.queue.slots[i].cat,
				mbleft: parseFloat(inResponse.queue.slots[i].mbleft),
				percentage: inResponse.queue.slots[i].percentage,
				size: inResponse.queue.slots[i].size,
				id: inResponse.queue.slots[i].nzo_id
			};
		}
			
		//Get the misc variables
		this.isPaused = inResponse.queue.paused;
		this.status = inResponse.queue.status;
		this.kbPerSec = inResponse.queue.kbpersec;
		this.speedLimit = inResponse.queue.speedlimit;
		this.mbTotal = inResponse.queue.mb;
		this.mbLeft = inResponse.queue.mbleft;
		
		//Update the header
		this.$.queueHeader.setContent("Queue (" + this.status + ")");
		this.$.rightHeader.setContent(this.slots.length + " Items in queue");
		this.$.speedStatus.setContent(this.kbPerSec + " kb/s");
		//this.$.mbStatus.setContent(this.mbLeft + " / " + this.mbTotal + " MB Remaining");
		
		if(!this.$.speed.hasFocus()){
			this.$.speed.setValue(this.speedLimit);
		}

		this.$.list.refresh();
	},
	gotQueueFailure: function(inSender, inResponse){
		this.$.rightHeader.setContent("Failure!");
		this.$.spinner.stop();
	},	
	getListItem: function(inSender, inIndex){
		if(this.slots[inIndex]){
			
			//Title
			this.$.title.setContent(this.slots[inIndex].filename);
					
			//MB totals
			this.$.downloadProgress.setContent((this.slots[inIndex].mb - this.slots[inIndex].mbleft).toFixed(2) + " / " + this.slots[inIndex].mb.toFixed(2) + " MB");
			
			//Download meter
			this.$.progressBar.setPosition(((this.slots[inIndex].mb - this.slots[inIndex].mbleft)/this.slots[inIndex].mb) * 100);
			
			if(this.categories){
				this.$.myPicker.setItems(this.categories);
				this.$.myPicker.setValue(this.slots[inIndex].category);
			}
			
			if(this.slots[inIndex].status == "Paused"){
				this.$.pauseResumeButton.setIcon("images/play.png");
			} else{
				this.$.pauseResumeButton.setIcon("images/pause2.png");
			}			
			
			return true;
		}
	},
	pauseResumeQueueItem: function(inSender, inEvent){
		if(this.slots[inEvent.rowIndex]){			
			if(this.slots[inEvent.rowIndex].status == "Paused"){
				//Resume the item
				this.$.sendCommand.setUrl(createSabURL("mode=queue&name=resume&value=" + this.slots[inEvent.rowIndex].id));
				this.$.sendCommand.call();
				
				//Refresh the queue
				this.getQueueClick();
			}
			else{
				//Pause the queue item
				this.$.sendCommand.setUrl(createSabURL("mode=queue&name=pause&value=" + this.slots[inEvent.rowIndex].id));
				this.$.sendCommand.call();
				
				//Refresh the queue
				this.getQueueClick();
			}			
		}
	},
	urlConstructor: function(){
	},
	categoryChanged: function(inSender, newValue, oldValue){	
		this.$.sendCommand.setUrl(createSabURL("mode=change_cat&value=" + this.slots[this.currentRow].id + "&value2=" + newValue));
		this.$.sendCommand.call();
		this.getQueueClick();
	},
	categorySelected: function(inSender, inEvent){
		this.currentRow = inEvent.rowIndex;
	},
	refresh: function(){
		this.$.spinner.start();
		this.getQueueClick();
	},
	startTimer: function(){
		this.refresh();
		this.timer = setTimeout(enyo.bind(this, "refresh"), queueRefresh * 1000);
	},
	stopTimer: function(){
		clearInterval(this.timer);
	},
	speedChange: function(){
		this.$.sendCommand.setUrl(createSabURL("mode=config&name=speedlimit&value=" + this.$.speed.getValue()));
		this.$.sendCommand.setHandleAs("json");
		this.$.sendCommand.call();		
	},
	deleteItem: function(inSender, inIndex){
		this.$.sendCommand.setUrl(createSabURL("mode=queue&name=delete&value=" + this.slots[inIndex].id));
		this.$.sendCommand.call();
		this.getQueueClick();
		
	}
});