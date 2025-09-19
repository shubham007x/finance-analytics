import { OpenAI } from 'openai';
import pdf from 'pdf-parse';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Initialize Perplexity API client
const client = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: "https://api.perplexity.ai",
});

class AIParser {
    static async parseDocumentFromBuffer(fileBuffer, fileType) {
        try {
            let textContent = '';

            // Extract text based on file type
            if (fileType === 'pdf') {
                const data = await pdf(fileBuffer);
                textContent = data.text;
            } else if (fileType === 'csv') {
                textContent = await this.parseCsvBufferToText(fileBuffer);
            } else if (fileType === 'txt') {
                textContent = fileBuffer.toString('utf8');
            }

            // Use Perplexity AI to parse transactions
            return await this.parseWithPerplexity(textContent);
        } catch (error) {
            console.error('Error parsing document:', error);
            throw new Error('Failed to parse document');
        }
    }

    static async parseCsvBufferToText(fileBuffer) {
        return new Promise((resolve, reject) => {
            const results = [];
            const stream = Readable.from(fileBuffer);

            stream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    const textContent = results.map(row => Object.values(row).join(' ')).join('\n');
                    resolve(textContent);
                })
                .on('error', reject);
        });
    }

    static async parseWithPerplexity(textContent) {
        const prompt = `
    You are a financial data extraction expert. Analyze the following bank statement text and extract transaction information.

    For each transaction, provide the following in JSON format:
    - date (YYYY-MM-DD format)
    - amount (positive number, without currency symbols)
    - description (cleaned transaction description)
    - merchant (merchant/source name if identifiable)
    - type (expense/income/transfer)
    - category (food/utilities/entertainment/transport/healthcare/shopping/income/transfer/other)

    Bank statement text:
    ${textContent}

    Return only a JSON array of transactions. If no valid transactions are found, return an empty array.
    `;

        try {
            const response = await client.chat.completions.create({
                model: "sonar-pro",
                messages: [
                    { role: "system", content: "You are a financial data extraction expert. Always respond with valid JSON only." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 2000,
            });

            const content = response.choices[0].message.content;
            const jsonMatch = content.match(/\[[\s\S]*\]/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                console.error('No JSON array found in response:', content);
                return [];
            }
        } catch (error) {
            console.error('Error with Perplexity API:', error);
            throw new Error('Failed to parse with AI');
        }
    }

    static categorizeTransaction(description, amount) {
        const desc = description.toLowerCase();

        if (amount > 0) return 'income';

        const categories = {
            food: ['restaurant', 'grocery', 'food', 'cafe', 'pizza', 'mcdonald', 'starbucks'],
            utilities: ['electric', 'gas', 'water', 'internet', 'phone', 'utility'],
            entertainment: ['netflix', 'spotify', 'movie', 'game', 'entertainment'],
            transport: ['uber', 'taxi', 'gas station', 'fuel', 'transport', 'parking'],
            healthcare: ['pharmacy', 'doctor', 'hospital', 'medical', 'health'],
            shopping: ['amazon', 'walmart', 'target', 'shopping', 'store'],
        };

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => desc.includes(keyword))) {
                return category;
            }
        }

        return 'other';
    }
}

export default AIParser;
