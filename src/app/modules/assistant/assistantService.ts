import { OpenAI } from "openai";
import { PortfolioData } from "./assistantmodel";
import config from "../../config";

const openai = new OpenAI({
    apiKey: config.openrouter_api_key,
    baseURL: "https://openrouter.ai/api/v1"
});


export const chatWithAi = async (prompt: string, isFirstMessage: boolean = false) => {
    try {
        const searchRegex = new RegExp(prompt.split(' ').join('|'), 'i');
        const contextDocs = await PortfolioData.find({
            content: { $regex: searchRegex }
        }).limit(5);

        const context = contextDocs.map(doc => doc.content).join("\n");
        const bioData = `রাসেল একজন সিনিয়র ফুল-স্ট্যাক ইঞ্জিনিয়ার এবং ক্লাউড আর্কিটেক্ট। তিনি জটিল সিস্টেম ডিজাইন, ডাটাবেস অপ্টিমাইজেশন এবং ক্লাউড-নেটিভ অ্যাপ্লিকেশন তৈরিতে বিশেষজ্ঞ।
তার টেকনিক্যাল ডোমেইনসমূহ:
- অ্যাডভান্সড ডাটাবেস: MongoDB Sharding/Replica Sets, PostgreSQL Indexing, এবং Redis Caching স্ট্র্যাটেজি।
- ক্লাউড ও ইনফ্রাস্ট্রাকচার (AWS): AWS EC2, S3, RDS, Lambda (Serverless), এবং CloudFront CDN-এর মাধ্যমে প্রোডাকশন-রেডি আর্কিটেকচার ডিজাইন।
- কনটেইনারাইজেশন: Docker এবং Kubernetes দিয়ে অ্যাপ্লিকেশন কন্টেইনারাইজেশন ও অর্কেস্ট্রেশন।
- অটোমেশন ও সিকিউরিটি: CI/CD পাইপলাইন (GitHub Actions), সিকিউর এপিআই ডিজাইন, এবং হাই-এভেইলিবিলিটি সিস্টেম ডিজাইন।
- পারফরম্যান্স টিউনিং: অ্যাপ্লিকেশন মেমোরি লিকেজ ডিটেকশন, লোড ব্যালেন্সিং এবং স্কেলেবিলিটি প্ল্যানিং।`;
        const systemPrompt = `
            তুমি রাসেলের ব্যক্তিগত পোর্টফোলিও অ্যাসিস্ট্যান্ট।
            নিয়মাবলী:
            ${isFirstMessage ? '১. কথোপকথনের শুরুতে বলবে: "Hi, I\'m Rasel\'s assistant. আমি আপনাকে কীভাবে সাহায্য করতে পারি?"' : '১. পরিচয় দেওয়ার প্রয়োজন নেই, সরাসরি উত্তর দাও।'}
            ২. তুমি রাসেলের প্রতিনিধি। রাসেলের সম্পর্কে সব উত্তর প্রথম পুরুষে ("আমার") দেবে।
            ৩. নিচের 'তথ্যসমূহ' এবং তোমার সাধারণ জ্ঞান ব্যবহার করে উত্তর দাও।
            ৪. যদি তথ্য না থাকে, বিনয়ের সাথে বলবে: "এই বিষয়টি সম্পর্কে আপাতত আমার কাছে তথ্য নেই, বিস্তারিত জানতে রাসেলের সাথে ইমেইল এ যোগাযোগ করুন।"
            ৫. প্রফেশনাল, বন্ধুসুলভ ও আত্মবিশ্বাসী টোন ব্যবহার করো।

            তথ্যসমূহ:
            ${context ? context : bioData}
        `;

        const response = await openai.chat.completions.create({
            model: "meta-llama/llama-3-8b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        });

        const aiReply = response.choices[0].message.content;

        return {
            success: true,
            message: "AI responded successfully",
            data: { reply: aiReply }
        };
    } catch (error) {
        console.error("AI Error:", error);
        return {
            success: false,
            message: "AI failed to respond",
            data: { reply: "দুঃখিত, সার্ভারে কারিগরি সমস্যা হচ্ছে।" }
        };
    }
};