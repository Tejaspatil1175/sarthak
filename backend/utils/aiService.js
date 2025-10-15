/**
 * AI Engine Service
 * Communication with Python AI microservice
 */

import axios from 'axios';
import logger from './logger.js';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';
const AI_ENGINE_TIMEOUT = parseInt(process.env.AI_ENGINE_TIMEOUT) || 120000;

/**
 * AI Engine Client
 */
class AIService {
  constructor() {
    this.client = axios.create({
      baseURL: AI_ENGINE_URL,
      timeout: AI_ENGINE_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.info(`AI Engine Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error(`AI Engine Request Error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`AI Engine Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error(`AI Engine Response Error: ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Health check of AI Engine
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      logger.error(`AI Engine health check failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Convert eBOM to mBOM
   * @param {Array} eBOMData - eBOM components
   * @param {Object} options - Conversion options
   * @returns {Promise<Object>} Conversion result
   */
  async convertBOM(eBOMData, options = {}) {
    try {
      const startTime = Date.now();

      const payload = {
        ebom_data: eBOMData,
        options: {
          include_cost_estimation: options.includeCostEstimation !== false,
          include_supplier_mapping: options.includeSupplierMapping !== false,
          include_routing: options.includeRouting !== false,
          optimize_lead_time: options.optimizeLeadTime !== false,
          confidence_threshold: options.confidenceThreshold || 0.7,
        },
      };

      logger.info(`Converting BOM with ${eBOMData.length} components`);

      const response = await this.client.post('/api/convert', payload);

      const processingTime = Date.now() - startTime;

      logger.info(`BOM conversion completed in ${processingTime}ms`);

      return {
        success: true,
        mBOMData: response.data.mbom_data,
        metadata: {
          processingTime,
          aiConfidence: response.data.confidence || 0,
          componentsProcessed: eBOMData.length,
          componentsSuccessful: response.data.successful_count || eBOMData.length,
          componentsFailed: response.data.failed_count || 0,
        },
        errors: response.data.errors || [],
      };
    } catch (error) {
      logger.error(`BOM conversion error: ${error.message}`);

      // Check if it's a timeout error
      if (error.code === 'ECONNABORTED') {
        throw new Error('AI Engine timeout - processing took too long');
      }

      // Check if AI Engine is unavailable
      if (error.code === 'ECONNREFUSED') {
        throw new Error('AI Engine is not available');
      }

      // Return error details
      throw new Error(
        `AI Engine error: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Classify a single component
   * @param {Object} component - Component data
   * @returns {Promise<Object>} Classification result
   */
  async classifyComponent(component) {
    try {
      const response = await this.client.post('/api/classify', {
        component,
      });

      return {
        success: true,
        category: response.data.category,
        workCenter: response.data.work_center,
        confidence: response.data.confidence,
      };
    } catch (error) {
      logger.error(`Component classification error: ${error.message}`);
      throw new Error(`Classification failed: ${error.message}`);
    }
  }

  /**
   * Estimate cost for components
   * @param {Array} components - Components to estimate
   * @returns {Promise<Object>} Cost estimation result
   */
  async estimateCost(components) {
    try {
      const response = await this.client.post('/api/estimate-cost', {
        components,
      });

      return {
        success: true,
        estimates: response.data.estimates,
        totalCost: response.data.total_cost,
      };
    } catch (error) {
      logger.error(`Cost estimation error: ${error.message}`);
      throw new Error(`Cost estimation failed: ${error.message}`);
    }
  }

  /**
   * Get supplier recommendations
   * @param {Object} component - Component data
   * @returns {Promise<Object>} Supplier recommendations
   */
  async getSupplierRecommendations(component) {
    try {
      const response = await this.client.post('/api/suppliers', {
        component,
      });

      return {
        success: true,
        suppliers: response.data.suppliers,
      };
    } catch (error) {
      logger.error(`Supplier recommendation error: ${error.message}`);
      throw new Error(`Supplier recommendation failed: ${error.message}`);
    }
  }

  /**
   * Optimize routing
   * @param {Array} components - Components to optimize
   * @returns {Promise<Object>} Optimized routing
   */
  async optimizeRouting(components) {
    try {
      const response = await this.client.post('/api/optimize-routing', {
        components,
      });

      return {
        success: true,
        optimizedRouting: response.data.routing,
        savings: response.data.savings,
      };
    } catch (error) {
      logger.error(`Routing optimization error: ${error.message}`);
      throw new Error(`Routing optimization failed: ${error.message}`);
    }
  }

  /**
   * Get AI Engine statistics
   * @returns {Promise<Object>} AI Engine stats
   */
  async getStats() {
    try {
      const response = await this.client.get('/api/stats');

      return {
        success: true,
        stats: response.data,
      };
    } catch (error) {
      logger.error(`Get AI stats error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Export singleton instance
const aiService = new AIService();

export default aiService;
