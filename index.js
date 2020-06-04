/*
TODO : 
- Fetch JSON data from /r/EarthPorn. ✅
- Loop through the data and create a 'PostObject'. ✅
- Display the data of 'PostObject' on the HTML Page.  ✅
*/

//First we create the variables
let request_URL = "https://www.reddit.com/r/food.json"; //the subreddit json data.

//Cache the ul element to store new elements in it
const imageList = document.querySelector('ul');
var metaDataCache = [];
var repeat;
var htmlId = 0;
var count = 0;

function fetchWebpage() {
  //Start the fetching request with request_URL
  fetch(request_URL)
    .then(data => {
      return data.json(); //Returning the data blob to the fetch request so we can extract the JSON from it.
    }).then(posts => {
      posts.data.children.forEach(post => {
        
        try {
          iurl = post.data.preview.images[0].resolutions[post.data.preview.images[0].resolutions.length-1].url;
        } catch (err) {
          return;
        }

        //Defining 'PostObject'
        let postObject = {
          imgurl: iurl, //Parsing the resultuion of the images
          imgtitle: post.data.title, //Parsing the title.
          upvotes: post.data.ups, //Parsing the upvotes
          posturl: 'https://www.reddit.com' + post.data.permalink //Parsing the post URL
        }

        //Adding a new element to the UL html element.
        var tmpId = search(postObject.imgurl, metaDataCache)
        if (tmpId >= 0) {
          var node = document.getElementById(tmpId).children[2];
          node.innerHTML = "🔼"+postObject.upvotes;
        } else {
          imageList.innerHTML += addNewImage(postObject);
          metaDataCache.push({url:postObject.imgurl, id:htmlId});
          htmlId++;
        }


        /*var tmpId = search(postObject.imgurl, metaDataCache)
        if (tmpId >= 0) {
          document.getElementById(tmpId).innerHTML = "New text!" + count++;
        } else {
          imageList.innerHTML += addNewImage(postObject);
          metaDataCache.push({url:postObject.imgurl, id:htmlId});
          htmlId++;
        }*/
      })
    });
    repeat = setTimeout(fetchWebpage, 10*1000);
}

function addNewImage(postObject) {
  return `
  <li id=${htmlId}>
    <p>${postObject.imgtitle}</p>
    <img src="${postObject.imgurl}">
    <h5>🔼${postObject.upvotes}</h5>
    <a target="_blank" href="${postObject.posturl}">🔗</a>
  </li>
  `;
}

function search(urlKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].url === urlKey) {
            return myArray[i].id;
        }
    }
    return -1;
}

$(document).ready(function(){
  fetchWebpage();
})
