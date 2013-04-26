var geoApp = "";

  var doc = (function() {
    var currStepRow;
    var procTable;
    var acts = primitiveActions.actions;
    var procs = primitiveActions.getProcs();

    return {
      get currStepRow() { return currStepRow; },
      get procTable() { return procTable; },
      get acts() { return acts; },
      get procs() { return procs; },
      initialize: function() {
        var i;

        currStepRow = document.getElementById("currStep").rows[0];
        procTable = document.getElementById("procTable");

        actionsMenu.populate(primitiveActions.getActions); //actionsMenu.getRobotActions();
        actionsMenu.appendMenu('actions');
        procsMenu.populate(primitiveActions.getProcs); //procsMenu.getProcs();
        procsMenu.addAction("Define new...", "defNew"); //addProc("Define new...", "defNew");
        procsMenu.appendMenu('howToHead');
        procsMenu.menu.onclick = function() { selected(procsMenu.loadProc); };

        // currentStep.cs = 1;

        for(i = 0; i < procTable.rows[1].cells.length - 1; i++)
        {
          procTable.rows[1].cells[i].onclick = clickFn;
        }
      }
    };
  }());
/*
  var clickFn = function(e) {
    var step;
    var el = e.currentTarget;

    while(el && el.tagName != "TR") { el = el.parentNode; }
    step = el.rowIndex;

    if(currentStep.cs != step)
    {
      if(currentStep.cs > 0)
        currentStep.updateStep();

      currentStep.cs = step;
    }
  };

  var selected = (function() {
    var clickCount = 0;

    return function(fn) {
      clickCount++;
      if(clickCount == 2)
      {
        clickCount = 0;
        fn();
      }
    }
  }());

  //not quite right yet

  var pTable = (function() {
    return {
      addStep: function(event) {
        var el = event.currentTarget;
        var stepNum, i, row, newCell;

        if(currentStep.cs > 0) // && confirm("Would you like to save the step you're working on?"))
          currentStep.updateStep();

        while(el && el.tagName != "TR") { el = el.parentNode; }
        stepNum = el.rowIndex + 1;
        row = doc.procTable.insertRow(stepNum);

        for(i = 0; i < doc.procTable.rows[1].cells.length; i++)
        {
          newCell = row.insertCell(i);
          if(i != 3)
          {
            if(i == 0)
              newCell.innerHTML = stepNum;

            newCell.onclick = clickFn;
          }
          else
            newCell.innerHTML = doc.procTable.rows[1].cells[i].innerHTML;
        }

        for(i = 1; i < doc.procTable.rows.length - stepNum; i++)
        {
          doc.procTable.rows[i + stepNum].cells[0].innerHTML = i + stepNum;
        }

        currentStep.cs = stepNum;
      },

      deleteStep: function(event) {
        var el = event.currentTarget;
        var stepNum, i;
        var totalSteps = doc.procTable.rows.length - 1;

        while(el && el.tagName != "TR") { el = el.parentNode; }
        stepNum = el.rowIndex;

        if(totalSteps > 1)
        {
          if(currentStep.cs != stepNum || confirm("Are you sure you want to delete the step you're working on?"))
          {
            if(currentStep.cs == stepNum)
              currentStep.hide();

            for(i = stepNum + 1; i < doc.procTable.rows.length; i++)
            {
              doc.procTable.rows[i].cells[0].innerHTML = i - 1;
              if(i == currentStep.cs)
                currentStep.modStepNum(i-1);
            }

            doc.procTable.deleteRow(stepNum);
          }
        }
        else
        {
          alert("You cannot delete all the steps!");
        }
      },

      execProc: function(save) {
        var i, steps = [], label, val, r;
        var el = document.getElementById("procName");

        if((save && el.value != "") || !save)
        for(i = 1; i < doc.procTable.rows.length; i++)
        {
          r = doc.procTable.rows[i];
          steps[i - 1] = new Action(r.cells[1].title, r.cells[2].childNodes[0].nodeValue);
        }

        if(save)
        {
          if(el.value != "")
          {
            label = el.value;
            val = el.value;

            console.log("Saving proc... " + label + " " + val);
            procsMenu.addAction(label, val);

            doc.procTable.hide("div");
            doc.currStepRow.hide("div");
            el.hide("div");

            primitiveActions.addNewAction(label, steps);
          }
          else
            alert("In order to save the procedure you must give it a name.");
        }
        else
          primitiveActions.executeAction(steps);
      },

      clearTable: function() {
        var i;

        for(i = 2; i < doc.procTable.rows.length; i++)
          doc.procTable.deleteRow(i);

        doc.procTable.rows[1].cells[1].innerHTML = "";
        doc.procTable.rows[1].cells[2].innerHTML = "";
      },

      newProc: function() {
        this.clearTable();

        currentStep.cs = 1;
//        actionsMenu.disableMenu(false);
        doc.procTable.show("div");
        doc.currStepRow.show("div");
      },

      loadProc: function() {
        var steps = primitiveActions.getSteps(procsMenu.val()); //doc.acts[procsMenu.sel()].ex;
        var i, row, cell;

        console.log("Loading proc... " + steps);

        this.clearTable();

        for(i = 0; i < steps.length; i++)
        {
          if(i != 0)
          {
            row = doc.procTable.insertRow(i+1);
            row.innerHTML = doc.procTable.rows[1].innerHTML;
          }
          else
          {
            row = doc.procTable.rows[i+1];
          }

          row.cells[0].innerHTML = i + 1;
          row.cells[0].onclick = clickFn;

          row.cells[1].innerHTML = doc.acts[steps[i].name].label;
          row.cells[1].onclick = clickFn;
          row.cells[1].title = steps[i].name;

          row.cells[2].innerHTML = steps[i].op;
          row.cells[2].onclick = clickFn;
        }

        currentStep.cs = 1;
//        actionsMenu.disableMenu(true);
        doc.procTable.show("div");
        doc.currStepRow.show("div");
      }
    };
  }());

  var currentStep = (function() {
    var currStep = 0;

    return {
      get cs() { return currStep; },
      set cs(stepNum) {
 var rowEl = doc.procTable.rows[stepNum];
        var options, i, found = false;

        //set the step number column
        doc.currStepRow.cells[0].innerHTML = stepNum;

        //if loading a step from the proc table then set actions menu
        // to the same value
        if(rowEl.cells[1].hasChildNodes())
        {
          options = actionsMenu.menu.options;
          for(i = 0; !found && i < options.length; i++)
          {
            console.log("Options... " + options[i].text);
            console.log("RowEl etc... " + rowEl.cells[1].childNodes[0].nodeValue);
            if(options[i].text == rowEl.cells[1].childNodes[0].nodeValue)
            {
              actionsMenu.setSel(i);
              found = true;
            }
          }
        }
        else
        {
          actionsMenu.setSel(0);//doc.currStepRow.cells[1].childNodes[0].selectedIndex = 0;
        }

        //if loading a step copy the operand value
        if(rowEl.cells[2].hasChildNodes())
          doc.currStepRow.cells[2].childNodes[1].value = rowEl.cells[2].innerHTML;
        else
          doc.currStepRow.cells[2].childNodes[1].value = "";

        currStep = stepNum;
        doc.currStepRow.show("div");
      },

      updateStep: function() {
        var row = doc.procTable.rows[currentStep.cs];
        var el;

        row.cells[1].innerHTML = actionsMenu.menu.options[actionsMenu.sel()].text;
        row.cells[1].setAttribute("title", actionsMenu.val());

        row.cells[2].innerHTML = doc.currStepRow.cells[2].childNodes[1].value;

        currentStep.hide();
      },

      hide: function() {
        doc.currStepRow.hide("div");
        currStep = 0;
      },

      modStepNum: function(i) {
        doc.currStepRow.cells[0].innerHTML = i;
        currStep = i;
      }
    };
  }());

  Element.prototype.hide = function(tag) {
    var el = this;

    if(tag)
      while(el && el.tagName != tag.toUpperCase()) { el = el.parentNode; }

    el.style.display = "none";
  }

  Element.prototype.show = function(tag) {
    var el = this;

    if(tag)
      while(el && el.tagName != tag.toUpperCase()) { el = el.parentNode; }

    el.style.display = "block";
  }

  var actionsMenu = new ActMenu();
  var procsMenu = new ActMenu();

  procsMenu.loadProc = function()
  {
    var val = procsMenu.val();
    var el = document.getElementById("procName");;

    if(val == "defNew")
    {
      //call procTable method to init/load a new procedure
      console.log("Creating new proc...");
      el.show("div");
      el.value = "";
      el.disabled = false;
      pTable.newProc();
    }
    else
    {
      //call procTable method to load a proc from mem
      console.log("Loading proc from memory...");
      el.show("div");
      console.log("ProcsMenu Loading Proc... " + val);
      el.value = val; //(primitiveActions.procs[val]).label;
//      el.disabled = true;
      pTable.loadProc();
    }
  }

  function blank()
  {
    var numObjects = frames[0].geoApp.getObjectNumber();
    console.log(numObjects);
    for (var i = 0; i < numObjects; i++)
    {
      console.log(i);
      console.log(i + ": " + frames[0].geoApp.getObjectName(i));
      frames[0].geoApp.deleteObject(frames[0].geoApp.getObjectName(i));
    }

    frames[0].pF.pointNum = 1;
    frames[0].r1.location.x = 0;
    frames[0].r1.location.y = 0;
    frames[0].r1.show();
  }

  function initialize()
  {
    if(document.applets != null && document.applets.length > 0 && document.applets[0].isActive)
    {
      console.log("Applet ready...");
      init(new Point(0,0), 0);
//      doc.initialize();
//      setTimeout("pFListener.set()", 5000);
    }
    else
    {
      console.log("Applet not loaded...");
      setTimeout(init, 500);
    }
  }
*/
