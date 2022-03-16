var canvas = document.getElementById("canvas");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext("2d");
var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

// That's how you define the value of a pixel
function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * canvasWidth) * 4;
    
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

// That's how you update the canvas, so that your
// modification are taken in consideration
function updateCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}
// function AddGraphHandler(app)
// {
//   this.removeStack = true;
//   BaseHandler.apply(this, arguments);
//   this.message = g_clickToAddVertex;	
//   this.addContextMenu();
// }

// // inheritance.
// AddGraphHandler.prototype = Object.create(BaseHandler.prototype);

// AddGraphHandler.prototype.MouseDown = function(pos) 
// {
//     this.app.PushToStack("Add");

// 	this.app.CreateNewGraph(pos.x, pos.y);
// 	this.needRedraw = true;
// 	this.inited = false;
// }

// AddGraphHandler.prototype.InitControls = function() 
// {
//     var enumVertexsText = document.getElementById("enumVertexsText");
//     if (enumVertexsText)
//     {
//         var enumsList = this.app.GetEnumVertexsList();
//         for (var i = 0; i < enumsList.length; i ++)
//         {
//             var option = document.createElement('option');
//             option.text  = enumsList[i]["text"];
//             option.value = enumsList[i]["value"];
//             enumVertexsText.add(option, i);
//             if (enumsList[i]["select"])
//             {
//                 enumVertexsText.selectedIndex = i;
//             }
//         }
        
//         var addGraphHandler = this;
//         enumVertexsText.onchange = function () {
//             addGraphHandler.ChangedType();
//         };
//     }
// }

// AddGraphHandler.prototype.ChangedType = function() 
// {
// 	var enumVertexsText = document.getElementById("enumVertexsText");

// 	this.app.SetEnumVertexsType(enumVertexsText.options[enumVertexsText.selectedIndex].value);
// }



// /**
//  * Connection Graph handler.
//  *
//  */
// function ConnectionGraphHandler(app)
// {
//   this.removeStack = true;
//   BaseHandler.apply(this, arguments);
//   this.SelectFirst();
//   this.addContextMenu();	
// }

// // inheritance.
// ConnectionGraphHandler.prototype = Object.create(BaseHandler.prototype);
// // First selected.
// ConnectionGraphHandler.prototype.firstObject = null;

// ConnectionGraphHandler.prototype.GetSelectedVertex = function()
// {
//     return (this.firstObject instanceof BaseVertex) ? this.firstObject : null;
// }

// ConnectionGraphHandler.prototype.AddNewEdge = function(selectedObject, isDirect)
// {
// 	this.app.CreateNewArc(this.firstObject, selectedObject, isDirect, document.getElementById('EdgeWeight').value, $("#RadiosReplaceEdge").prop("checked"), document.getElementById('EdgeLable').value);
    
// 	this.SelectFirst();					
// 	this.app.NeedRedraw();
// }

// ConnectionGraphHandler.prototype.SelectVertex = function(selectedObject) 
// {
//     if (this.firstObject)
//     {
//         var direct = false;
//         var handler = this;

//         this.ShowCreateEdgeDialog(this.firstObject, selectedObject, function (firstVertex, secondVertex, direct) {
//             handler.AddNewEdge(secondVertex, direct);
//         });
//     }
//     else
//     {
//         this.SelectSecond(selectedObject);	
//     }
//     this.needRedraw = true;
// }

// ConnectionGraphHandler.prototype.MouseDown = function(pos) 
// {
// 	var selectedObject = this.GetSelectedGraph(pos);
// 	if (selectedObject && (selectedObject instanceof BaseVertex))
// 	{
//         this.SelectVertex(selectedObject);
// 	}
//     else
//     {  
//       this.SelectFirst();
//       this.needRedraw = true;
//     }
// }

// ConnectionGraphHandler.prototype.GetSelectedGroup = function(object)
// {
// 	return (object == this.firstObject) ? 1 : 0;
// }

// ConnectionGraphHandler.prototype.SelectFirst = function()
// {
// 	this.firstObject = null;
// 	this.message     = g_selectFisrtVertexToConnect + this.GetSelect2VertexMenu();
// }

// ConnectionGraphHandler.prototype.SelectSecond = function(selectedObject)
// {
// 	this.firstObject = selectedObject;
// 	this.message     = g_selectSecondVertexToConnect + this.GetSelect2VertexMenu();						
// }

// ConnectionGraphHandler.prototype.SelectFirstVertexMenu = function(vertex1Text, vertex)
// {
//    this.firstObject = null;
//    this.SelectVertex(vertex);
// }

// ConnectionGraphHandler.prototype.UpdateFirstVertexMenu = function(vertex1Text)
// {
//     if (this.firstObject)
//     {
//         vertex1Text.value = this.firstObject.mainText;        
//     }
// }

// ConnectionGraphHandler.prototype.SelectSecondVertexMenu = function(vertex2Text, vertex)
// {
//     this.SelectVertex(vertex);
// }

// ConnectionGraphHandler.prototype.UpdateSecondVertexMenu = function(vertex2Text)
// {
//     if (this.secondObject)
//     {
//         vertex2Text.value = this.secondObject.mainText;
//     }   
// }