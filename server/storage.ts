import { 
  stories, 
  ideas, 
  contentGenerations, 
  type Story, 
  type InsertStory, 
  type Idea, 
  type InsertIdea,
  type ContentGeneration,
  type InsertContentGeneration
} from "@shared/schema";

export interface IStorage {
  // Story operations
  getStories(): Promise<Story[]>;
  getStory(id: number): Promise<Story | undefined>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, story: Partial<InsertStory>): Promise<Story | undefined>;
  deleteStory(id: number): Promise<boolean>;
  
  // Idea operations
  getIdeasByStory(storyId: number): Promise<Idea[]>;
  getIdea(id: number): Promise<Idea | undefined>;
  createIdea(idea: InsertIdea): Promise<Idea>;
  updateIdea(id: number, idea: Partial<InsertIdea>): Promise<Idea | undefined>;
  deleteIdea(id: number): Promise<boolean>;
  
  // Content generation operations
  getContentGenerationsByStory(storyId: number): Promise<ContentGeneration[]>;
  getContentGeneration(id: number): Promise<ContentGeneration | undefined>;
  createContentGeneration(generation: InsertContentGeneration): Promise<ContentGeneration>;
}

export class MemStorage implements IStorage {
  private stories: Map<number, Story>;
  private ideas: Map<number, Idea>;
  private contentGenerations: Map<number, ContentGeneration>;
  private storyIdCounter: number;
  private ideaIdCounter: number;
  private contentGenerationIdCounter: number;

  constructor() {
    this.stories = new Map();
    this.ideas = new Map();
    this.contentGenerations = new Map();
    this.storyIdCounter = 1;
    this.ideaIdCounter = 1;
    this.contentGenerationIdCounter = 1;
    
    // Initialize with a sample story and ideas
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create a sample story
    const sampleStory: Story = {
      id: this.storyIdCounter++,
      title: "The Chronicles of Avaloria",
      content: "<h2>Chapter 1: The Awakening</h2><p>Dawn broke over the ancient forests of Avaloria, casting long shadows across the misty valleys. The scent of pine and wild herbs filled the air as Lyra made her way through the underbrush.</p><p>She had been traveling for three days now, following the ancient map that her grandmother had left her. According to legend, the Crystal of Eldoria was hidden somewhere in these woods, waiting for one with pure intentions to claim its power.</p><p>The forest grew denser as she ventured deeper, the canopy above blocking out much of the morning light. Strange sounds echoed between the trees – not quite animal, not quite human.</p>",
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 120
    };
    this.stories.set(sampleStory.id, sampleStory);

    // Create sample ideas
    const sampleIdeas: InsertIdea[] = [
      {
        storyId: sampleStory.id,
        category: "Characters",
        name: "Lyra",
        description: "A young alchemist searching for the legendary Crystal of Eldoria to heal her ailing village.",
        isActive: true
      },
      {
        storyId: sampleStory.id,
        category: "Characters",
        name: "Thorne",
        description: "A mysterious tracker with knowledge of the ancient forests and a dark past.",
        isActive: false
      },
      {
        storyId: sampleStory.id,
        category: "Locations",
        name: "Avaloria",
        description: "An ancient realm filled with magical forests, crystalline lakes, and forgotten ruins.",
        isActive: true
      },
      {
        storyId: sampleStory.id,
        category: "Locations",
        name: "The Whispering Caverns",
        description: "A network of underground caves where the walls are said to speak ancient secrets to those who listen.",
        isActive: false
      },
      {
        storyId: sampleStory.id,
        category: "Key Elements",
        name: "Crystal of Eldoria",
        description: "An ancient artifact with the power to heal or destroy, sought by many but found by few.",
        isActive: true
      },
      {
        storyId: sampleStory.id,
        category: "Key Elements",
        name: "The Ethereal Pact",
        description: "An ancient agreement between the mortal world and the realm of spirits that maintains balance in Avaloria.",
        isActive: false
      }
    ];

    for (const idea of sampleIdeas) {
      const newIdea: Idea = {
        ...idea,
        id: this.ideaIdCounter++,
        createdAt: new Date()
      };
      this.ideas.set(newIdea.id, newIdea);
    }
  }

  // Story operations
  async getStories(): Promise<Story[]> {
    return Array.from(this.stories.values());
  }

  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async createStory(story: InsertStory): Promise<Story> {
    const now = new Date();
    const newStory: Story = {
      ...story,
      id: this.storyIdCounter++,
      createdAt: now,
      updatedAt: now
    };
    this.stories.set(newStory.id, newStory);
    return newStory;
  }

  async updateStory(id: number, story: Partial<InsertStory>): Promise<Story | undefined> {
    const existingStory = this.stories.get(id);
    if (!existingStory) return undefined;

    const updatedStory: Story = {
      ...existingStory,
      ...story,
      updatedAt: new Date()
    };
    this.stories.set(id, updatedStory);
    return updatedStory;
  }

  async deleteStory(id: number): Promise<boolean> {
    return this.stories.delete(id);
  }

  // Idea operations
  async getIdeasByStory(storyId: number): Promise<Idea[]> {
    return Array.from(this.ideas.values()).filter(idea => idea.storyId === storyId);
  }

  async getIdea(id: number): Promise<Idea | undefined> {
    return this.ideas.get(id);
  }

  async createIdea(idea: InsertIdea): Promise<Idea> {
    const newIdea: Idea = {
      ...idea,
      id: this.ideaIdCounter++,
      createdAt: new Date()
    };
    this.ideas.set(newIdea.id, newIdea);
    return newIdea;
  }

  async updateIdea(id: number, idea: Partial<InsertIdea>): Promise<Idea | undefined> {
    const existingIdea = this.ideas.get(id);
    if (!existingIdea) return undefined;

    const updatedIdea: Idea = {
      ...existingIdea,
      ...idea
    };
    this.ideas.set(id, updatedIdea);
    return updatedIdea;
  }

  async deleteIdea(id: number): Promise<boolean> {
    return this.ideas.delete(id);
  }

  // Content generation operations
  async getContentGenerationsByStory(storyId: number): Promise<ContentGeneration[]> {
    return Array.from(this.contentGenerations.values())
      .filter(gen => gen.storyId === storyId);
  }

  async getContentGeneration(id: number): Promise<ContentGeneration | undefined> {
    return this.contentGenerations.get(id);
  }

  async createContentGeneration(generation: InsertContentGeneration): Promise<ContentGeneration> {
    const newGeneration: ContentGeneration = {
      ...generation,
      id: this.contentGenerationIdCounter++,
      createdAt: new Date()
    };
    this.contentGenerations.set(newGeneration.id, newGeneration);
    return newGeneration;
  }
}

export const storage = new MemStorage();
