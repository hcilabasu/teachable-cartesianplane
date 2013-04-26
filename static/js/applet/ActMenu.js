/*******************************************************
*
* A class that embeds a drop down menu and adds some other
* functionality used in teachHowToComp
*
********************************************************/

function ActMenu()
{
  this.menu = document.createElement("select");
  this.val = function() { return this.menu.value; };
  this.sel = function() { return this.menu.selectedIndex; };
}

ActMenu.prototype.setSel = function(i) {
  this.menu.selectedIndex = i;
}

ActMenu.prototype.addAction = function(label, value) {
  var option = document.createElement("option");
  option.text = label;
  if(value)
    option.value = value;
  else
    option.value = option.text; //will have to fix later using some string manipulation

  this.menu.add(option, null);
}

ActMenu.prototype.appendMenu = function(id) {
  document.getElementById(id).appendChild(this.menu);
}

ActMenu.prototype.disableMenu = function(bool) {
  menu.disabled = bool;
}

ActMenu.prototype.populate =  function(f) {
  var actions = f();
  var act;
  
  for(act in actions)
    this.addAction(act, actions[act]);
}