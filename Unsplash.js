//let params = new URLSearchParams(args);
const baseURL = "https://api.unsplash.com/photos/random";
const args = $argument.split("&").reduce((acc, cur) => {
    const [key, value] = cur.split("=");
        acc[key] = value;
    return acc;
}, {});
const fullURL = `${baseURL}?client_id=${args["client_id"]}&topics=${args["topics"]}&count=${args["count"]}`
//let fullURL = ${baseURL}?${$argument};

//`c` refers to the categories of YiYan, refer to https://developer.hitokoto.cn/sentence/ for more information
function getYiYan() {
    return new Promise((resolve, reject) => {
        $httpClient.get("https://v1.hitokoto.cn?encode=json&c=d&c=e&c=i&c=j&c=k", (err, resp, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    let obj = JSON.parse(data);
                    resolve(obj.hitokoto);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}

getYiYan().then(yiYan => {
    $httpClient.get(fullURL, (error, response, data) => {
        if (!error && response.status === 200) {
            try {
                let obj = JSON.parse(data)[0];
                let options = {
                    "action": "open-url",
                    "url": obj.links.html, //Linked webpage for the photo
                    "media-url": obj.urls.small //Photo image in low resolution (Caution: other resolutions may result in failure to display or less quality)
                };
                $notification.post(`${args["ScriptName"]}`, obj.user.name, yiYan, options);
            } catch (parseError) {
                $notification.post("Parse Error", "Failed to parse Unsplash data", "");
            }
        } else {
            $notification.post("Fetch Error", "No images found or bad request", "");
        }
        $done();
    });
}).catch(error => {
    $notification.post("Error", error.message, "");
    $done();
});
