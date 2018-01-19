module.exports = {
  pd: Pallet_data
};


function Pallet_data(Pallet_id,frameType,screenType,keypadType,framecolor,screencolor,keyboardcolor)
{
    this.id= Pallet_id; // Pallet id number
    this.job_done=false; // flag to check if all the paint jobs are done
    this.paper_added=false; //flag to check if paper is added on the pallet
	
    this.screen_done = false; //flag to check if screen has been printed
    this.keyboard_done = false; //flag to check if keyboard has been printed
    this.framme_done = false; //flag to check if frame has been printed

	this.keyboard=keypadType; 
    this.screen=screenType; 
    this.frame=frameType;	
 
	this.keyboardColor=keyboardcolor; 
    this.screenColor=screencolor; 
    this.frameColor=framecolor; 
	
    this.screencolor_done = false; //flag to check if screen has been printed
    this.keyboardcolor_done = false; //flag to check if keyboard has been printed
    this.frammecolor_done = false; //flag to check if frame has been printed
	
	//WHEN PALLET LOADED.........
	this.currentZone = 3;
	this.nextZone = 5;
	this.currentWorkStation = 7;
	this.nextWorkStation = 8;
    
};


function randomInt (low, high)
{
    return Math.floor(Math.random() * (high - low) + low);
}

