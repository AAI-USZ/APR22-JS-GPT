data.content.trim().should.eql(`<p>In Go’s templates, blocks look like this: <code>${escapeSwigTag('{{block "template name" .}} (content) {{end}}')}</code>.</p>`);
data.content.trim().should.contains(`<pre><code>${escapeSwigTag('{% pullquote %}foo foo foo{% endpullquote %}')}</code></pre>`);
data.content.trim().should.contains(`<pre><code>${escapeSwigTag('{% youtube https://example.com/demo.mp4 %}')}</code></pre>`);
