/// reference <path="./typings/tds.d.ts">
import when = require('when');
import { MendixSdkClient, OnlineWorkingCopy, Project, Revision, Branch } from "mendixplatformsdk";
import {microflows, IModel, common}  from "mendixmodelsdk";
import microflowUtils= require("./microflowUtils");
import interfaces=require("./interfaces");
import dagre=require("dagre");

////////////////////////////////
var EditingUtil= class EditingUtil{
    private _isLoaded:boolean=false;
    private _mxMicroflows:Array<microflows.Microflow>;
    private _model:IModel;
    private _client:MendixSdkClient;
    private _workingCopy:OnlineWorkingCopy;
    model(){
        return this._model;
    }
    isLoaded(){
        return this._isLoaded;
    }
    load(projectInfo:interfaces.IProject):when.Promise<microflows.Microflow[]>{
        return when.promise<any>((resolve, reject)=>{
            this._client = new MendixSdkClient(projectInfo.username, projectInfo.apikey);
            const project = new Project(this._client, projectInfo.projectId, projectInfo.projectName);
            this._client.platform().createOnlineWorkingCopy(project, new Revision(projectInfo.revNo, new Branch(project, projectInfo.branchName)))
            .then(workingCopy =>{
                this._workingCopy=workingCopy;
                this._model=workingCopy.model();
                return this._model.allMicroflows();
            })
            .then(mfs=>microflowUtils.loadAllMicroflows(mfs))
            .then((mxMfs)=>{
                this._isLoaded=true;
                this._mxMicroflows=mxMfs;
            })
            .then(()=>(resolve(this._mxMicroflows)));
        });        
    }
    findMxMicroflowByName(name:string):microflows.Microflow{
        return this._mxMicroflows.filter((mxMf)=>{
            return mxMf.name===name;
        })[0];
    }
    findMxMicroflowById(id:string):microflows.Microflow{
        return microflowUtils.getMicroflowById(id,this._mxMicroflows);
    }
    /**
     * Autolayout all mfs in project if no modulename provided,
     * otherwise, autolayout all mfs in those modules
     */
    autolayouProject(moduleNames:string[]=[]){
        if (moduleNames.length===0){
            console.log("Autolayout all microflows in project.");
            this._mxMicroflows.forEach(this.autolayoutMxMf);
        }
        else{
            console.log("Autolayout all microflows in modules."+moduleNames);
            this.autolayoutModules(moduleNames);
        }
    }
    autolayoutModules(moduleNames:string[]){
        moduleNames.forEach(this.autolayoutModule);
    }
    autolayoutModule(moduleName:string){
        var mxMfsInModule=microflowUtils.findMxMicroflowsInModule(moduleName,this._mxMicroflows);
        mxMfsInModule.forEach(this.autolayoutMxMf);
    }
    autolayoutMxMf(mxMf:microflows.Microflow):void{
        console.log("layout: "+mxMf.qualifiedName);
        var g:Dagre.Graph= new dagre.graphlib.Graph();
        g.setGraph({rankdir:'LR'});        
        g.setDefaultEdgeLabel(function() { return {}; });
        mxMf.objectCollection.objects.forEach((mfObj:microflows.MicroflowObject)=>{
            g.setNode(mfObj.id,{label: mfObj.qualifiedName, width: mfObj.size.width, height: mfObj.size.height});
        })
        mxMf.flows.forEach((connection:microflows.Flow)=>{
            g.setEdge(connection.origin.id,connection.destination.id);
        })
        dagre.layout(g);
        
        g.nodes().forEach((nodeId:string)=>{
           var mxObj=mxMf.objectCollection.objects.filter((mfObj:microflows.MicroflowObject)=>(
                mfObj.id===nodeId                
           ))[0];
           mxObj.relativeMiddlePoint= {x: Math.round(g.node(nodeId).x), y: Math.round(g.node(nodeId).y)};
        });
    }
    commitToServer():void{
        //this._workingCopy.commit()
        this._client.platform().commitToTeamServer(this._workingCopy)
        .done(
        revision => console.log(`Successfully committed revision: ${revision.num() }. Done.`),
        error => {
            console.log('Something went wrong:');
            console.dir(error);
        });
    }
    closeConnection():void{
        this._model.closeConnection(
            () => {
                console.log(`Closed connection to Model API successfully.`);
                },
            (reason) => {
                console.log(`Failed to closed connection to Model API. Reason: ${reason}`);
                
            });
    }

}
export = EditingUtil;