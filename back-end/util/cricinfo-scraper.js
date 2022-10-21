const rp = require("request-promise");
const cheerio = require('cheerio');
const {createObjectCsvWriter} = require("csv-writer");

const homeUrl = "https://www.espncricinfo.com";

/**

Web Scraping logic:

Page 1: https://stats.espncricinfo.com/ci/engine/records/index.html -> Nav bar:: IPL -> Click appropriate year
Page 2: https://stats.espncricinfo.com/ci/engine/series/313494.html?view=records -> Team Records :: Match results
Page 3: https://www.espncricinfo.com/ci/engine/records/team/match_results.html?id=3519;type=tournament :: Scorecards
Page 4: https://stats.espncricinfo.com/ci/engine/match/335982.html

 */

const scrapeToCSV = async () => {

    // This object is going to contain the finished JSON object array to write to the CSV file
    let results = [];

    // To store page1 url links for further processing
    let links = []; 

    const page1 = await rp(homeUrl + "/ci/engine/records/index.html");
    let $ = cheerio.load(page1);

    $("a[name^='&lpos=quicklink_IPL'] + div li").find('li > a').slice(1)
    .each((index, ele) => links.push(homeUrl + ele.attribs['href']));

    for (let link of links) {
        
        // Load each page on the links array to cheerio object
        const page2 = await rp(link);
        $ = cheerio.load(page2);
    
        // Select 'a' tag with text='Match Results'
        const page3Url = homeUrl + $("a:contains('Match results')").attr("href");
        const page3 = await rp(page3Url);
        $ = cheerio.load(page3);
    
        // Select 'a' tag with text='T20'
        const page4Urls = $("#ciHomeContentlhs a:contains('T20'):not(:contains(' ))").map(function(ele) {
            return homeUrl + $(this).attr("href");
        });

        // Push all the match links to result for now, we will scrape from it
        results.push(...page4Urls);

    };

    // Wait for all the matchJson objects to be parsed
    console.log(`${results.length} number of matches would be scraped from espncricinfo.`);
    results = await Promise.all(results.map(scrapeMatchPage));
    console.log(`${results.length} number of matches have been scraped from espncricinfo`);

    // Write the results array of json object to CSV file
    if (results.length > 0) {
        
        // Fetch all the headers
        let csvHeaders = [];
        Object.keys(results[0]).forEach((ele) => csvHeaders.push({id: ele, title: ele}));

        // Create the CSV Writer object
        const csvWriter = createObjectCsvWriter({path: "./data/match-data.csv", header: csvHeaders});

        try {
            results = results.filter(obj => Object.keys(obj).length > 0);
            await csvWriter.writeRecords(results);
            console.log(`${results.length} number of records were written to CSV.`);
        } catch (err) {
            throw new Error("Unable to write to CSV file: " + err);
        }

    } else {
        throw new Error("No data could be scraped");
    }
    
}

const scrapeMatchPage = async (pageUrl) => {

    // Fields that are to be written to the CSV database are stored here
    let matchJson = {};

    try {

        // Load the page and then load it to cheerio for scraping
        const page = await rp(pageUrl, {timeout: 15000});
        const $ = cheerio.load(page);

        // https://stats.espncricinfo.com/ci/engine/match/335982.html -> 335982
        matchJson.id = pageUrl.split("/").at(-1).slice(0, -5);

        // 13th match (D/N), Mohali, April 27, 2008 -> Mohali, Date Sun Apr 27 2008
        let _ = $(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid").text().split(", ");
        matchJson.city = _[1];
        matchJson.date = new Date(_[2] + ", " + _[3]).toISOString().slice(0, 10);

        // Get the toss winner and decision
        const tossStrings = $(".ds-text-tight-s.ds-font-medium:contains('Toss'):not(:contains(' '))").parent().siblings().first().children().first().text().split(", ");
        if (tossStrings[0] !== "no toss"){
            matchJson.toss_winner = tossStrings[0];
            matchJson.toss_decision = tossStrings[1].split(' ').at(-2);
        } else {
            matchJson.toss_winner = null;
            matchJson.toss_decision = null;

            // Currently cancelled matches would be filtered out
            return {}
        }

        // Scrape umpires from the website
        let umpires = $(".ds-text-tight-s.ds-font-medium:contains('Umpires'):not(:contains(' '))").parent().siblings().first().find("span span").map(function() {
            return $(this).text();
        });
        [matchJson.umpire1, matchJson.umpire2] = umpires;

        // Get the venue details - MA Chidambaram Stadium, Chepauk, Chennai
        matchJson.venue = $("a[href*=ground] span").text().split(", ")[0];

        // Get points info - Rajasthan Royals 2, Royal Challengers Bangalore 0
        const pointsString = $(".ds-min-w-max.ds-border-r.ds-border-line:contains('Points'):not(:contains(' '))").siblings().first().children().first().text().split(", ");
        if (pointsString[0].split(" ").at(-1) === "2" && pointsString[1].split(" ").at(-1) === "0"){
            matchJson.winner = pointsString[0].slice(0, -2);
        }
        else if (pointsString[0].split(" ").at(-1) === "0" && pointsString[1].split(" ").at(-1) === "2"){
            matchJson.winner = pointsString[1].slice(0, -2);
        } else { // If there had been a tie and equal points allotted to both teams
            matchJson.winner = null;
        }

        // Setting team1, team2 details from string extracted above
        [matchJson.team1, matchJson.team2] = pointsString.map((str) => str.slice(0, -2));

        // Fetch player of the match from span
        if (matchJson.winner){
            matchJson.player_of_match = cheerio.load($("span:contains('Player Of The Match')").parent().siblings()[0])("span span").text();
        } else {
            matchJson.player_of_match = null;
        }

        // Fetch the result and result margin: Chargers won by 7 wickets (with 12 balls remaining)
        const resultString = $("p[class='ds-text-tight-m ds-font-regular ds-truncate ds-text-typo-title'] span").text();
        if (!matchJson.winner){
            matchJson.result = null;
            matchJson.result_margin = null;
            matchJson.eliminator = null;
            matchJson.method = null;
        }
        else if (resultString.includes("tied")){
            matchJson.result = "tie";
            matchJson.result_margin = null;
            matchJson.eliminator = "Y";
            matchJson.method = resultString.match(new RegExp("the (.*) eliminator"))[1];
        } else {
            [matchJson.result_margin, matchJson.result] = resultString.match(/won by (.+?) (.+?)\b/).slice(1);
            matchJson.eliminator = "N";
            matchJson.method = resultString.includes("method") ? resultString.match(/ (.*) method\b/)[1]: null;
        }

        //	neutral_venue - no logic set currently simply setting as 0
        matchJson.neutral_venue = 0;

    } catch (err) { 
        console.log(`An Error occured scraping: ${pageUrl}\n${err}\n`);
    } 
        
    if (!matchJson.team1 && !matchJson.team2)
        return {};
    else 
        return matchJson;

}

module.exports = scrapeToCSV;