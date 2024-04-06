/// <reference path="jsdiag.d.ts" /> 
/// <reference path="jscommon.d.ts" /> 

/// <reference path="JsDiagram-vsdoc.js" />
var DiagramView = MindFusion.Diagramming.DiagramView;

var Diagram = MindFusion.Diagramming.Diagram;
var DiagramLink = MindFusion.Diagramming.DiagramLink;
var ControlNode = MindFusion.Diagramming.ControlNode;

var Rect = MindFusion.Drawing.Rect;
var Point = MindFusion.Drawing.Point;

var Animation = MindFusion.Animations.Animation;
var AnimationType = MindFusion.Animations.AnimationType;
var EasingType = MindFusion.Animations.EasingType;
var AnimationEvents = MindFusion.Animations.Events;

var diagram = null;

document.addEventListener("DOMContentLoaded", function ()
{

   	// create a Diagram component that wraps the "diagram" canvas
	var diagramView = DiagramView.create(document.getElementById("diagram"));
	diagram = diagramView.diagram;
	
	diagram.virtualScroll= true;

	
	// create an Overview component that wraps the "overview" canvas
    var overview = MindFusion.Diagramming.Overview.create(document.getElementById("overview"));
    overview.diagramView = diagramView;	
	
	 // create an ZoomControl component that wraps the "zoomer" canvas
    var zoomer = MindFusion.Controls.ZoomControl.create(document.getElementById("zoomer"));
    zoomer.target = diagramView;
   
    var defaultTemplate = `
<p>Choose a state:<p>
<div><select data-interactive="true" data-event-change="selectClick" name="states" id="states">
  <option value="none" selected></option>
  <option value="Ohio">Ohio</option>
  <option value="South Dakota">South Dakota</option>
  <option value="Washington">Washington</option>
  <option value="Texas">Texas</option>
</select>
</div>`;

    diagram.defaultControlTemplate = defaultTemplate;
	
	 var node1 = new MindFusion.Diagramming.ControlNode(diagram);
        node1.template = `
<p>Choose a state:<p>
<div><select data-interactive="true" data-event-change="selectClick" name="states" id="states">
  <option value="none" selected></option>
  <option value="Ohio">Ohio</option>
  <option value="South Dakota">South Dakota</option>
  <option value="Washington">Washington</option>
  <option value="Texas">Texas</option>
</select>
</div>`;
        node1.bounds = new Rect(40, 10, 40, 25);
		node1.id = "states";
        diagram.addItem(node1);
		
});



