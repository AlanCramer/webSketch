


// base class ctor for Maker apps
function MakerApp() {
    
}

MakerApp.prototype.draw = function() {

    alert ("this draw function must be overridden.");
}


var addRow = function(tableName, inputName, inputId, inputType, inputValue) {
    var tableRef = document.getElementById(tableName); 

    // Insert a row in the table at row index 0
    var newRow = tableRef.insertRow(tableRef.rows.length);

    // Insert a cell in the row at index 0
    var newCell  = newRow.insertCell(0);

    // Append a text node to the cell
    var newText  = document.createTextNode(inputName);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(1);
    //"<input class="boxDim" id="heightbox" type="number" value="60" >");
    
    // TODO: use reflection to set whatever entries - 
    var elem = document.createElement("input");
    elem.id = inputId;
    elem.type = inputType || "text";
    elem.value = inputValue || "0";
    elem.name = inputName || "noname";
    elem.setAttribute("class", "boxDim");
    
    newCell.appendChild(elem);

}

var buildInputs = function(args) {

    for (var i = 0; i < args.length; ++i) {
        addRow('inputTable', args[i].name, args[i].id, args[i].type, args[i].value);
    }
}

// render is probably not the right word, more like display or init or ... ?
MakerApp.prototype.render = function (makerAppObj) {
    
    var titleElem = document.getElementById("title");
    title.innerHTML = makerAppObj.title;
    buildInputs(makerAppObj.inputs);
}

