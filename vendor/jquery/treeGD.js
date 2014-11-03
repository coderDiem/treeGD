var treeGD = new Object();
treeGD.data = [];
treeGD.opts = [];
treeGD.loadJson = function () {
var p=$("#"+treeGD.opts["frm"]).serialize();

//console.log(p);
    $.ajax({
        url: treeGD.opts["url"],
        data: p,
        dataType: 'json',
        success: function (response) {
            // response should be automagically parsed into a JSON object
            // now you can just access the properties using dot notation:
            treeGD.data = response;
            treeGD.loadTree();
        }
    });
};
treeGD.elt = null;
treeGD.nElt = 0;
treeGD.lvl = 0;
treeGD.lvlMax = 0;
treeGD.sepLine = ":~:";
treeGD.urlJson = "";

treeGD.isset = function (val)
{
    return typeof val != "undefined";
}
treeGD.makeTree = function (object) {
    treeGD.lvl++;
    var rsp = '';
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            if (typeof object[property] == "object") {
                treeGD.nElt++;
                rsp += "<ul class='treeGD-ul'><li class='treeGD-node treeGD-li' id='treeGD-li-" + treeGD.nElt + "'  ><button onClick='$(\"#treeGD-li-" + treeGD.nElt + "\").click();' class='treeGD-node-btn' id='treeGD-li-" + treeGD.nElt + "-btn' >open</button>" + property + "</li>\n";
                rsp += "<span id='treeGD-li-" + treeGD.nElt + "-span' class='treeGD-li-span lvl" + treeGD.lvl + "'>" + treeGD.makeTree(object[property]) + "</span>";
                rsp += "</ul>\n";

            } else {
                //found a property which is not an object, check for your conditions here
                //rsp+="<ul>\n<li>"+property+" = "+object[property]+"</li>\n</ul>\n";
                rsp += treeGD.sepLine + object[property] + "";
            }
        }
    }

    if (treeGD.lvl > treeGD.lvlMax)
    {
        treeGD.lvlMax = treeGD.lvl;
    }
    treeGD.lvl--;
    return rsp;
}


treeGD.loadTree = function () {
    var contentTree = treeGD.makeTree(treeGD.data);
    //console.log(contentTree);
    treeGD.lvlMax--;
    $("#" + treeGD.elt).html(contentTree + "<ul class='treeGD-ul'><li class='treeGD-li'>" + treeGD.nElt + " elts</ul></li>");
    $(".treeGD-node").click(function (e)
    {
        //console.log(e.target.id);

        $("#" + e.target.id + "-span").toggle();


        var btn = $("#" + e.target.id + "-btn");

        var icon = "ui-icon-triangle-1-e";
        if ($("#" + e.target.id + "-span").is(":visible"))
        {
            icon = "ui-icon-triangle-1-se";
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
    $(".treeGD-node-btn").click();
    if (!treeGD.opts["getHtml"] || treeGD.opts["getHtml"] == '')
    {
        $(".lvl" + treeGD.lvlMax).each(function (key, value)
        {
            // console.log(key + "--" + value.innerHTML);
            var html = "<table><tr><td>" + value.innerHTML + "</td></tr></table>";

            var regex = new RegExp(treeGD.sepLine, 'g');
            html = html.replace(regex, "</td><td>");

            $("#" + value.id).html(html);

        });
    }
}


treeGD.init = function (id, opts)
{
    treeGD.opts = opts;

    if (!treeGD.isset(treeGD.opts["url"]))
    {
        alert("Pas d'URL!");
    }
    if (treeGD.opts["getHtml"])
    {
        treeGD.sepLine = "";
    }
    treeGD.elt = id;
    $("#" + treeGD.elt).html("loading ...");
    //treeGD.loadJson('./WS/treeGrid.php');
    treeGD.loadJson();

}