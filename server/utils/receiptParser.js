const fs        = require('fs');
const os   = require('os');
const path = require('path');
const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const { PDFImage } = require('pdf-image');


function isPdf(buffer) {
  return buffer.slice(0, 5).toString() === '%PDF-';
}


async function parseReceiptText(buffer) {
  let text = '';
  if (isPdf(buffer)) {
    const data = await pdf(buffer);
    text = data.text;
    console.log('PDF TEXT:', text);

    if (!text.trim()) {
      // alert('PDF is a scanned image, extracting text using OCR..');
      throw new Error('No text found in PDF');
    }
    
  } else {
    const { data: { text: imgText } } = await Tesseract.recognize(buffer, 'eng');
    text = imgText;
  }



// In your parseReceiptText, update date regexes:
const dateMatch =
  text.match(/(\d{1,4}[\/\-]\d{1,2}[\/\-]\d{2,4})/) || // MM/DD/YYYY, YYYY/MM/DD, etc.
  text.match(/(\d{1,2}[\s\-](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s\-\,]+\d{2,4})/i) || // 15 Jan 2024
  text.match(/((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s\-]\d{1,2}\,?[\s\-]+\d{2,4})/i); // January 15, 2024

const amtMatch = text.match(/TOTAL\s*DUE[:\s]*[$₹]?\s*(\d+\.\d{2})/i)
               || text.match(/TOTAL\s*[:\s]*[$₹]?\s*(\d+\.\d{2})/i)
               || text.match(/AMOUNT\s*DUE[:\s]*[$₹]?\s*(\d+\.\d{2})/i)
               || text.match(/(\d+\.\d{2})/g);

  let amount = undefined;
  if (amtMatch) {
    if (Array.isArray(amtMatch)) {
      amount = parseFloat(amtMatch[amtMatch.length - 1]); // last number
    } else {
      amount = parseFloat(amtMatch[1]);
    }
  }

  return {
    date:     dateMatch  ? normalizeDate(dateMatch[1]) : undefined,
    amount:   amount,
    category: '',
    note:     ''
  };
}

function isPdf(buffer) {
  // PDF files start with “%PDF-”
  return buffer.slice(0, 5).toString() === '%PDF-';
}

function normalizeDate(str) {
  // Month name to number map
  const months = {
    jan: '01', january: '01',
    feb: '02', february: '02',
    mar: '03', march: '03',
    apr: '04', april: '04',
    may: '05',
    jun: '06', june: '06',
    jul: '07', july: '07',
    aug: '08', august: '08',
    sep: '09', september: '09',
    oct: '10', october: '10',
    nov: '11', november: '11',
    dec: '12', december: '12'
  };

  str = str.trim();

  // 1. MM/DD/YYYY or M/D/YY
  let m = str.match(/^(\d{1,4})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    let [ , p1, p2, p3 ] = m;
    // If year is first (YYYY/MM/DD)
    if (p1.length === 4) {
      return `${p1}-${p2.padStart(2, '0')}-${p3.padStart(2, '0')}`;
    }
    // If year is last (MM/DD/YYYY or MM/DD/YY)
    let year = p3.length === 2 ? '20' + p3 : p3;
    return `${year}-${p1.padStart(2, '0')}-${p2.padStart(2, '0')}`;
  }

  // 2. DD Month YYYY or Month DD, YYYY
  m = str.match(/^(\d{1,2})[\s\-](\w+)[\s\-\,]+(\d{2,4})$/i);
  if (m) {
    let [ , day, mon, year ] = m;
    mon = mon.toLowerCase();
    if (months[mon]) {
      year = year.length === 2 ? '20' + year : year;
      return `${year}-${months[mon]}-${day.padStart(2, '0')}`;
    }
  }
  m = str.match(/^(\w+)[\s\-](\d{1,2})\,?[\s\-]+(\d{2,4})$/i);
  if (m) {
    let [ , mon, day, year ] = m;
    mon = mon.toLowerCase();
    if (months[mon]) {
      year = year.length === 2 ? '20' + year : year;
      return `${year}-${months[mon]}-${day.padStart(2, '0')}`;
    }
  }

  // 3. Fallback: return as is
  return str;
}

// ...rest of your code...

module.exports = { parseReceiptText };
