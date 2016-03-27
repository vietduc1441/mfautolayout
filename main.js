/// reference <path="./typings/tsd.d.ts">;
var EditingUtils = require("./editingUtils");
var Editing = new EditingUtils();
function autolayoutThenCommit(project, moduleNames) {
    Editing.load(project)
        .then(function () { return Editing.autolayouProject(moduleNames); })
        .then(function () { return Editing.commitToServer(); })
        .done(function () { return Editing.closeConnection(); });
}
exports.autolayoutThenCommit = autolayoutThenCommit;
