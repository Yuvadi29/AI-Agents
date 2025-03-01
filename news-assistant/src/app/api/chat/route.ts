import { NextResponse } from "next/server";
import Parser from "rss-parser";
import Groq from "groq-sdk";


const parser = new Parser();
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

const groq = new Groq({
    apiKey: GROQ_API_KEY,
});

// Function to fetch latest news from an RSS feed
export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        let articles: any[] = [];

        // If user asks for latest news, fetch it
        if (message.toLowerCase().includes("latest news")) {
            const feed = await parser.parseURL("https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml");
            articles = feed.items.slice(0, 3);
        }

        // Construct AI prompt
        let prompt = `User: ${message}\nAI:`;
        if (articles.length > 0) {
            prompt += "\nHere are the top news articles:\n" +
                articles.map((a, i) => `${i + 1}. ${a.title} - ${a.link}`).join("\n");
        }

        // Call Groq Cloud API 
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                },
            ],
            model: "llama3-8b-8192",
            temperature: 0.7,
        });

        return NextResponse.json({ reply: response?.choices[0]?.message?.content });
    } catch (error) {
        console.error("Error fetching news: ", error);
        return NextResponse.json({
            error: 'Failed to Fetch News',
            status: 500
        });
    }
}
