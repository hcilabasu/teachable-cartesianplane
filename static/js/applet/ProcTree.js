function Node(action, parent)
{
  this.value = action;
  this.children = [];
  this.parent = parent;
}

Node.prototype.addChild = function(action)
{
  this.children.push(new Node(action,this));
}

Node.prototype.firstChild = function()
{
  return this.children[0];
}

/******************************************************
*
* Each node contains an action, an array of children
* and a link to parent.
*
* For now all class needs to do is create tree. The
* controller will execute the tree.
*
*******************************************************/

function ProcTree()
{
  var top = new Node();
  
  return top;
}