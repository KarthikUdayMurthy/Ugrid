/*
CLASS Ugrid created by KARTHIK UDAY MURTHY
Purpose: Dynamic Grid creation with additional options
*/

function Ugrid(tableData,parentId,numRec,actions,classList) {
   try {
	this.errors = [];
this.recError = function(msg,e) {
		try {
			var msg = msg || '';
			var e = e || '';
			if(msg == '' || e == '')
			 return;
			this.errors.push(msg+' '+e);
			var p = document.getElementById(this.parentId);
			if(this.errors.length == 1)
			 p.innerHTML = '';
			var d = document.createElement('div');
			d.classList.add('Ugrid-ErrorDiv');
			d.innerHTML = '<b>' + msg + '</b><br>' + e;
			p.appendChild(d);
		} catch(e) {
			alert('Error while throwing the error !!!\n'+e);
		}
	}


	var filters = ["Equals","Not Equals","Contains","Does Not Contain","Greater Than","Less Than"];
	
	var scriptSrc = document.getElementsByTagName('script')

	for(var i=0; i<scriptSrc.length; i++) {
		if(scriptSrc[i].src.split("Ugrid.js").length > 1) {
			scriptSrc = decodeURI(scriptSrc[i].src);
			break;
		}
		
	}
	scriptSrc = scriptSrc.replace(scriptSrc.split("/")[scriptSrc.split("/").length-1],'');

	this.parentId = parentId

	if(!tableData)
	 throw "invalid Array";

	this.tableData = tableData || [1,2];
	this.fData = this.tableData.slice();
	this.filters = [];
	this.actions = actions || [];
	this.classList = classList || [];
	this.classList.push("Ugrid");
	this.classList = this.classList.join(" ");

	document.getElementById(this.parentId).classList.add('Ugrid-parent');

	this.radioName = this.parentId + '-UgridRadio';
	this.actionsMenuShow = 0;
	this.actionsMenu = undefined;

	this.fwdSort = [];
	this.revSort = [];
	this.allSort = [];

	this.l = document.createElement('div');
	this.l.classList.add('Ugrid-loading');
	this.l.appendChild(document.createTextNode('loading'));
	document.getElementById(this.parentId).appendChild(this.l);
	this.l.style.display = 'none';

	this.toolDiv = undefined;
	this.tableDiv = undefined;

	this.n  = numRec || 10;
	this.p  = this.fData.length-1;
	this.p1 = 1;
	this.p2 = (this.p1 + (this.n-1)) >= this.p ? this.p : this.p1 + (this.n-1);
	this.s  = Math.ceil(this.p / this.n);

	this.info = document.createElement("span");
	this.info.classList.add('Ugrid-info');

	this.pageInfo = document.createElement("span");
	this.pageInfo.classList.add('Ugrid-pageInfo');
	this.pageInfo.innerHTML = this.p1 + ' to ' + this.p2 + ' of ' +this.p;

	this.leftBtn = document.createElement("img");
	this.leftBtn.classList.add('Ugrid-leftBtn');
	this.leftBtn.setAttribute('src',scriptSrc + 'Upics/prev.png');
	this.leftBtn.setAttribute('alt','<');
	this.leftBtn.addEventListener("click",function() {
			that.prevRec();
		});

	this.rightBtn = document.createElement("img");
	this.rightBtn.classList.add('Ugrid-rightBtn');
	this.rightBtn.setAttribute('src',scriptSrc + 'Upics/next.png');
	this.rightBtn.setAttribute('alt','>');
	this.rightBtn.addEventListener("click",function() {
			that.nextRec();
		});

	var that = this;

	this.fSelCol = document.createElement('select');
	this.fData[0].forEach(function(col,i) {
			try {
				var o = document.createElement('option');
				o.innerHTML = col;
				o.setAttribute('value',i);
				that.fSelCol.appendChild(o);
			} catch(e) {
				that.recError('Error while creating filter options:',e);
			}
		});

	this.fSelOper = document.createElement('select');
	filters.forEach(function(col,i) {
			try {
				var o = document.createElement('option');
				o.innerHTML = col;
				o.setAttribute('value',col);
				that.fSelOper.appendChild(o);
			} catch(e) {
				that.recError('Error while creating filter options:',e);
			}
		});

	var fSelColChange = function() {
	 try {
			that.fSelOper.innerHTML = '';
			filters.forEach(function(col,i) {
				var o = document.createElement('option');
				o.innerHTML = col;
				o.setAttribute('value',col);
				that.fSelOper.appendChild(o);
			that.fSelVal.style.display = 'inline-block';
			that.fSelBtn.style.display = 'inline-block';
			that.fSelOper.style.display = 'inline-block';
			});
			if(that.fData[1] && typeof that.fData[1][that.fSelCol.value] == "date") {
			that.fSelVal.style.display = 'none';
			that.fSelBtn.style.display = 'none';
			that.fSelOper.style.display = 'none';
			}
			if(typeof that.fData[1][that.fSelCol.value] == "number") {
				that.fSelOper.innerHTML = '';
				filters.forEach(function(col,i) {
					if(i == 0 || i == 1 || i == 4 || i == 5) {
						var o = document.createElement('option');
						o.innerHTML = col;
						o.setAttribute('value',col);
						that.fSelOper.appendChild(o);
					}
				});
			}
	 } catch(e) {
		that.recError('Error while changing filter options:',e);
	 }
	}

	this.fSelCol.addEventListener('change',fSelColChange);
	
	this.fSelVal = document.createElement('input');
	this.fSelVal.setAttribute('type','text');
	this.fSelVal.setAttribute('placeholder','value');
	this.fSelVal.classList.add('Ugrid-fSelVal');
	
	this.fSelBtn = document.createElement('input');
	this.fSelBtn.setAttribute('type','button');
	this.fSelBtn.setAttribute('value','Add');
	this.fSelBtn.classList.add('Ugrid-fSelBtn');

	this.filDiv = document.createElement('div');
	this.filDiv.classList.add('Ugrid-filDiv');
	
	this.fFilBtn = document.createElement('input');
	this.fFilBtn.setAttribute('type','button');
	this.fFilBtn.setAttribute('value','All Filters (0)');
	this.fFilBtn.classList.add('Ugrid-fSelBtn');
	this.fFilBtn.addEventListener('click',function() {
			that.filDiv.classList.toggle('Ugrid-filDivShow');
		});

	this.filDropDownDiv = document.createElement('div');
	this.filDropDownDiv.classList.add('Ugrid-filDropDownDiv');

	this.filDivClose = document.createElement('span');
	this.filDivClose.classList.add('close');
	this.filDivClose.innerHTML = '&times;';
	this.filDivClose.addEventListener('click',function() {
			that.filDiv.classList.toggle('Ugrid-filDivShow');
		});

	this.filDiv.appendChild(this.filDivClose);
	this.filDropDownDiv.appendChild(document.createTextNode('No Filters'));

	this.filDiv.appendChild(this.filDropDownDiv);
	document.body.appendChild(this.filDiv);

	fSelColChange();

   } catch(e) {
	this.recError('Error while creating an Ugrid Object:',e);
   }




this.sort = function(ind) {
		try {
			this.unselectAll();
			this.l.style.display = 'block';
			if(this.revSort.indexOf(ind) != -1) {
				this.revSort.splice(this.revSort.indexOf(ind),1);
				this.allSort.splice(this.allSort.indexOf(ind),1);

			} else if(this.fwdSort.indexOf(ind) != -1) {
				this.fwdSort.splice(this.fwdSort.indexOf(ind),1);
				this.revSort.unshift(ind);
			} else {
				this.fwdSort.unshift(ind);
				this.allSort.unshift(ind);
			}
			
			//alert("ALL: " + this.allSort + "\nFWD: " + this.fwdSort + "\nREV: "+this.revSort);

			var temp = this.fData.shift();

			this.allSort.forEach(function(col) {
				that.fData.sort(function(a,b) {
					if(that.fwdSort.indexOf(col) != -1)
						return (a[col] < b[col]) ? -1 : 1;
					else
						return (a[col] > b[col]) ? -1 : 1;
				});
			});

			this.fData.unshift(temp);
			this.createTable();
		} catch(e) {
			this.recError("Error while sorting the table column no." + (ind+1) + ":",e);
			this.l.style.display = 'none';
		}
	}

this.createFrame = function() {
		try {
			this.l.style.display = 'block';
			if(!this.toolDiv) {
				var fDiv = document.createElement('div');
				fDiv.setAttribute('class','fDiv');
				this.toolDiv = document.createElement('div');
				this.toolDiv.classList.add('Ugrid-toolDiv');
				fDiv.appendChild(document.createTextNode("Filter: "));
				fDiv.appendChild(this.fSelCol);
				fDiv.appendChild(this.fSelOper);
				fDiv.appendChild(this.fSelVal);
				fDiv.appendChild(this.fSelBtn);
				fDiv.appendChild(this.fFilBtn);
				this.info.appendChild(this.leftBtn);
				this.info.appendChild(this.pageInfo);
				this.info.appendChild(this.rightBtn);
				this.toolDiv.appendChild(fDiv);
				//this.toolDiv.appendChild(this.filDiv);
				this.toolDiv.appendChild(this.info);
				document.getElementById(this.parentId).appendChild(this.toolDiv);		  
			} else {
				var a = 0;
			}
			if(!this.tableDiv) {
				this.tableDiv = document.createElement('div');
				this.tableDiv.classList.add('Ugrid-tableDiv');
				document.getElementById(this.parentId).appendChild(this.tableDiv);
			}
		} catch(e) {
			this.recError("Error while creating the frame:",e);
			this.l.style.display = 'none';
		}
	}

this.prevRec = function() {
		try {
			this.l.style.display = 'block';
			var temp = this.p2;
			this.p1 = this.p1 - this.n <= 0 ? 1 : this.p1 - this.n;
			this.p2 = (this.p1 + (this.n-1)) >= this.p ? this.p : this.p1 + (this.n-1);
			this.pageInfo.innerHTML = this.p1 + ' to ' + this.p2 + ' of ' +this.p;
			if(this.p2 != temp) {
				this.createTable();
			} else {
				this.l.style.display = 'none';
			}

		} catch(e) {
			this.recError("Error while displaying previous " + this.n + " records:",e);
			this.l.style.display = 'none';
		}
	}

this.nextRec = function() {
		try {
			this.l.style.display = 'block';
			var temp = this.p2;
			this.p1 = (this.p1 + (this.n-1)) >= this.p ? this.p1 : this.p1 + this.n;
			this.p2 = (this.p1 + (this.n-1)) >= this.p ? this.p : this.p1 + (this.n-1);
			this.pageInfo.innerHTML = this.p1 + ' to ' + this.p2 + ' of ' +this.p;
			if(this.p2 != temp) {
				this.createTable();
			} else {
				this.l.style.display = 'none';
			}

		} catch(e) {
			this.recError("Error while displaying next " + this.n + " records:",e);
			this.l.style.display = 'none';
		}
	}

this.createTable = function() {
		this.l.style.display = 'block';
	  setTimeout(function(){
		try {
			that.createFrame();
			if(that.actions.length >= 1)
			   that.createActionsMenu();
			var msg = "";
			var table = document.createElement('table');
			table.setAttribute("class",that.classList);
			table.setAttribute("border",1);
			var tableHead = document.createElement('thead');
			var tableBody = document.createElement('tbody');
			that.fData.forEach(function(rowData,i) {
				if(i == 0 || (i >= that.p1 && i <= that.p2)) {
				var row = document.createElement('tr');
				rowData.forEach(function(cellData,j) {
					var cell = (i == 0 ? document.createElement('th') : document.createElement('td'));
					if(that.actions.length >= 1 && j == 0) {
						var r = document.createElement('input');
						r.setAttribute('type','radio');
						r.setAttribute('name',that.radioName);
						r.setAttribute('value',i);
						r.addEventListener("click",function(event) {
							that.unselectAll();
							var e = event.target;
							if(e.checked) {
								e.parentNode.parentNode.classList.add('UgridTrSelect');
								that.actionsMenu.style.display = 'inline-block';
								that.actionsMenuShow = event.target;
								that.moveActionMenu(event.clientX,event.clientY);
							}
						});
						row.addEventListener("click",function(event) {
							if(event.target.tagName.toLowerCase() == "td") {
								var e = event.target.parentNode;
								var ch = e.classList.contains('UgridTrSelect'); 
								that.unselectAll();
								if(!ch) {
									e.classList.add('UgridTrSelect');
									e.childNodes[0].childNodes[0].checked = true;
									that.actionsMenu.style.display = 'inline-block';
									that.actionsMenuShow = event.target;
									that.moveActionMenu(event.clientX,event.clientY);
								}
							}
						});
						row.classList.add('UgridTrSelectHover');
						var c = (i == 0 ? document.createElement('th') : document.createElement('td'));
						c.appendChild((i == 0 ? document.createTextNode('Actions') : r));
						row.appendChild(c);
					}
					if(i == 0) {
						cell.addEventListener("click",function() {that.sort(j);});
						if(that.fwdSort.indexOf(j) != -1) cell.classList.add("fwdsort");
						if(that.revSort.indexOf(j) != -1) cell.classList.add("revsort");
					}
					cellData = (typeof cellData == "date") ? (new Date(cellData)).toLocaleDateString() : cellData ;
					cell.appendChild(document.createTextNode(cellData));
					row.appendChild(cell);
				});

				i == 0 ? tableHead.appendChild(row) : tableBody.appendChild(row);
				}
			});
			table.appendChild(tableHead);
			table.appendChild(tableBody);
			that.tableDiv.innerHTML = "";
			that.tableDiv.appendChild(table);
			msg = "Grid created Successfully";
			that.l.style.display = 'none';

		} catch(e) {
			that.recError("Error while creating the grid:",e);
			that.l.style.display = 'none';
		}
	  },100);
	}


this.changefData = function() {
		this.l.style.display = 'block';
	  setTimeout(function(){
		try {
			that.unselectAll();
			that.fData = that.tableData.slice();
			var header = that.fData.shift();
			var temp = [];
			that.filters.forEach(function(f,i) {
				var c = f[0];
				var o = f[1];
				var v = (typeof f[2] == "string") ? f[2].toUpperCase() : f[2];
				var rp = new RegExp(v,"i");
				if(o == "Equals") {
					temp = [];
					for(var j=0; j<that.fData.length; j++) {
						if(((typeof that.fData[j][c] == "string") ? that.fData[j][c].toUpperCase() : that.fData[j][c]) == v) {
							temp.push(that.fData[j]);
						}
					}
					that.fData = temp.slice();
				}
				if(o == "Not Equals") {
					temp = [];
					for(var j=0; j<that.fData.length; j++) {
						if(((typeof that.fData[j][c] == "string") ? that.fData[j][c].toUpperCase() : that.fData[j][c]) != v) {
							temp.push(that.fData[j]);
						}
					}
					that.fData = temp.slice();
				}
				if(o == "Greater Than") {
					temp = [];
					for(var j=0; j<that.fData.length; j++) {
						if(that.fData[j][c] > v) {
							temp.push(that.fData[j]);
						}
					}
					that.fData = temp.slice();
				}
				if(o == "Less Than") {
					temp = [];
					for(var j=0; j<that.fData.length; j++) {
						if(that.fData[j][c] < v) {
							temp.push(that.fData[j]);
						}
					}
					that.fData = temp.slice();
				}
				if(o == "Contains") {
					temp = [];
					for(var j=0; j<that.fData.length; j++) {
						if(rp.test(that.fData[j][c])) {
							temp.push(that.fData[j]);
						}
					}
					that.fData = temp.slice();
				}
				if(o == "Does Not Contain") {
					temp = [];
					for(var j=0; j<that.fData.length; j++) {
						if(!rp.test(that.fData[j][c])) {
							temp.push(that.fData[j]);
						}
					}
					that.fData = temp.slice();
				}
			});
			that.fData.unshift(header);
			that.p  = that.fData.length-1;
			that.p1 = 1;
			that.p2 = (that.p1 + (that.n-1)) >= that.p ? that.p : that.p1 + (that.n-1);
			that.pageInfo.innerHTML = that.p1 + ' to ' + that.p2 + ' of ' +that.p;
			that.createTable();

		} catch(e) {
			that.recError("Error while applying the filter:",e);
			that.l.style.display = 'none';
		}
	  },100);
	}


this.fSelBtn.addEventListener('click',function() {
		try {
		if(that.fSelVal.value == '')
		 return;
		var c = that.fSelCol.value;
		var o = that.fSelOper.value;
		var v = that.fSelVal.value;

		//alert(c+' '+o+' '+v);
		var temp = [];
		temp.push(c);
		temp.push(o);
		temp.push(v);
		that.filters.push([c,o,v]);
		that.fFilBtn.setAttribute('value','All Filters ('+that.filters.length+')');
		var s = document.createElement('div');
		var a = document.createElement('a');
		s.classList.add('Ugrid-filSpan');
		if(that.filters.length == 1)
		 that.filDropDownDiv.innerHTML = '';
		s.appendChild(document.createTextNode(that.fData[0][c] + ' ' + o + ' ' + v + ' '));
		a.setAttribute('href','#');
		a.appendChild(document.createTextNode('remove'));
		s.appendChild(a);
		that.filDropDownDiv.appendChild(s);
		a.addEventListener('click',function() {
			try {
				for(var i=0; i<that.filters.length; i++) {
					if(that.filters[i][0] == c && that.filters[i][1] == o && that.filters[i][2] == v) {
						that.filters.splice(i,1);
						break;
					}
				}
				that.fFilBtn.setAttribute('value','All Filters ('+that.filters.length+')');
				that.filDropDownDiv.removeChild(s);
				if(that.filters.length == 0) {
					that.filDropDownDiv.appendChild(document.createTextNode('No Filters'));
					that.filDiv.classList.toggle('Ugrid-filDivShow');
				}
				that.changefData();
			} catch(e) {
				that.recError('Error while removing the filter',e);
				that.filDiv.classList.toggle('Ugrid-filDivShow');
			}
		});
		that.changefData();
		
		
		} catch(e) {
			this.recError('Error while applying the filter:',e);
			that.l.style.display = 'none';
		}
	});

this.removeParentDivStyle = function() {
		try {
			var p = document.getElementById(this.parentId);
			p.classList.remove('Ugrid-parent');
		} catch(e) {
			this.recError('Error while removing the style from the parent DIV:',e);
		}
	}
this.unselectAll = function() {
		try {
			if(this.tableDiv.innerHTML != "") {
				var t = this.tableDiv.childNodes[0].childNodes[1].childNodes; 
				for(var i=0; i<t.length; i++) {
					if(t[i].classList.contains('UgridTrSelect')) {
						t[i].classList.remove('UgridTrSelect');
						t[i].childNodes[0].childNodes[0].checked = false;
						this.actionsMenuShow = 0;
					}
				}
			}
		} catch(e) {
			this.recError('Error while unselecting rows:',e);
		}
	}
this.createActionsMenu = function() {
		try {
			if(!this.actionsMenu) {
				this.actionsMenu = document.createElement('div');
				this.actionsMenu.classList.add('Ugrid-actionsMenu');
				this.actionsMenu.focus();
				window.addEventListener('click',function(event) {
					if(event.target !== that.actionsMenu && event.target !== that.actionsMenuShow) {
					 that.actionsMenu.style.display = 'none';
					 that.unselectAll();
					}
				});
				var actionlinkId = that.parentId + '-UgridActionLink';
				var aDiv = this.actionsMenu;
				for(var i=0; i<this.actions.length; i++) {
					var a = document.createElement('a');
					a.setAttribute('href','#');
					a.setAttribute('id',actionlinkId + i);
					a.appendChild(document.createTextNode(this.actions[i].name));
					a.addEventListener('click',function(event){
						try {
							event.preventDefault();
							var alid = Number(event.target.getAttribute('id').split(actionlinkId)[1]);
							var r = document.getElementsByName(that.radioName);
							var rid = undefined,rval = undefined;
							for(var j=0; j<r.length; j++) {
								if(r[j].checked) {
									rid = r[j].value;
									rval = that.fData[r[j].value];
									break;
								}
							}
							if(rid) {
								that.actions[alid].fn(rid,rval);
							}
							that.actionsMenu.style.display = 'none';
						} catch(e) {
							that.recError('Error while performing the action:',e);
							that.actionsMenu.style.display = 'none';
						}
						that.unselectAll();
					});

					aDiv.appendChild(a);
				}
				document.body.appendChild(aDiv);
			}
		} catch(e) {
			this.recError('Error while creating actions menu:',e);
		}
	}
this.moveActionMenu = function(x,y) {
		try {
			var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
			var scrollLeft = (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;
			var x = (Number(scrollLeft) + Number(x));
			var y = (Number(scrollTop) + Number(y));
			var p = document.getElementById(this.parentId);

			if(y-Number(p.offsetTop) > Number(p.offsetHeight) / 2) {
				y = Number(y) - Number(this.actionsMenu.offsetHeight) - 5;
			}

			if(x-Number(p.offsetLeft) > Number(p.offsetWidth) / 2) {
				x = Number(x) - Number(this.actionsMenu.offsetWidth) - 5;
			}

			this.actionsMenu.style.left = x+"px";
			this.actionsMenu.style.top = y+"px";

			window.scrollTo(x,y);
		} catch(e) {
			this.recError('Error while moving actions menu:',e);
		}
	}
}