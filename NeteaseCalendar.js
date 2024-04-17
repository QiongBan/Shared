const fullURL = "https://music.163.com/api/music/multi/terminal/widget/24/comment/calendar";

$httpClient.get(fullURL, (error, response, data) => {
    if (!error && response.status === 200) {
        try {
            let obj = JSON.parse(data);
            let title = "网易云音评";
            let info = obj.data.songName + " —— " + obj.data.singerName;
            let texts = obj.data.texts[0];
            let cover = obj.data.coverUrl;
            let options = {
                "action": "clipboard",
                "text": texts,
                "media-url": cover
                //"auto-dismiss": 10
            };
            $notification.post(title, info, texts, options);
        } catch (e) {
            $notification.post("Parse Error", "Failed to parse data", "");
        }
    } else {
        $notification.post("Fetch Error", "No data found or bad request", "");
    }
    $done();
});
