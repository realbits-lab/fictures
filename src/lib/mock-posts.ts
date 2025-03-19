import { Post } from './supabase';

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Basic Text Post with Markdown',
    content: `
# Welcome to My First Post!

This is a simple text post that demonstrates basic markdown features:

- **Bold text** for emphasis
- *Italic text* for style
- ~~Strikethrough~~ for corrections

> This is a blockquote for important messages

1. Ordered lists work too
2. Just like this
3. And this

\`\`\`typescript
// Even code blocks work!
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
    `,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    user_id: '31b78f13-bb9f-44bc-96b5-21dae295d537'
  },
  {
    id: '2',
    title: 'Image Gallery Post',
    content: `
# Beautiful Nature Photography

Here's a collection of stunning nature images:

![Mountain Landscape](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800)

![Ocean Sunset](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800)

![Forest Path](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800)

*All images are from Unsplash, the free image repository.*
    `,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    user_id: '31b78f13-bb9f-44bc-96b5-21dae295d537'
  },
  {
    id: '3',
    title: 'YouTube Video Embed',
    content: `
# Interesting YouTube Video

Here's a fascinating video about nature:

<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>

## Video Description

This video showcases the beauty of our natural world. Watch in HD for the best experience!
    `,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    user_id: '31b78f13-bb9f-44bc-96b5-21dae295d537'
  },
  {
    id: '4',
    title: 'Audio Post - Podcast Episode',
    content: `
# Latest Podcast Episode

Listen to our latest episode:

<audio controls>
  <source src="https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav" type="audio/wav">
  Your browser does not support the audio element.
</audio>

## Episode Notes

1. Introduction (0:00)
2. Main Topic (2:30)
3. Q&A Session (15:45)
4. Closing Thoughts (28:15)
    `,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    user_id: '31b78f13-bb9f-44bc-96b5-21dae295d537'
  },
  {
    id: '5',
    title: 'Recipe with Tables',
    content: `
# Delicious Chocolate Cake Recipe

## Ingredients

| Ingredient | Amount | Notes |
|------------|--------|-------|
| Flour | 2 cups | All-purpose |
| Sugar | 1.5 cups | Granulated |
| Cocoa | 3/4 cup | Unsweetened |
| Eggs | 2 large | Room temperature |
| Milk | 1 cup | Whole milk preferred |

## Instructions

1. Preheat oven to 350°F
2. Mix dry ingredients
3. Add wet ingredients
4. Bake for 30 minutes

![Chocolate Cake](https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800)
    `,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
    user_id: '31b78f13-bb9f-44bc-96b5-21dae295d537'
  },
  {
    id: '6',
    title: 'Mixed Media Post',
    content: `
# A Day in the Life

## Morning Views
![Sunrise](https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800)

## Afternoon Music
<audio controls>
  <source src="https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav" type="audio/wav">
</audio>

## Evening Entertainment
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  allowfullscreen>
</iframe>
    `,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    user_id: '31b78f13-bb9f-44bc-96b5-21dae295d537'
  },
  {
    id: '7',
    title: 'Technical Documentation',
    content: `
# API Documentation

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string): Promise<User> {
  // Implementation
}
\`\`\`

## Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Bad Request | Check input parameters |
| 401 | Unauthorized | Refresh token |
| 404 | Not Found | Verify resource exists |

> Note: Always check the response status before processing data.
    `,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    user_id: '31b78f13-bb9f-44bc-96b5-21dae295d537'
  },
  {
    id: '8',
    title: 'Travel Blog Post',
    content: `
# Journey Through Japan 🗾

## Tokyo Nights
![Tokyo](https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800)

## Kyoto Temples
![Kyoto](https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800)

## Travel Tips

- 🎌 Learn basic Japanese phrases
- 🚅 Get a JR Pass
- 📱 Download offline maps
- 🏮 Try local street food

### Useful Japanese Phrases

| English | Japanese | Pronunciation |
|---------|----------|---------------|
| Hello | こんにちは | Konnichiwa |
| Thank you | ありがとう | Arigatou |
| Excuse me | すみません | Sumimasen |
    `,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    user_id: '31b78f13-bb9f-44bc-96b5-21dae295d537'
  },
  {
    id: '9',
    title: 'Music Album Review',
    content: `
# Album Review: Classical Masterpieces

## Sample Tracks

### Mozart - Eine Kleine Nachtmusik
<audio controls>
  <source src="https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav" type="audio/wav">
</audio>

### Bach - Air on G String
<audio controls>
  <source src="https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav" type="audio/wav">
</audio>

## Rating

⭐⭐⭐⭐⭐ (5/5 stars)

## Highlights

1. Exceptional recording quality
2. Perfect performance
3. Great value for money

![Orchestra](https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800)
    `,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    user_id: '31b78f13-bb9f-44bc-96b5-21dae295d537'
  },
  {
    id: '10',
    title: 'Interactive Tutorial',
    content: `
# Learn Web Development

## HTML Basics

\`\`\`html
<div class="container">
  <h1>Hello World</h1>
  <p>This is a paragraph</p>
</div>
\`\`\`

## CSS Styling

\`\`\`css
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
\`\`\`

## Demo Video
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  allowfullscreen>
</iframe>

## Practice Exercise

Create a simple webpage using the code above. Here's what it should look like:

![Web Page](https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800)
    `,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    user_id: '31b78f13-bb9f-44bc-96b5-21dae295d537'
  }
]; 