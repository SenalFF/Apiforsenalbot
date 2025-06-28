const express = require('express');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/search', async (req, res) => {
  const { query } = req.query;
  const result = await ytSearch(query);
  const videos = result.videos.slice(0, 5).map(v => ({
    title: v.title,
    url: v.url,
    thumbnail: v.thumbnail,
    duration: v.timestamp,
    author: v.author.name
  }));
  res.json(videos);
});

app.get('/details', async (req, res) => {
  const { url } = req.query;
  if (!ytdl.validateURL(url)) return res.status(400).send('Invalid URL');
  const info = await ytdl.getInfo(url);
  const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
  res.json({ 
    title: info.videoDetails.title,
    length: info.videoDetails.lengthSeconds,
    formats: formats.map(f => ({
      quality: f.qualityLabel,
      mime: f.mimeType,
      size: f.contentLength,
      url: f.url
    }))
  });
});

app.get('/download', (req, res) => {
  const { url, quality } = req.query;
  if (!ytdl.validateURL(url)) return res.status(400).send('Invalid URL');
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(url, { quality }).pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));