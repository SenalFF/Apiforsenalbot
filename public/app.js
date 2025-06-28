async function search() {
  const query = document.getElementById('search').value;
  const res = await fetch('/search?query=' + encodeURIComponent(query));
  const videos = await res.json();
  const results = document.getElementById('results');
  results.innerHTML = '';
  videos.forEach(v => {
    const div = document.createElement('div');
    div.innerHTML = \`
      <img src="\${v.thumbnail}" width="120" />
      <p><strong>\${v.title}</strong><br>\${v.author} - \${v.duration}</p>
      <a href="/download?url=\${encodeURIComponent(v.url)}&quality=highest">Download</a>
      <hr>
    \`;
    results.appendChild(div);
  });
}