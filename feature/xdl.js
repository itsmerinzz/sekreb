/**
 * Created By Rey
 * github.com/inirey
 */

const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

/**
 * Scrape video download link from x-downloader.com
 * @param {string} url - Video URL to download
 * @returns {Promise<Object>} 
 */
async function xDownloader(url) {
  try {
    const formData = qs.stringify({
      'url': url,
      'submit': ''
    });

    const headers = {
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://x-downloader.com',
      'referer': 'https://x-downloader.com/',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    };

    const { data } = await axios.post('https://x-downloader.com/', formData, { headers });
    const $ = cheerio.load(data);

    let result = {
      title: $('h4.text-primary').text().trim() || 'No title',
      thumbnail: $('img.img-thumbnail').attr('src'),
      download: [],
    };

    $('table.table tbody tr').each((_, el) => {
      const quality = $(el).find('td').eq(0).text().trim();
      const size = $(el).find('td').eq(1).text().trim();
      const link = $(el).find('td a').attr('href');
      if (link) {
        result.download.push({ quality, size, url: link });
      }
    });

    if (!result.download.length) throw 'Download link not found.';

    return result;

  } catch (err) {
    console.error('[xDownloader Error]', err);
    throw 'Gagal mengambil data dari x-downloader.com';
  }
}

module.exports = xDownloader;
