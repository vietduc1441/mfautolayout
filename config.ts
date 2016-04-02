/////Project config/////////////
//TODO: config file for this
import interfaces=require("./interfaces");
var project:interfaces.IProject={
 username : 'youremail',
 apikey : 'your api key',
 projectId : 'project id',
 projectName : 'project name',
 revNo : -1, // -1 for latest
 branchName :   null // for mainline    
}
export=project;