module.exports = {
  list: function () {
		return event_list_ws;
  },
  paperList: function(){
		return event_list_paper;
  },
  palletList: function(){
		return event_list_pallet;
  },
  drawEndExecution: function(){
		return drawEndExecution;
  }

};


var event_list_ws =
[
 "/events/Z1_Changed/notifs",
 "/events/Z2_Changed/notifs",
 "/events/Z3_Changed/notifs",
 "/events/Z4_Changed/notifs"
];

var event_list_paper = 
{
	replacePaperEnded:	 "/events/ReplaceEnded/notifs",
	paperLoaded:     "/events/PaperLoaded/notifs",
	paperUnLoaded:   "/events/PaperUnloaded/notifs"	  
}



var event_list_pallet = 
{
		palletLoaded:    "/events/PalletLoaded/notifs",
		palletUnLoaded:  "/events/PalletUnloaded/notifs"  
}


var drawEndExecution = '/events/DrawEndExecution/notifs';