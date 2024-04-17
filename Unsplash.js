//let params = new URLSearchParams(args);
const baseURL = "https://api.unsplash.com/photos/random";
const args = $argument.split("&").reduce((acc, cur) => {
    const [key, value] = cur.split("=");
        acc[key] = value;
    return acc;
}, {});
const fullURL = `${baseURL}?client_id=${args["client_id"]}&topics=${args["topics"]}&count=${args["count"]}`
//const fullURL = `${baseURL}?${$argument}`;

//极其不建议将参数c设为l与f，如设置请使用末尾注释的代码替换对应内容
function getYiYan() {
    return new Promise((resolve, reject) => {
        $httpClient.get("https://v1.hitokoto.cn?encode=json&c=d&c=e&c=i&c=j&c=k", (err, resp, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    let obj = JSON.parse(data);
                    resolve({
                        yiYan: obj.hitokoto,
                        from: obj.from,
                        fromAuthor: obj.from_who,
												creator: obj.creator
                        
                    });
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}

getYiYan().then(result => {
    const { yiYan, from, fromAuthor, creator } = result;
    $httpClient.get(fullURL, (error, response, data) => {
        if (!error && response.status === 200) {
            try {
                let obj = JSON.parse(data)[0];
                //let author = obj.user.name;
                let origin;
                
                if (!fromAuthor || from === fromAuthor) {
                    origin = from;
                } else if (!fromAuthor && !from || (fromAuthor === "原创" && from === "原创")) {
									  origin = creator;
								} else if (!from) {
									  origin = fromAuthor;
								} else {
                    origin = `${fromAuthor} · ${from}`;
                }

                let options = {
                    "action": "open-url",
                    "url": obj.links.html,  // Linked webpage to the photo
                    "media-url": obj.urls.small  // Photo image in low resolution
                };

                $notification.post(`${args["ScriptName"]}`, `${yiYan}`, `---- ${origin}`, options);
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

/***
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
***/