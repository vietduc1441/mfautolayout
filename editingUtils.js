/// reference <path="./typings/tds.d.ts">
var when = require('when');
var mendixplatformsdk_1 = require("mendixplatformsdk");
var microflowUtils = require("./microflowUtils");
var dagre = require("dagre");
////////////////////////////////
var EditingUtil = (function () {
    function EditingUtil() {
        this._isLoaded = false;
    }
    EditingUtil.prototype.model = function () {
        return this._model;
    };
    EditingUtil.prototype.isLoaded = function () {
        return this._isLoaded;
    };
    EditingUtil.prototype.load = function (projectInfo) {
        var _this = this;
        return when.promise(function (resolve, reject) {
            _this._client = new mendixplatformsdk_1.MendixSdkClient(projectInfo.username, projectInfo.apikey);
            var project = new mendixplatformsdk_1.Project(_this._client, projectInfo.projectId, projectInfo.projectName);
            _this._client.platform().createOnlineWorkingCopy(project, new mendixplatformsdk_1.Revision(projectInfo.revNo, new mendixplatformsdk_1.Branch(project, projectInfo.branchName)))
                .then(function (workingCopy) {
                _this._workingCopy = workingCopy;
                _this._model = workingCopy.model();
                return _this._model.allMicroflows();
            })
                .then(function (mfs) { return microflowUtils.loadAllMicroflows(mfs); })
                .then(function (mxMfs) {
                _this._isLoaded = true;
                _this._mxMicroflows = mxMfs;
            })
                .then(function () { return (resolve(_this._mxMicroflows)); });
        });
    };
    EditingUtil.prototype.findMxMicroflowByName = function (name) {
        return this._mxMicroflows.filter(function (mxMf) {
            return mxMf.name === name;
        })[0];
    };
    EditingUtil.prototype.findMxMicroflowById = function (id) {
        return microflowUtils.getMicroflowById(id, this._mxMicroflows);
    };
    /**
     * Autolayout all mfs in project if no modulename provided,
     * otherwise, autolayout all mfs in those modules
     */
    EditingUtil.prototype.autolayouProject = function (moduleNames) {
        if (moduleNames === void 0) { moduleNames = []; }
        if (moduleNames.length === 0) {
            console.log("Autolayout all microflows in project.");
            this._mxMicroflows.forEach(this.autolayoutMxMf);
        }
        else {
            console.log("Autolayout all microflows in modules." + moduleNames);
            this.autolayoutModules(moduleNames);
        }
    };
    EditingUtil.prototype.autolayoutModules = function (moduleNames) {
        moduleNames.forEach(this.autolayoutModule);
    };
    EditingUtil.prototype.autolayoutModule = function (moduleName) {
        var mxMfsInModule = microflowUtils.findMxMicroflowsInModule(moduleName, this._mxMicroflows);
        mxMfsInModule.forEach(this.autolayoutMxMf);
    };
    EditingUtil.prototype.autolayoutMxMf = function (mxMf) {
        console.log("layout: " + mxMf.qualifiedName);
        var g = new dagre.graphlib.Graph();
        g.setGraph({ rankdir: 'LR' });
        g.setDefaultEdgeLabel(function () { return {}; });
        mxMf.objectCollection.objects.forEach(function (mfObj) {
            g.setNode(mfObj.id, { label: mfObj.qualifiedName, width: mfObj.size.width, height: mfObj.size.height });
        });
        mxMf.flows.forEach(function (connection) {
            g.setEdge(connection.origin.id, connection.destination.id);
        });
        dagre.layout(g);
        g.nodes().forEach(function (nodeId) {
            var mxObj = mxMf.objectCollection.objects.filter(function (mfObj) { return (mfObj.id === nodeId); })[0];
            if (g.node(nodeId) && g.node(nodeId).x !== undefined && g.node(nodeId).y !== undefined) {
                mxObj.relativeMiddlePoint = { x: Math.round(g.node(nodeId).x), y: Math.round(g.node(nodeId).y) };
            }
        });
    };
    EditingUtil.prototype.commitToServer = function () {
        //this._workingCopy.commit()
        this._client.platform().commitToTeamServer(this._workingCopy)
            .done(function (revision) { return console.log("Successfully committed revision: " + revision.num() + ". Done."); }, function (error) {
            console.log('Something went wrong:');
            console.dir(error);
        });
    };
    EditingUtil.prototype.closeConnection = function () {
        this._model.closeConnection(function () {
            console.log("Closed connection to Model API successfully.");
        }, function (reason) {
            console.log("Failed to closed connection to Model API. Reason: " + reason);
        });
    };
    return EditingUtil;
})();
module.exports = EditingUtil;
