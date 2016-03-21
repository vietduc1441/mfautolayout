/// reference <path="./typings/tsd.d.ts">;
import EditingUtils=require("./editingUtils");
import project=require("./config");
var Editing=new EditingUtils();
var moduleNames=process.argv.slice(2)
export function autolayoutThenCommit(){
    Editing.load(project)
    .then(()=> Editing.autolayouProject(moduleNames))
    .then(()=> Editing.commitToServer())
    .done(()=> Editing.closeConnection());
}
