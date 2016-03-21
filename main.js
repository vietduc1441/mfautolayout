/// reference <path="./typings/tsd.d.ts">;
var EditingUtils = require("./editingUtils");
var project = require("./config");
var Editing = new EditingUtils();
var moduleNames = process.argv.slice(2);
function autolayoutThenCommit() {
    Editing.load(project)
        .then(function () { return Editing.autolayouProject(moduleNames); })
        .then(function () { return Editing.commitToServer(); })
        .done(function () { return Editing.closeConnection(); });
}
exports.autolayoutThenCommit = autolayoutThenCommit;
