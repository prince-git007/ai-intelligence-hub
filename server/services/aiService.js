const axios = require('axios');

/**
 * AI Service for generating summaries using OpenAI or Groq
 */
class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'groq'; // 'openai' or 'groq'
    this.apiKey = this.provider === 'openai' 
      ? process.env.OPENAI_API_KEY 
      : process.env.GROQ_API_KEY;
    
    this.baseURL = this.provider === 'openai'
      ? 'https://api.openai.com/v1'
      : 'https://api.groq.com/openai/v1';
    
    this.model = this.provider === 'openai'
      ? process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
      : process.env.GROQ_MODEL || 'mixtral-8x7b-32768';
  }

  /**
   * Generate a summary of the lead message
   * @param {string} message - The original message content
   * @param {string} source - The source of the lead (optional, for context)
   * @returns {Promise<string>} - The AI-generated summary
   */
  async generateSummary(message, source = '') {
    if (!this.apiKey) {
      console.warn('AI API key not configured. Returning empty summary.');
      return '';
    }

    if (!message || message.trim().length === 0) {
      return '';
    }

    try {
      const prompt = this.buildPrompt(message, source);
      
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes lead messages concisely. Focus on key information, intent, and urgency.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      const summary = response.data.choices[0]?.message?.content?.trim() || '';
      return summary;
    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message);
      
      // Return a fallback summary if API fails
      return this.generateFallbackSummary(message);
    }
  }

  /**
   * Build the prompt for AI summarization
   */
  buildPrompt(message, source) {
    let prompt = `Summarize this lead message in 2-3 sentences, highlighting:\n`;
    prompt += `- Main intent or request\n`;
    prompt += `- Key information\n`;
    prompt += `- Urgency level\n\n`;
    
    if (source) {
      prompt += `Source: ${source}\n`;
    }
    
    prompt += `Message: ${message}`;
    
    return prompt;
  }

  /**
   * Generate a fallback summary if AI service fails
   */
  generateFallbackSummary(message) {
    if (message.length <= 100) {
      return message;
    }
    
    // Simple truncation with ellipsis
    return message.substring(0, 150) + '...';
  }

  /**
   * Generate an AI-powered reply to a lead message
   * @param {string} originalMessage - The original message from the lead
   * @param {string} aiSummary - The AI summary of the message (optional)
   * @param {string} source - The source of the lead (optional)
   * @returns {Promise<string>} - The AI-generated reply suggestion
   */
  async generateReply(originalMessage, aiSummary = '', source = '') {
    if (!this.apiKey) {
      console.warn('AI API key not configured. Returning default reply.');
      return 'Thank you for reaching out! We\'ve received your message and will get back to you shortly.';
    }

    if (!originalMessage || originalMessage.trim().length === 0) {
      return 'Thank you for your interest! How can we help you today?';
    }

    try {
      const systemPrompt = `You are a professional customer service representative. Generate a friendly, helpful, and professional reply to customer messages. 
      
Guidelines:
- Be warm and personable
- Address their specific question or concern
- Be concise but informative
- Use a professional yet friendly tone
- End with a clear call-to-action or next step
- Keep replies between 2-4 sentences

Do not include generic salutations like "Dear Customer" - get straight to the point.`;

      let userPrompt = `Generate a professional reply to this customer message:\n\n"${originalMessage}"`;
      
      if (aiSummary) {
        userPrompt += `\n\nContext: ${aiSummary}`;
      }
      
      if (source) {
        userPrompt += `\n\nSource: ${source}`;
      }

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.8,
          max_tokens: 200
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 second timeout
        }
      );

      const reply = response.data.choices[0]?.message?.content?.trim() || '';
      return reply || 'Thank you for your message! We appreciate your interest and will respond as soon as possible.';
      
    } catch (error) {
      console.error('AI Reply Generation Error:', error.response?.data || error.message);
      
      // Return a fallback reply if API fails
      return this.generateFallbackReply(originalMessage);
    }
  }

  /**
   * Generate a fallback reply if AI service fails
   */
  generateFallbackReply(message) {
    // Simple fallback based on message keywords
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('pricing') || lowerMessage.includes('cost')) {
      return 'Thank you for your interest in our pricing! I\'d be happy to provide you with detailed pricing information. Could you please share a bit more about your specific needs or use case?';
    }
    
    if (lowerMessage.includes('demo') || lowerMessage.includes('trial')) {
      return 'Thanks for your interest in trying our product! I\'d love to schedule a demo for you. What times work best for you this week?';
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('issue')) {
      return 'I\'m here to help! Could you please provide a bit more detail about what you\'re experiencing, and I\'ll do my best to assist you right away?';
    }
    
    // Generic fallback
    return 'Thank you for reaching out! I\'ve received your message and will get back to you shortly with a detailed response. Is there anything else I can help you with in the meantime?';
  }

  /**
   * Determine priority based on message content (optional AI enhancement)
   */
  async determinePriority(message) {
    if (!this.apiKey) {
      return 'Medium'; // Default priority
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a lead prioritization assistant. Respond with only one word: High, Medium, or Low.'
            },
            {
              role: 'user',
              content: `Analyze this lead message and determine priority:\n\n${message}`
            }
          ],
          temperature: 0.3,
          max_tokens: 10
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      const priority = response.data.choices[0]?.message?.content?.trim() || 'Medium';
      const normalizedPriority = ['High', 'Medium', 'Low'].includes(priority) 
        ? priority 
        : 'Medium';
      
      return normalizedPriority;
    } catch (error) {
      console.error('Priority determination failed:', error.message);
      return 'Medium';
    }
  }
}

const aiServiceInstance = new AIService();

// Export convenient functions
module.exports = aiServiceInstance;
module.exports.generateAIReply = (originalMessage, aiSummary, source) => {
  return aiServiceInstance.generateReply(originalMessage, aiSummary, source);
};
