var mendixmodelsdk_1 = require("mendixmodelsdk");
var when = require('when');
function retrieveAllIMicroflowsOfModule(mod) {
    var allMfs = mod.model.allMicroflows();
    return allMfs;
}
exports.retrieveAllIMicroflowsOfModule = retrieveAllIMicroflowsOfModule;
function loadAllMicroflows(microflows) {
    return when.all(microflows.map(loadMicroflow));
}
exports.loadAllMicroflows = loadAllMicroflows;
function loadMicroflow(microflow) {
    return when.promise(function (resolve, reject) {
        if (microflow) {
            microflow.load(function (mf) {
                if (mf) {
                    resolve(mf);
                }
                else {
                    reject("Failed to load microflow: " + microflow.qualifiedName);
                }
            });
        }
        else {
            reject("'microflow' is undefined");
        }
    });
}
exports.loadMicroflow = loadMicroflow;
function getMicroflowById(id, allMfs) {
    return allMfs.filter(function (mf) { return mf.id === id; })[0];
}
exports.getMicroflowById = getMicroflowById;
function findMxMicroflowByName(name, allMfs) {
    return allMfs.filter(function (mxMf) {
        return mxMf.name === name;
    })[0];
}
exports.findMxMicroflowByName = findMxMicroflowByName;
function findMxMicroflowsInModule(moduleName, allMfs) {
    return allMfs.filter(function (aMf) { return (aMf.qualifiedName.split(".")[0] === moduleName); });
}
exports.findMxMicroflowsInModule = findMxMicroflowsInModule;
function getMfReturnEvent(microflow) {
    var endEvent;
    microflow.objectCollection.objects
        .forEach(function (microflowObject) {
        if (microflowObject instanceof mendixmodelsdk_1.microflows.EndEvent) {
            endEvent = microflowObject;
        }
    });
    return endEvent;
}
exports.getMfReturnEvent = getMfReturnEvent;
function getMfParameters(microflow) {
    var params = [];
    microflow.objectCollection.objects
        .forEach(function (microflowObject) {
        if (microflowObject instanceof mendixmodelsdk_1.microflows.MicroflowParameterObject) {
            params.push(microflowObject);
        }
    });
    return params;
}
exports.getMfParameters = getMfParameters;
function getMfAnnotations(microflow) {
    var annos = [];
    microflow.objectCollection.objects
        .forEach(function (microflowObject) {
        if (microflowObject instanceof mendixmodelsdk_1.microflows.Annotation) {
            annos.push(microflowObject);
        }
        ;
    });
    return annos;
}
exports.getMfAnnotations = getMfAnnotations;