function selectClick(e, sender)
{
	var selectControl = sender.getContent().getElementsByTagName("select")[0];
	
	deleteNode(selectControl.id);
	
	if(selectControl.id == "states")
	{		 
		 if(selectControl.value != "none")
			nextNode(1, sender);
	}
	else if(selectControl.id == "speciality")
	{
		if(selectControl.value != "none")
			nextNode(2, sender);
	}
	else if(selectControl.id == "qualification")
	{
		if(selectControl.value != "none")
			nextNode(3, sender);
	}
	else if(selectControl.id == "urgency")
	{
		if(selectControl.value != "none")
			nextNode(4, sender);
	}
}


	function nextNode(stage, originNode)
	{
		var node = new MindFusion.Diagramming.ControlNode(diagram);
		if(stage == 1)
		{
			node.template = `
			<p>Choose a speciality:<p>
			<div><select data-interactive="true" data-event-change="selectClick" name="speciality" id="speciality">
			  <option value="none" selected></option>			  
			  <option value="Cardiology">Cardiology</option>
			  <option value="Diagnostic Imaging">Diagnostic Imaging</option>
			  <option value="Gastroenterology">Gastroenterology</option>
			  <option value="Gynecology">Gynecology</option>
			  <option value="Neurology">Neurology</option>
			  <option value="Renal">Renal</option>
			</select>
			</div>`;		
			
			node.bounds = new Rect(30, 60, 60, 25);
			node.locked = true;
			node.visible = false;
			node.id = "speciality";
			diagram.addItem(node);	
			
			createAnimatedLink(originNode, node);	
		
		}
		else if(stage == 2)
		{
			node.template = `
			<p>Preferred doctor's qualification:<p>
			<div><select data-interactive="true" data-event-change="selectClick" name="qualification" id="qualification">
			  <option value="none" selected></option>			  
			  <option value="Consultant">Consultant</option>
			  <option value="Junior Doctor">Junior Doctor</option>
			  <option value="Doctor">Doctor</option>
			  <option value="Professor">Professor</option>
			</select>
			</div>`;		
			
			node.bounds = new Rect(30, 110, 60, 25);
			node.locked = true;
			node.visible = false;
			node.id = "qualification";
			diagram.addItem(node);	
            createAnimatedLink(originNode, node);				
		}
		else if(stage == 3)
		{
			node.template = `
			<p>How urgent it is?<p>
			<div><select data-interactive="true" data-event-change="selectClick" name="urgency" id="urgency">
			  <option value="none" selected></option>			  
			  <option value="Urgent">Urgent</option>
			  <option value="3-7 days">3-7 days</option>
			  <option value="1-2 weeks">1-2 weeks</option>
			  <option value="1 month">1 month</option>
			</select>
			</div>`;		
			
			node.bounds = new Rect(40, 160, 40, 25);		
			node.locked = true;
			node.visible = false;
			node.id = "urgency";
			diagram.addItem(node);	

		    createAnimatedLink(originNode, node);			
		}
		else if(stage == 4)
		{
			let errorMessage = "";
		
			//filter all doctors by state
		    var filter = document.getElementById("states").value;
			
			var availablePractitioners = practitioners.filter(function (p) {
             return p.state === filter;
			  });
			  
			
			  
			  if(availablePractitioners.length == 0)
				  errorMessage = "Sorry, we have no doctors in this state";
			 
			 //filter the result by speciality
			 filter = document.getElementById("speciality").value;
			 
			 var temp = availablePractitioners;
			 availablePractitioners = temp.filter(function (p) {
             return p.speciality === filter;
			  });
			  
			
			  if(availablePractitioners.length == 0)
				  errorMessage = "Sorry, we have no dcotors in this speciality in this state";
			 
			//filter by degree
			 filter = document.getElementById("qualification").value;
			 
			 temp = availablePractitioners;
			 availablePractitioners = temp.filter(function (p) {
             return p.rank === filter;
			  });
			  
	
			  
			    if(availablePractitioners.length == 0)
				  errorMessage = "Sorry, we have no dcotors in this field with this qualifications. Please, change it.";
			 
			 //filter by urgency
			 filter = document.getElementById("urgency").value;
			 
			 temp = availablePractitioners;
			 availablePractitioners = temp.filter(function (p) {
             return p.time === filter;
			  });
			 

			 if(availablePractitioners.length == 0)
				  errorMessage = "Sorry, we have no dcotors in this field with this time frame. Please, change it.";
			 
			 if(errorMessage != "")						
			 {
				 node.template = '<p>' + errorMessage + '<p>';
				 node.bounds = new Rect(40, 210, 40, 25);	
				 node.visible = false;				
				 diagram.addItem(node);
				 createAnimatedLink(originNode, node);
			 }			 	
			else
			{
				
				var layout = new MindFusion.Graphs.TreeLayout();
				layout.root = node;
				layout.direction = MindFusion.Graphs.LayoutDirection.TopToBottom;
				layout.keepRootPosition = true;
				layout.levelDistance = 10;
				linkType = MindFusion.Graphs.TreeLayoutLinkType.Cascading;
				
				for(var i = 0; i < availablePractitioners.length; i++)
				{
					node = new MindFusion.Diagramming.ControlNode(diagram);
					node.template = '<p align="center" style="font-weight:bold; font-size: 124x;">' + availablePractitioners[i].name.first + " " + availablePractitioners[i].name.last + '<p>' + 
					'<p align="center"><img src="images/' + availablePractitioners[i].photo + '" width="100" height="120"/></p><table><tr><td>Registered: </td><td>' + 
					availablePractitioners[i].registered + '</td></tr><tr><td>Phone: </td><td>' + 
					availablePractitioners[i].phone + '</td></tr><tr><td>Email: </td><td>' + 
					availablePractitioners[i].email + '</td></tr></table>';
					node.bounds = new Rect(40, 210, 75, 70);						
					node.stroke =  '#003466';	
					node.id = "last";
					diagram.addItem(node);	
					var link = new DiagramLink(diagram, originNode, node);
					link.headShape = 'Triangle';
					link.headBrush = '#003466';
					link.stroke =  '#003466';
					link.locked = true;
					diagram.addItem(link);	
					
				}				
				
				diagram.arrange(layout);
				diagram.resizeToFitItems(10);
			//	diagram.zoomToFit();
				
			}				
					
		}
		
	}
	
	function createAnimatedLink(originNode, node)
	{
		var link = new DiagramLink(diagram, originNode, node);
				link.headShape = 'Triangle';
				link.headBrush = '#003466';
				link.stroke =  '#003466';
				link.locked = true;
				diagram.addItem(link);
				
				var ep = link.endPoint;
				link.endPoint = link.startPoint;
				var animation = new Animation(link, { fromValue: link.startPoint, toValue: ep, animationType: AnimationType.Bounce, easingType: EasingType.EaseOut, duration: 1000 }, onUpdateLink);
				
				animation.addEventListener(AnimationEvents.animationComplete, function (sender, args)
				{
			
					node.visible = true;
					
					
				});
				
				animation.start();
	}
	
function deleteNode(id)
{
	
	var nodes = diagram.nodes.filter(function (p) {
             return p.id === id;
			  });
			  
	
	if(nodes.length > 0)
	{	
		deleteRecursively(nodes[0].outgoingLinks);		
	}
}

function deleteRecursively(links)
{
	
	for(var i = links.length-1; i >= 0; i--)
	{
		var node = links[i].destination;
		
		var nlinks = node.outgoingLinks;		
		deleteRecursively(nlinks);
		diagram.removeItem(node);
			
		
	}
}
	
	// a custom update callback for link animations
function onUpdateLink(animation, animationProgress)
{
	var link = animation.item;
	var pointA = animation.fromValue,
		pointB = animation.toValue;

	link.endPoint = 
		new Point(
			pointA.x + (pointB.x - pointA.x) * animationProgress,
			pointA.y + (pointB.y - pointA.y) * animationProgress);
	link.invalidate();
}


	


