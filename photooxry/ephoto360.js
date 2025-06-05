const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Created by Rey
 * Fungsi untuk membuat efek teks menggunakan ePhoto360
 * @param {string} text - Teks yang akan digunakan dalam efek
 * @returns {Promise<string>} - Path ke file gambar hasil
 */
async function createEPhoto360Effect(text) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    const url = 'https://en.ephoto360.com/create-light-glow-text-effects-online-706.html';

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Isi input teks
    await page.waitForSelector('#text-0');
    await page.type('#text-0', text);

    // Klik tombol "GO"
    await page.click('#submit');

    // Tunggu hingga gambar hasil muncul
    await page.waitForSelector('.result-image > img', { timeout: 60000 });

    // Ambil URL gambar hasil
    const imageUrl = await page.evaluate(() => {
      const img = document.querySelector('.result-image img');
      return img ? img.src : null;
    });

    if (!imageUrl) {
      throw new Error('Gagal mendapatkan URL gambar hasil.');
    }

    // gambar
    const viewSource = await page.goto(imageUrl);
    const buffer = await viewSource.buffer();

    // Simpan gambar ke file lokal
    const fileName = `ephoto360_${Date.now()}.jpg`;
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, buffer);

    return filePath;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = { createEPhoto360Effect };
