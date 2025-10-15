/**
 * File Parser Utilities
 * Supports Excel, CSV, and JSON formats
 */

import xlsx from 'xlsx';
import csvParser from 'csv-parser';
import fs from 'fs';
import { Readable } from 'stream';

/**
 * Parse Excel file (XLSX/XLS)
 * @param {string} filePath - Path to Excel file
 * @returns {Promise<Array>} Parsed data
 */
export const parseExcel = async (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      defval: '',
    });

    return data;
  } catch (error) {
    throw new Error(`Excel parsing error: ${error.message}`);
  }
};

/**
 * Parse CSV file
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} Parsed data
 */
export const parseCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(new Error(`CSV parsing error: ${error.message}`)));
  });
};

/**
 * Parse JSON file
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<Array>} Parsed data
 */
export const parseJSON = async (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    // Ensure data is an array
    if (!Array.isArray(data)) {
      throw new Error('JSON must contain an array of components');
    }

    return data;
  } catch (error) {
    throw new Error(`JSON parsing error: ${error.message}`);
  }
};

/**
 * Auto-detect file format and parse
 * @param {string} filePath - Path to file
 * @param {string} mimetype - MIME type of file
 * @returns {Promise<Array>} Parsed data
 */
export const parseFile = async (filePath, mimetype) => {
  const extension = filePath.split('.').pop().toLowerCase();

  switch (extension) {
    case 'xlsx':
    case 'xls':
      return await parseExcel(filePath);
    case 'csv':
      return await parseCSV(filePath);
    case 'json':
      return await parseJSON(filePath);
    default:
      throw new Error(`Unsupported file format: ${extension}`);
  }
};

/**
 * Validate BOM data structure
 * @param {Array} data - Parsed BOM data
 * @returns {Object} Validation result
 */
export const validateBOMData = (data) => {
  const errors = [];
  const warnings = [];

  // Check if data is empty
  if (!data || data.length === 0) {
    errors.push('BOM data is empty');
    return { valid: false, errors, warnings };
  }

  // Required fields
  const requiredFields = ['partNo', 'description', 'quantity'];
  const optionalFields = ['unit', 'material', 'level', 'parentPartNo'];

  // Check first row for required fields
  const firstRow = data[0];
  const availableFields = Object.keys(firstRow).map((key) => key.toLowerCase());

  requiredFields.forEach((field) => {
    const fieldLower = field.toLowerCase();
    const variations = [
      fieldLower,
      fieldLower.replace('no', 'number'),
      fieldLower.replace('qty', 'quantity'),
    ];

    const hasField = variations.some((variant) =>
      availableFields.some((available) => available.includes(variant))
    );

    if (!hasField) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate each row
  data.forEach((row, index) => {
    // Check for empty part number
    if (!row.partNo && !row.PartNo && !row.partNumber && !row.PartNumber) {
      errors.push(`Row ${index + 1}: Missing part number`);
    }

    // Check for empty description
    if (!row.description && !row.Description) {
      warnings.push(`Row ${index + 1}: Missing description`);
    }

    // Check quantity
    const qty = row.quantity || row.Quantity || row.qty || row.Qty;
    if (qty !== undefined && qty !== null) {
      const qtyNum = parseFloat(qty);
      if (isNaN(qtyNum) || qtyNum < 0) {
        errors.push(`Row ${index + 1}: Invalid quantity value`);
      }
    } else {
      warnings.push(`Row ${index + 1}: Missing quantity`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    totalRows: data.length,
  };
};

/**
 * Normalize BOM data to standard format
 * @param {Array} data - Raw parsed data
 * @returns {Array} Normalized data
 */
export const normalizeBOMData = (data) => {
  return data.map((row) => {
    // Map various field name variations to standard names
    const normalized = {
      partNo: row.partNo || row.PartNo || row.partNumber || row.PartNumber || row.part_no || '',
      description:
        row.description || row.Description || row.desc || row.Desc || row.name || '',
      quantity: parseFloat(
        row.quantity || row.Quantity || row.qty || row.Qty || row.amount || 1
      ),
      unit: row.unit || row.Unit || row.uom || row.UOM || 'EA',
      material: row.material || row.Material || row.mat || row.Mat || '',
      level: parseInt(row.level || row.Level || row.lvl || row.Lvl || 1),
      parentPartNo:
        row.parentPartNo ||
        row.ParentPartNo ||
        row.parent ||
        row.Parent ||
        row.parent_part_no ||
        '',
    };

    // Add any additional fields
    Object.keys(row).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (
        !['partno', 'description', 'quantity', 'unit', 'material', 'level', 'parentpartno'].includes(
          lowerKey.replace(/_/g, '')
        )
      ) {
        normalized[key] = row[key];
      }
    });

    return normalized;
  });
};

/**
 * Convert data to Excel buffer
 * @param {Array} data - Data to convert
 * @param {string} sheetName - Sheet name
 * @returns {Buffer} Excel file buffer
 */
export const dataToExcel = (data, sheetName = 'mBOM') => {
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

  return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

/**
 * Convert data to CSV string
 * @param {Array} data - Data to convert
 * @returns {string} CSV string
 */
export const dataToCSV = (data) => {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape values containing commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
};

export default {
  parseExcel,
  parseCSV,
  parseJSON,
  parseFile,
  validateBOMData,
  normalizeBOMData,
  dataToExcel,
  dataToCSV,
};
