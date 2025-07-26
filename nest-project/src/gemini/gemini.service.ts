import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');
  }

  async generateWebsiteSections(idea: string): Promise<string[]> {
    const startTime = Date.now();
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512, // Reduced for faster response
        },
      });

      const prompt = `For a website idea: "${idea}"

Generate exactly 3 relevant section names that would be appropriate for this website.
Return only the section names, one per line, no numbers or bullets.
Make them specific to the business/idea type.

Examples:
- For a bakery: "Hero Banner", "Fresh Products", "Contact & Location"
- For a portfolio: "About Me", "Featured Projects", "Get In Touch"
- For a business: "Hero Section", "Our Services", "Contact Us"

Website idea: ${idea}

Return exactly 3 section names:`;

      // Add timeout for faster fallback
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout (6s)')), 6000),
      );

      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise,
      ]);

      const response = (result as any).response;
      const text = response.text();

      const sections = text
        .trim()
        .split('\n')
        .map((section) => section.trim())
        .filter((section) => section.length > 0)
        .slice(0, 3);

      if (sections.length === 3) {
        const duration = Date.now() - startTime;
        console.log(
          `✅ GEMINI: Successfully generated section names in ${duration}ms:`,
          sections,
        );
        return sections;
      } else {
        console.log(
          '⚠️ FALLBACK: Gemini returned invalid sections, using fallback',
        );
        return this.getFallbackSections(idea);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `❌ FALLBACK: Gemini API error after ${duration}ms, using fallback sections:`,
        error.message,
      );
      return this.getFallbackSections(idea);
    }
  }

  async generateSectionHTML(
    sectionName: string,
    idea: string,
  ): Promise<string> {
    const startTime = Date.now();
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024, // Reduced for faster response
        },
      });

      const prompt = `Create a modern, responsive HTML section for:
Section: "${sectionName}"
Website Idea: "${idea}"

Requirements:
- Use Tailwind CSS classes only
- Make it modern and professional
- Include realistic content specific to the business
- Use semantic HTML
- Make it responsive
- Don't include <html>, <head>, or <body> tags - just the section content
- You CAN use real images from these FREE services:
  * Unsplash: https://images.unsplash.com/photo-[id]?w=800&q=80 (use relevant search terms)
  * Picsum: https://picsum.photos/800/600 (random images)
  * For business: https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80
  * For food/bakery: https://images.unsplash.com/photo-1555507036-ab794f0143a4?w=800&q=80
  * For tech/portfolio: https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80
- Use proper alt text for accessibility
- Combine images with gradients and modern design
- Return only the HTML, no explanations

Generate the HTML:`;

      // Add timeout for faster fallback
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout (8s)')), 8000),
      );

      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise,
      ]);

      const response = (result as any).response;
      const html = response.text();

      // Clean up the response to remove any markdown formatting
      const cleanHtml = html
        .replace(/```html/g, '')
        .replace(/```/g, '')
        .trim();

      if (cleanHtml && cleanHtml.length > 50) {
        const duration = Date.now() - startTime;
        console.log(
          `✅ GEMINI: Successfully generated HTML for section "${sectionName}" in ${duration}ms`,
        );
        return cleanHtml;
      } else {
        console.log(
          `⚠️ FALLBACK: Gemini returned invalid HTML for "${sectionName}", using fallback`,
        );
        return this.getFallbackHTML(sectionName, idea);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `❌ FALLBACK: Gemini API error for HTML generation (${sectionName}) after ${duration}ms:`,
        error.message,
      );
      return this.getFallbackHTML(sectionName, idea);
    }
  }

  /**
   * Generates HTML for all website sections in a single Gemini call for performance and cost efficiency.
   * Falls back to per-section or static HTML if needed.
   */
  async generateAllSectionsHTML(
    idea: string,
    sectionNames: string[],
  ): Promise<string[]> {
    const startTime = Date.now();
    try {
      // Fetch Unsplash image URLs for each section
      const imageUrls = await Promise.all(
        sectionNames.map((sectionName) =>
          this.fetchUnsplashImageUrl(`${idea} ${sectionName}`),
        ),
      );

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3072, // Allow more tokens for all sections
        },
      });

      const prompt = `For the website idea: "${idea}"

Generate modern, beautiful, visually rich HTML for the following sections, using normal CSS styles (not Tailwind CSS). For every section:
- Use a light background (e.g., #fff, #f8fafc, #f3f4f6, or gradients with light tones)
- Use black or dark text for all text (no white text)
- Use the provided Unsplash image URL for that section (do NOT use random or broken images)
- Use modern design: cards, rounded corners, subtle shadows, generous spacing, gradients, and visually appealing layouts
- Use icons (SVG or emoji) for features, actions, and highlights (e.g., next to titles, in feature lists, in buttons, etc.)
- Use badges, buttons, feature grids, call-to-action, and creative overlays where appropriate
- Add subtle animations (hover, transitions) for interactivity
- Make the design creative, beautiful, and professional—not just basic blocks
- Use semantic HTML
- Make it responsive (use media queries)
- Use proper alt text for accessibility
- Combine images with gradients and modern design
- Return only the HTML for each section, in the same order, separated by a unique delimiter: \n---SECTION---\n. Do not include <html>, <head>, or <body> tags. No explanations.

Sections and images:
${sectionNames.map((name, i) => `${i + 1}. ${name}\nImage: ${imageUrls[i] || 'none'}`).join('\n\n')}

Return the HTML for each section, separated by \n---SECTION---\n`;

      // Add timeout for faster fallback
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout (16s)')), 16000),
      );

      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise,
      ]);

      const response = (result as any).response;
      const text = response.text();

      // Split by delimiter and clean up each section
      const htmlSections = text
        .split(/\n---SECTION---\n/)
        .map((html) =>
          html
            .replace(/```html/g, '')
            .replace(/```/g, '')
            .trim(),
        )
        .filter((html) => html.length > 50);

      if (htmlSections.length === sectionNames.length) {
        const duration = Date.now() - startTime;
        console.log(
          `✅ GEMINI: Successfully generated all section HTML in ${duration}ms`,
        );
        return htmlSections;
      } else {
        console.log(
          `⚠️ FALLBACK: Gemini returned invalid HTML sections, using per-section fallback`,
        );
        // Fallback: try per-section generation
        const fallbackHtmls = await Promise.all(
          sectionNames.map((name) => this.generateSectionHTML(name, idea)),
        );
        return fallbackHtmls;
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `❌ FALLBACK: Gemini API error for all-sections HTML after ${duration}ms:`,
        error.message,
      );
      // Fallback: try per-section generation
      const fallbackHtmls = await Promise.all(
        sectionNames.map((name) => this.generateSectionHTML(name, idea)),
      );
      return fallbackHtmls;
    }
  }

  private getFallbackSections(idea: string): string[] {
    console.log(
      '🔄 FALLBACK: Using fallback section generation for idea:',
      idea,
    );
    const lowerIdea = idea.toLowerCase();

    if (
      lowerIdea.includes('bakery') ||
      lowerIdea.includes('food') ||
      lowerIdea.includes('restaurant')
    ) {
      return ['Hero Banner', 'Fresh Products', 'Contact & Location'];
    } else if (
      lowerIdea.includes('portfolio') ||
      lowerIdea.includes('developer') ||
      lowerIdea.includes('designer')
    ) {
      return ['About Me', 'Featured Projects', 'Get In Touch'];
    } else if (
      lowerIdea.includes('business') ||
      lowerIdea.includes('company') ||
      lowerIdea.includes('corporate')
    ) {
      return ['Hero Section', 'Our Services', 'Contact Us'];
    } else if (lowerIdea.includes('blog') || lowerIdea.includes('news')) {
      return ['Hero Banner', 'Latest Articles', 'Newsletter'];
    } else if (
      lowerIdea.includes('shop') ||
      lowerIdea.includes('store') ||
      lowerIdea.includes('ecommerce')
    ) {
      return ['Hero Banner', 'Featured Products', 'Shopping Info'];
    }

    return ['Hero Section', 'About', 'Contact'];
  }

  private getFallbackHTML(sectionName: string, idea: string): string {
    console.log(
      `🔄 FALLBACK: Using fallback HTML generation for section "${sectionName}"`,
    );
    const lowerSection = sectionName.toLowerCase();
    const businessType = this.extractBusinessType(idea);

    if (lowerSection.includes('hero') || lowerSection.includes('banner')) {
      return `
<section class="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 overflow-hidden">
  <div class="absolute inset-0 opacity-20">
    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80" 
         alt="Modern office background" 
         class="w-full h-full object-cover">
  </div>
  <div class="relative z-10 max-w-6xl mx-auto text-center">
    <h1 class="text-5xl font-bold mb-6">Welcome to ${businessType}</h1>
    <p class="text-xl mb-8 opacity-90">Discover what makes us special and how we can help you achieve your goals.</p>
    <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg">
      Get Started
    </button>
  </div>
</section>`.trim();
    } else if (lowerSection.includes('about') || lowerSection.includes('me')) {
      return `
<section class="py-16 px-4 bg-gray-50">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold text-gray-900 mb-8 text-center">About ${businessType}</h2>
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p class="text-lg text-gray-600 mb-6">
          We are passionate about delivering exceptional quality and service. Our team is dedicated to 
          providing innovative solutions that exceed expectations.
        </p>
        <p class="text-lg text-gray-600">
          With years of experience in the industry, we bring expertise and creativity to every project we undertake.
        </p>
        <div class="flex space-x-4 mt-8">
          <div class="flex-1 p-4 bg-blue-100 rounded-lg">
            <div class="w-8 h-8 bg-blue-600 rounded-full mb-2"></div>
            <h4 class="font-semibold text-gray-800">Quality</h4>
            <p class="text-sm text-gray-600">Premium standards</p>
          </div>
          <div class="flex-1 p-4 bg-purple-100 rounded-lg">
            <div class="w-8 h-8 bg-purple-600 rounded-full mb-2"></div>
            <h4 class="font-semibold text-gray-800">Innovation</h4>
            <p class="text-sm text-gray-600">Creative solutions</p>
          </div>
        </div>
      </div>
      <div class="relative overflow-hidden rounded-2xl">
        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80" 
             alt="${businessType} team working" 
             class="w-full h-80 object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-blue-600 to-transparent opacity-80"></div>
        <div class="absolute bottom-6 left-6 text-white">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl mb-3 flex items-center justify-center">
            <div class="w-6 h-6 bg-white rounded-lg"></div>
          </div>
          <h3 class="text-xl font-bold">Our Vision</h3>
          <p class="text-sm opacity-90">Excellence in everything</p>
        </div>
      </div>
    </div>
  </div>
</section>`.trim();
    } else if (
      lowerSection.includes('contact') ||
      lowerSection.includes('touch')
    ) {
      return `
<section class="py-16 px-4 bg-white">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold text-gray-900 mb-8 text-center">Get In Touch</h2>
    <div class="grid md:grid-cols-2 gap-12">
      <div>
        <div class="relative overflow-hidden rounded-xl mb-6">
          <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80" 
               alt="Contact us - modern office" 
               class="w-full h-48 object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
          <div class="absolute bottom-4 left-4 text-white">
            <h3 class="text-lg font-semibold">Ready to Connect?</h3>
            <p class="text-sm opacity-90">We'd love to hear from you</p>
          </div>
        </div>
        <h3 class="text-2xl font-semibold mb-4">Contact Information</h3>
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="w-6 h-6 bg-blue-600 rounded-full mr-3"></div>
            <span class="text-gray-600">hello@${businessType.toLowerCase().replace(/\s+/g, '')}.com</span>
          </div>
          <div class="flex items-center">
            <div class="w-6 h-6 bg-blue-600 rounded-full mr-3"></div>
            <span class="text-gray-600">+1 (555) 123-4567</span>
          </div>
          <div class="flex items-center">
            <div class="w-6 h-6 bg-blue-600 rounded-full mr-3"></div>
            <span class="text-gray-600">123 Business Street, City, State 12345</span>
          </div>
        </div>
      </div>
      <div>
        <form class="space-y-4">
          <input type="text" placeholder="Your Name" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
          <input type="email" placeholder="Your Email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
          <textarea placeholder="Your Message" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"></textarea>
          <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>`.trim();
    } else {
      return `
<section class="py-16 px-4 bg-white">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-4xl font-bold text-gray-900 mb-6">${sectionName}</h2>
    <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
      This ${sectionName.toLowerCase()} section for ${idea} will showcase relevant content and features.
    </p>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-shadow">
        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&q=80" 
             alt="Analytics and insights" 
             class="w-16 h-16 object-cover rounded-2xl mx-auto mb-4">
        <h3 class="text-xl font-semibold mb-2 text-gray-800">Feature One</h3>
        <p class="text-gray-600">Description of the first key feature or benefit that adds value.</p>
      </div>
      <div class="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-shadow">
        <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&q=80" 
             alt="Innovation and technology" 
             class="w-16 h-16 object-cover rounded-2xl mx-auto mb-4">
        <h3 class="text-xl font-semibold mb-2 text-gray-800">Feature Two</h3>
        <p class="text-gray-600">Description of the second key feature or benefit that stands out.</p>
      </div>
      <div class="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-shadow">
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&q=80" 
             alt="Teamwork and collaboration" 
             class="w-16 h-16 object-cover rounded-2xl mx-auto mb-4">
        <h3 class="text-xl font-semibold mb-2 text-gray-800">Feature Three</h3>
        <p class="text-gray-600">Description of the third key feature or benefit that completes the offer.</p>
      </div>
    </div>
  </div>
</section>`.trim();
    }
  }

  /**
   * Fetch a relevant Unsplash image URL for a given keyword (idea + section name) using fetch.
   */
  async fetchUnsplashImageUrl(keywords: string): Promise<string | null> {
    const accessKey = this.configService.get<string>('UNSPLASH_ACCESS_KEY');
    if (!accessKey) {
      console.warn('UNSPLASH_ACCESS_KEY not found in environment variables');
      return null;
    }
    try {
      const query = encodeURIComponent(keywords);
      const url = `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1&client_id=${accessKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);
      const data = await res.json();
      const results = data.results;
      if (results && results.length > 0) {
        return results[0].urls.regular;
      }
      return null;
    } catch (err: any) {
      console.error('Error fetching Unsplash image:', err.message);
      return null;
    }
  }

  private extractBusinessType(idea: string): string {
    const words = idea.split(' ');
    const businessWords = words.filter(
      (word) =>
        ![
          'a',
          'an',
          'the',
          'for',
          'of',
          'in',
          'on',
          'at',
          'by',
          'with',
          'landing',
          'page',
          'website',
        ].includes(word.toLowerCase()),
    );

    if (businessWords.length > 0) {
      return businessWords
        .slice(0, 2)
        .join(' ')
        .replace(/^\w/, (c) => c.toUpperCase());
    }

    return 'Our Business';
  }
}
