// CREATED BY REYY


const axios = require('axios');
const cheerio = require('cheerio');

async function javGuruScraper(code) {
  const searchUrl = `https://jav.guru/?s=${encodeURIComponent(code)}`;
  const headers = { 'User-Agent': 'Mozilla/5.0' };

  try {
    const searchRes = await axios.get(searchUrl, { headers });
    const $search = cheerio.load(searchRes.data);
    const firstResult = $search('.post a').first().attr('href');

    if (!firstResult) {
      return { status: false, message: 'Kode tidak ditemukan di jav.guru' };
    }

    const detailRes = await axios.get(firstResult, { headers });
    const $ = cheerio.load(detailRes.data);

    const title = $('h1.post-title').text().trim();
    const image = $('.entry-content img').first().attr('src');

    const paragraphs = $('.entry-content p').toArray();
    let studio = '', releaseDate = '', cast = [], tags = [];

    paragraphs.forEach(p => {
      const text = $(p).text();
      if (text.includes('Release Date:')) {
        releaseDate = text.split('Release Date:')[1].trim();
      }
      if (text.includes('Studio:')) {
        studio = text.split('Studio:')[1].trim();
      }
      if (text.includes('Cast:')) {
        cast = text.split('Cast:')[1].split(',').map(c => c.trim());
      }
      if (text.includes('Tags:')) {
        tags = text.split('Tags:')[1].split(',').map(t => t.trim());
      }
    });

    return {
      status: true,
      code,
      title,
      studio,
      releaseDate,
      cast,
      tags,
      cover: image,
      source: firstResult
    };
  } catch (err) {
    return { status: false, message: err.message || 'Gagal mengakses jav.guru' };
  }
}

module.exports = javGuruScraper;
