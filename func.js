
/** gets records on nytimes website
 * 
 * @param {dom} resultsElm
 * @param {string} query 
 * @param {integer} numRecords 
 * @param {integer} beginYear 
 * @param {integer} endYear 
 */
function query(resultsElm, query, numRecords=5, beginYear=null, endYear=null)
{
    // return if no element or query
    if (!resultsElm || !query) return;

    // for matching a string of 4 numbers
    const PREG_YEAR = /^[0-9]{4}$/;

    // build query URL based on parameters
    // reference: https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&begin_date=19950101&end_date=19960101&page=0&api-key=D60Hbpey3ic2LVVDufHiyIyz4P1tMwg1
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json" + 
        "?q=" + query +
        ((beginYear !== null && String(beginYear).match(PREG_YEAR)) ? "&begin_date=" + beginYear + "0101" : "") + // 0101 is jan 1st
        ((endYear !== null && String(endYear).match(PREG_YEAR)) ? "&end_date=" + endYear + "1231" : "") + // 1231 is dec 31st
        "&api-key=D60Hbpey3ic2LVVDufHiyIyz4P1tMwg1"; // api key

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(res) {

        // assign for readability
        var docs = res.response.docs;
        //console.log(res);

        var mainURL = "https://nytimes.com/";
        
        // get our display count based on results or num we would like
        var displayCount = numRecords;//Math.min(numRecords, res.docs.length);

        // go through each one
        for (var i = 0; i < displayCount; i++)
        {
            // create container of article and prepend to results
            var container = $('<article>');

            // setup contents of article..
            // headline for headline // res.docs[i].headline
            var header = $('<header>');
            header.html("<h3>"+ docs[i].headline.main +"</h3>");
            container.append(header);
            
            // web_url for url // res.docs[i].web_url
            var url = $('<a>');
            url.attr("href", docs[i].web_url);
            url.text(docs[i].web_url);
            container.append(url);
            // abstract for summary // res.docs[i].abstract
            var summary = $('<p>');
            summary.text(docs[i].abstract);
            container.append(summary);

            // multimedia
            if (docs[i].hasOwnProperty('multimedia') 
                && docs[i].multimedia.length > 0
                && docs[i].multimedia[0].hasOwnProperty('url')
            ) {
                var imgUrl = mainURL + docs[i].multimedia[0].url;
                var imgElm = $('<img>');
                imgElm.attr("src", imgUrl );
                container.append(imgElm);
            }
            
            // append container
            resultsElm.append(container);  
        }
    });
}
