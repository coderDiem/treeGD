$('head').append('<link rel="stylesheet" href="/vendor/jquery/css/treeGD.css" type="text/css" />');

function treeGrid(id, opts)
{
    this.data = [];
    this.opts = [];
    this.curPage = 1;
    this.defaultRowsPerPages = 0;
    this.rowsPerPages = 0;
    this.elt = null;
    this.nElt = 0;
    this.cptElt = 0;
    this.lvl = 0;
    this.lvlMax = 0;
    this.sepLine = ":~:";
    this.urlJson = "";
    this.localParms = "";
    this.obj = "";
    this.lastPage = 0;

    this.isset = function (val)
    {
        return typeof val != "undefined";
    }
    this.makeTree = function (object) {
        this.lvl++;
        var rsp = '';
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (typeof object[property] == "object") {
                    this.nElt++;
                    rsp += "<ul class='treeGD-ul'><li class='treeGD-node treeGD-li' id='treeGD-li-" + this.nElt + "'  ><button onClick='$(\"#treeGD-li-" + this.nElt + "\").click();' class='treeGD-node-btn' id='treeGD-li-" + this.nElt + "-btn' >open</button>" + property + "</li>\n";
                    rsp += "<span id='treeGD-li-" + this.nElt + "-span' class='treeGD-li-span lvl" + this.lvl + "'>" + this.makeTree(object[property]) + "</span>";
                    rsp += "</ul>\n";

                } else {
                    //found a property which is not an object, check for your conditions here
                    //rsp+="<ul>\n<li>"+property+" = "+object[property]+"</li>\n</ul>\n";
                    rsp += this.sepLine + object[property] + "";
                }
            }
        }

        if (this.lvl > this.lvlMax)
        {
            this.lvlMax = this.lvl;
        }
        this.lvl--;
        return rsp;
    }

    this.makeSelect = function (obj, name)
    {
        var cpt = 0;
        var sel;
        rsp = "<select id='" + name + "' onChange='" + this.obj + ".chgRowPerPage(this.value);'>";
        for (var property in obj) {
            sel = "";
            if (this.rowsPerPages == 0)
            {
                if (cpt == 0)
                {
                    sel = " SELECTED";
                    this.defaultRowsPerPages = parseInt(obj[property]);
                    this.rowsPerPages = this.defaultRowsPerPages;
                }
            }
            else{
                if (property ==  this.rowsPerPages)
                {
                    sel = " SELECTED";
                }
            }
            rsp += "<option value='" + property + "' "+sel+">" + obj[property] + "</option>";
            cpt++;
        }
        rsp += "</select>";

        return rsp;
    }
    this.makePages = function (idrPp)
    {
        //this.rowsPerPages = this.defaultRowsPerPages;
        /*
         if ($("#" + idrPp).val() != "" && this.isset($("#" + idrPp).val()))
         {
         this.rowsPerPages = parseInt($("#" + idrPp).val());
         }
         */

        if (this.rowsPerPages == 0)
        {
            this.rowsPerPages = this.data["totalRows"];
        }
        var nPages = Math.ceil(this.data["totalRows"] / this.rowsPerPages);
        this.lastPage = nPages;
        rsp = "";
        for (var i = 1; i <= nPages; i++)
        {
            cls = '';
            if (i == this.curPage)
            {
                cls = "treeGD-Bold";
            }
            rsp += "<span id='treeGD-pager-" + i + "' class='" + cls + " hand pgNumber ' onClick=''" + this.obj + ".chgPage('"+i+"');'>" + i + "</span>";
        }

        return rsp;

    }

    this.makePager = function ()
    {

        var sel = this.makeSelect(this.opts["rowsPerPage"], "treeGD-rowsPerPage");
        var pg = this.makePages("treeGD-rowsPerPage");
        rsp = "<table><tr><td>&nbsp;</td><td>";
        rsp += "<button id='treeGD-first' class='littleBtn' onClick='" + this.obj + ".first();'>&lt;&lt;</button>";
        rsp += "<button id='treeGD-previous' class='littleBtn' onClick='" + this.obj + ".previous();'>&lt;</button>&nbsp;";
        rsp += pg;
        rsp += "&nbsp;&nbsp;";
        rsp += sel;
        rsp += "&nbsp;<button id='treeGD-next' class='littleBtn' onClick='" + this.obj + ".next();'>&gt;</button>";
        rsp += "<button id='treeGD-last' class='littleBtn' onClick='" + this.obj + ".last();'>&gt;&gt;</button>";

        return rsp;
    }

    this.loadTree = function () {

        var contentTree = this.makeTree(this.data["contents"]);
        //console.log(contentTree);
        this.lvlMax--;
        // $("#" + this.elt).html(contentTree + "<ul class='treeGD-ul'><li class='treeGD-li'>" + this.nElt + " elts</ul></li>");
        if (this.opts["rowsPerPage"] != '')
        {
            //$("#" + this.elt).append(this.makePager());
            contentTree += this.makePager();
        }

        $("#" + this.elt).html(contentTree);
        $(".treeGD-node").click(function (e)
        {
            //console.log(e.target.id);

            $("#" + e.target.id + "-span").toggle();


            var btn = $("#" + e.target.id + "-btn");

            var icon = "";
            //if ($("#" + e.target.id + "-span").is(":visible"))
            if ($("#" + e.target.id + "-span").hasClass("stateOpen"))
            {
                icon = "ui-icon-triangle-1-se";
                $("#" + e.target.id + "-span").removeClass("stateOpen")
            }
            else
            {
                icon = "ui-icon-triangle-1-e";
                $("#" + e.target.id + "-span").addClass("stateOpen")
            }


            btn.button({
                icons: {
                    primary: icon
                },
                text: false
            });
        });


        $(".treeGD-node-btn").button({
            icons: {
                primary: "ui-icon-triangle-1-se"
            },
            text: false
        });
        
        $("#treeGD-first").button({
            icons: {
                primary: "ui-icon-seek-first"
            },
            text: false
        });
        $("#treeGD-next").button({
            icons: {
                primary: "ui-icon-seek-next"
            },
            text: false
        });
        $("#treeGD-previous").button({
            icons: {
                primary: "ui-icon-seek-prev"
            },
            text: false
        });
        $("#treeGD-last").button({
            icons: {
                primary: "ui-icon-seek-end"
            },
            text: false
        });
        
        $(".treeGD-node-btn").click();

        if (this.data["totalRows"] <= this.opts["autoOpenAt"])
        {
            //$(".treeGD-li-span").show();
            $(".treeGD-node-btn").click();
        }

        if (!this.opts["getHtml"] || this.opts["getHtml"] == '')
        {
            $(".lvl" + this.lvlMax).each(function (key, value)
            {
                // console.log(key + "--" + value.innerHTML);
                var html = "<table><tr><td>" + value.innerHTML + "</td></tr></table>";

                var regex = new RegExp(this.sepLine, 'g');
                html = html.replace(regex, "</td><td>");

                $("#" + value.id).html(html);

            });
        }
    }

    this.loadJson = function () {
        var p = $("#" + this.opts["frm"]).serialize();
        //p += "&" + this.localParms;
        p += "&rowsPerPage=" + this.rowsPerPages;
        p += "&page=" + this.curPage;
        var myself = this;
        
        
        $("#"+this.elt).html(" ... loading ... chargement ...");

//console.log(p);
        $.ajax({
            url: this.opts["url"],
            data: p,
            dataType: 'json',
            success: function (response) {
                // response should be automagically parsed into a JSON object
                // now you can just access the properties using dot notation:
                myself.data = response;
                myself.loadTree();
            }
        });
    };

    this.first = function ()
    {
        //this.localParms += "page=1";
        //this.curPage = 1;
        //this.loadJson();
        this.chgPage(1);
    }

    this.next = function ()
    {
        var newPage = this.curPage + 1;

        if (this.curPage == this.lastPage)
        {
            newPage = this.curPage;
        }
        //this.localParms += "page=" + newPage;
        //this.curPage = newPage;
        //this.loadJson();
        this.chgPage( newPage);
    }

    this.previous = function ()
    {
        var newPage = this.curPage - 1;

        if (this.curPage == 1)
        {
            newPage = this.curPage;
        }
        //this.localParms += "page=" + newPage;
        //this.curPage = newPage;
        //this.loadJson();
        this.chgPage( newPage);
    }

    this.last = function ()
    {
        //this.localParms += "page=" + this.lastPage;
        //this.curPage = this.lastPage;
        //this.loadJson();
        
        this.chgPage( this.lastPage);
    }
    
    this.chgPage=function(val)
    {
        this.curPage=val;
        this.loadJson();
    }

    this.chgRowPerPage = function (val)
    {
        /*
         this.localParms = "page="+this.lastPage;
         this.curPage=this.lastPage;
         */

        //this.rowsPerPages=parseInt($("#" + idrPp).val());
        this.rowsPerPages = val;

        this.loadJson();
    }

    this.init = function (id, opts)
    {

        $("#" + this.elt).html("loading ...");
        //this.loadJson('./WS/treeGrid.php');
        this.loadJson();

    }

    this.search = function ()
    {

        $("#" + this.elt).html("loading ...");
        //this.loadJson('./WS/treeGrid.php');
        this.loadJson();

    }

    this.opts = opts;

    if (!this.isset(this.opts["url"]))
    {
        alert("Pas d'URL!");
    }
    if (this.opts["getHtml"])
    {
        this.sepLine = "";
    }
    this.elt = id;
    this.obj = this.opts.obj;

    var sel = this.makeSelect(this.opts["rowsPerPage"], "treeGD-rowsPerPage");
    /*
     treeGD= new treeGrid('treeGDFTECH', optsGrid);
     
     var crtObj=this.obj+"2 = new treeGrid(id,opts);"
     
     eval(crtObj);
     */

}