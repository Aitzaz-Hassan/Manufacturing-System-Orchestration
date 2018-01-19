module.exports = {
  startOrchestrator: startOrchestrator,
  setOrder: setOrder
};

var WorkStation = require('./WorkStation/WorkStation').ws;
var startBuffer = require('./WorkStation/WorkStation').startBuffer;
var workStationOrder = require('./WorkStation/WorkStation').setOrder;
//(USER_ORDER);

function setOrder(userOrder){
	//USER_ORDER = userOrder;
	workStationOrder(userOrder);
}
function startOrchestrator(computerIP){
	var backupPortNumber = 5000;
	var WORK_STATION_IPS = require('./OrigionalRobotIps/workStationIps').getUrls;
	var AGENTSURL = computerIP;
	//Start http server for each workstation.
	var SimCNV7 = new WorkStation(5000,7, AGENTSURL, WORK_STATION_IPS['ws7']['cnv'], null);
	var SimCNV8 = new WorkStation(5001,8, AGENTSURL, WORK_STATION_IPS['ws8']['cnv'], WORK_STATION_IPS['ws8']['rob']);
	var SimCNV9 = new WorkStation(5002,9, AGENTSURL, WORK_STATION_IPS['ws9']['cnv'], WORK_STATION_IPS['ws9']['rob']);
	var SimCNV10 = new WorkStation(5003,10, AGENTSURL, WORK_STATION_IPS['ws10']['cnv'], WORK_STATION_IPS['ws10']['rob']);
	var SimCNV11 = new WorkStation(5004,11, AGENTSURL, WORK_STATION_IPS['ws11']['cnv'], WORK_STATION_IPS['ws11']['rob']);
	var SimCNV12 = new WorkStation(5005,12, AGENTSURL, WORK_STATION_IPS['ws12']['cnv'], WORK_STATION_IPS['ws12']['rob']);
	var SimCNV1 = new WorkStation(5006,1, AGENTSURL, WORK_STATION_IPS['ws1']['cnv'], WORK_STATION_IPS['ws1']['rob']);
	var SimCNV2 = new WorkStation(5007,2, AGENTSURL, WORK_STATION_IPS['ws2']['cnv'], WORK_STATION_IPS['ws2']['rob']);
	var SimCNV3 = new WorkStation(5008,3, AGENTSURL, WORK_STATION_IPS['ws3']['cnv'], WORK_STATION_IPS['ws3']['rob']);
	var SimCNV4 = new WorkStation(5009,4, AGENTSURL, WORK_STATION_IPS['ws4']['cnv'], WORK_STATION_IPS['ws4']['rob']);
	var SimCNV5 = new WorkStation(5010,5, AGENTSURL, WORK_STATION_IPS['ws5']['cnv'], WORK_STATION_IPS['ws5']['rob']);
	var SimCNV6 = new WorkStation(5011,6, AGENTSURL, WORK_STATION_IPS['ws6']['cnv'], WORK_STATION_IPS['ws6']['rob']);
	
	SimCNV7.runServer();
	SimCNV8.runServer();
	SimCNV9.runServer();
	SimCNV10.runServer();
	SimCNV11.runServer();
	SimCNV12.runServer();
	SimCNV1.runServer();
	SimCNV2.runServer();
	SimCNV3.runServer();
	SimCNV4.runServer();
	SimCNV5.runServer();
	SimCNV6.runServer();
	startBuffer();
}

