/// reference <path="./typings/tsd.d.ts">;
import EditingUtils=require("./editingUtils");
var Editing=new EditingUtils();
export function autolayoutThenCommit(project,moduleNames){
    Editing.load(project)
    .then(()=> Editing.autolayouProject(moduleNames))
    .then(()=> Editing.commitToServer())
    .done(()=> Editing.closeConnection());
}
