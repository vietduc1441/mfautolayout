/// <reference path='./typings/tsd.d.ts' />
import { MendixSdkClient, OnlineWorkingCopy, Project, Revision, Branch } from "mendixplatformsdk";
import { ModelSdkClient, IModel, projects, domainmodels, microflows, pages, navigation, texts } from "mendixmodelsdk";
import when = require('when');
export function retrieveAllIMicroflowsOfModule(mod:projects.IModule):Array<microflows.IMicroflow> {
    var allMfs=mod.model.allMicroflows();
    return allMfs;
}
export function loadAllMicroflows(microflows: microflows.IMicroflow[]): when.Promise<microflows.Microflow[]> {
        return when.all<microflows.Microflow[]>(microflows.map(loadMicroflow));
    }
export function loadMicroflow(microflow: microflows.IMicroflow): when.Promise<microflows.Microflow> {
        return when.promise<microflows.Microflow>((resolve, reject) => {
            if (microflow) {
                microflow.load(mf => {
                    if (mf) {
                        resolve(mf);
                    } else {
                        reject(`Failed to load microflow: ${microflow.qualifiedName}`);
                    }
                });
            } else {
                reject(`'microflow' is undefined`);
            }
        });
    }
export function getMicroflowById(id:string, allMfs: microflows.Microflow[]){
    return allMfs.filter(mf=>mf.id===id)[0];
}
export function findMxMicroflowByName(name:string, allMfs:microflows.Microflow[]):microflows.Microflow{
    return allMfs.filter((mxMf)=>{
        return mxMf.name===name;
    })[0];
}
export function findMxMicroflowsInModule(moduleName: string, allMfs:microflows.Microflow[]):microflows.Microflow[]{
    return allMfs.filter((aMf:microflows.Microflow)=>( aMf.qualifiedName.split(".")[0]===moduleName));
}
export function getMfReturnEvent(microflow:microflows.Microflow): microflows.EndEvent{
    var endEvent:microflows.EndEvent;
    microflow.objectCollection.objects
    .forEach((microflowObject)=>{
        if (microflowObject instanceof microflows.EndEvent){
            endEvent=<microflows.EndEvent>microflowObject;
        }
    });
    return endEvent;
}
export function getMfParameters(microflow:microflows.Microflow):Array<microflows.MicroflowParameterObject>{
    var params: Array<microflows.MicroflowParameterObject>=[];
    microflow.objectCollection.objects
            .forEach((microflowObject)=>{
                if (microflowObject instanceof microflows.MicroflowParameterObject){
                   params.push(microflowObject);
                }
            });
    return params;
}
export function getMfAnnotations(microflow:microflows.Microflow):Array<microflows.Annotation>{
    var annos: Array<microflows.Annotation>=[];
     microflow.objectCollection.objects
    .forEach((microflowObject)=>{
        if (microflowObject instanceof microflows.Annotation){
            annos.push(microflowObject);
        };
    });
    return annos;
}
