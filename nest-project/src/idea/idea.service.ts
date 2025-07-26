import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { Idea, IdeaDocument, SectionData } from './entities/idea.entity';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class IdeaService {
  constructor(
    @InjectModel(Idea.name) private readonly ideaModel: Model<IdeaDocument>,
    private readonly geminiService: GeminiService,
  ) {}

  async create(createIdeaDto: CreateIdeaDto): Promise<Idea> {
    const { idea } = createIdeaDto;
    console.log('🚀 Starting website idea generation for:', idea);

    try {
      // Generate 3 sections using Gemini
      console.log('🤖 Attempting to generate sections using Gemini AI...');
      const sectionNames =
        await this.geminiService.generateWebsiteSections(idea);

      // Generate HTML content for all sections in a single Gemini call
      console.log(
        '🎨 Generating HTML content for sections (batched):',
        sectionNames,
      );
      const htmlSections = await this.geminiService.generateAllSectionsHTML(
        idea,
        sectionNames,
      );
      const sections: SectionData[] = sectionNames.map((sectionName, i) => ({
        name: sectionName,
        html: htmlSections[i] || '',
      }));

      const createdIdea = new this.ideaModel({
        idea,
        sections,
      });

      console.log(
        '💾 Saving website idea to database with',
        sections.length,
        'sections',
      );
      return createdIdea.save();
    } catch (error) {
      console.error(
        '💥 Error generating AI content, falling back to manual sections:',
        error,
      );
      // Fallback to manual sections if Gemini fails
      const fallbackSections = this.generateFallbackSections(idea);

      const createdIdea = new this.ideaModel({
        idea,
        sections: fallbackSections,
      });

      return createdIdea.save();
    }
  }

  async findAll(): Promise<Idea[]> {
    return this.ideaModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Idea> {
    const idea = await this.ideaModel.findById(id).exec();
    if (!idea) {
      throw new NotFoundException(`Idea with ID ${id} not found`);
    }
    return idea;
  }

  async update(id: string, updateIdeaDto: UpdateIdeaDto): Promise<Idea> {
    const updatedIdea = await this.ideaModel
      .findByIdAndUpdate(id, updateIdeaDto, { new: true })
      .exec();

    if (!updatedIdea) {
      throw new NotFoundException(`Idea with ID ${id} not found`);
    }
    return updatedIdea;
  }

  async remove(id: string): Promise<void> {
    const result = await this.ideaModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Idea with ID ${id} not found`);
    }
  }

  private generateFallbackSections(idea: string): SectionData[] {
    console.log(
      '🔄 FALLBACK: Generating enhanced static sections for idea:',
      idea,
    );
    const lowerIdea = idea.toLowerCase();
    let sectionNames = ['Hero', 'About', 'Contact'];

    // Customize sections based on the idea content
    if (
      lowerIdea.includes('bakery') ||
      lowerIdea.includes('food') ||
      lowerIdea.includes('restaurant') ||
      lowerIdea.includes('cafe')
    ) {
      sectionNames = ['Hero Banner', 'Menu Highlights', 'Location & Contact'];
    } else if (
      lowerIdea.includes('portfolio') ||
      lowerIdea.includes('developer') ||
      lowerIdea.includes('designer')
    ) {
      sectionNames = ['Hero Introduction', 'Featured Projects', 'Contact Form'];
    } else if (
      lowerIdea.includes('business') ||
      lowerIdea.includes('company') ||
      lowerIdea.includes('corporate')
    ) {
      sectionNames = [
        'Hero Value Proposition',
        'Services Overview',
        'Get In Touch',
      ];
    } else if (
      lowerIdea.includes('blog') ||
      lowerIdea.includes('news') ||
      lowerIdea.includes('magazine')
    ) {
      sectionNames = ['Hero Banner', 'Latest Articles', 'Newsletter Signup'];
    } else if (
      lowerIdea.includes('shop') ||
      lowerIdea.includes('store') ||
      lowerIdea.includes('ecommerce')
    ) {
      sectionNames = ['Hero Banner', 'Featured Products', 'Shopping Cart'];
    }

    // Generate basic HTML for each section
    const sections = sectionNames.slice(0, 3).map((name) => ({
      name,
      html: this.generateBasicHTML(name, idea),
    }));

    console.log(
      '📝 Generated enhanced static sections:',
      sections.map((s) => s.name),
    );
    return sections;
  }

  private generateBasicHTML(sectionName: string, businessIdea: string): string {
    console.log(
      `🎨 FALLBACK: Generating enhanced HTML for section "${sectionName}"`,
    );

    const lowerSection = sectionName.toLowerCase();
    const businessType = this.extractBusinessType(businessIdea);

    if (lowerSection.includes('hero') || lowerSection.includes('banner')) {
      return `
<section class="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-24 px-4 overflow-hidden">
  <div class="absolute inset-0 bg-black bg-opacity-20"></div>
  <div class="relative z-10 max-w-6xl mx-auto text-center">
    <div class="inline-block p-3 bg-white bg-opacity-10 rounded-2xl mb-6">
      <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl"></div>
    </div>
    <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
      Welcome to <span class="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">${businessType}</span>
    </h1>
    <p class="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
      Discover excellence in every detail. We bring innovation and quality to transform your vision into reality.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button class="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition duration-300 shadow-lg">
        Get Started Today
      </button>
      <button class="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition duration-300">
        Learn More
      </button>
    </div>
  </div>
</section>`.trim();
    } else if (
      lowerSection.includes('about') ||
      lowerSection.includes('services') ||
      lowerSection.includes('products')
    ) {
      return `
<section class="py-20 px-4 bg-gray-50">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">${sectionName}</h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        ${businessIdea} - delivering exceptional value through innovation and dedication.
      </p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 flex items-center justify-center">
          <div class="w-8 h-8 bg-white rounded-lg"></div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Quality First</h3>
        <p class="text-gray-600 leading-relaxed">
          We maintain the highest standards in everything we do, ensuring exceptional results that exceed expectations.
        </p>
      </div>
      <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
        <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 flex items-center justify-center">
          <div class="w-8 h-8 bg-white rounded-lg"></div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
        <p class="text-gray-600 leading-relaxed">
          Cutting-edge solutions and creative approaches that push boundaries and deliver remarkable outcomes.
        </p>
      </div>
      <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 flex items-center justify-center">
          <div class="w-8 h-8 bg-white rounded-lg"></div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Customer Focus</h3>
        <p class="text-gray-600 leading-relaxed">
          Your success is our priority. We work closely with you to understand and fulfill your unique needs.
        </p>
      </div>
    </div>
  </div>
</section>`.trim();
    } else if (
      lowerSection.includes('contact') ||
      lowerSection.includes('touch')
    ) {
      return `
<section class="py-20 px-4 bg-white">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get In Touch</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Ready to get started? We'd love to hear from you and discuss how we can help.
      </p>
    </div>
    <div class="grid lg:grid-cols-2 gap-12">
      <div class="space-y-8">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <div class="w-6 h-6 bg-white rounded"></div>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
            <p class="text-gray-600">hello@${businessType.toLowerCase().replace(/\s+/g, '')}.com</p>
          </div>
        </div>
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <div class="w-6 h-6 bg-white rounded"></div>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
            <p class="text-gray-600">+1 (555) 123-4567</p>
          </div>
        </div>
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <div class="w-6 h-6 bg-white rounded"></div>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
            <p class="text-gray-600">123 Business Street<br>City, State 12345</p>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 p-8 rounded-2xl">
        <form class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <input type="text" placeholder="Your Name" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <input type="email" placeholder="Your Email" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
          </div>
          <input type="text" placeholder="Subject" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
          <textarea placeholder="Your Message" rows="4" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"></textarea>
          <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-300 font-semibold">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
</section>`.trim();
    } else {
      return `
<section class="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
  <div class="max-w-6xl mx-auto text-center">
    <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">${sectionName}</h2>
    <p class="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
      This ${sectionName.toLowerCase()} section for ${businessIdea} showcases our commitment to excellence and innovation.
    </p>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <div class="w-8 h-8 bg-white rounded-lg"></div>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
        <p class="text-gray-600">Exceptional standards and attention to detail in every aspect of our work.</p>
      </div>
      <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
        <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <div class="w-8 h-8 bg-white rounded-lg"></div>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
        <p class="text-gray-600">Quick turnaround times without compromising on quality or attention to detail.</p>
      </div>
      <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 md:col-span-2 lg:col-span-1">
        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <div class="w-8 h-8 bg-white rounded-lg"></div>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
        <p class="text-gray-600">Always here when you need us with dedicated customer support and assistance.</p>
      </div>
    </div>
  </div>
</section>`.trim();
    }
  }

  private extractBusinessType(businessIdea: string): string {
    const words = businessIdea.split(' ');
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
