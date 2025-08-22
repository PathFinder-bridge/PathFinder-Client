import type {NextApiRequest, NextApiResponse} from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type ResponseData = {
    answer?: string;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method Not Allowed'});
    }

    try {
        const {prompt} = req.body;

        if (!prompt) {
            return res.status(400).json({error: 'Prompt is required'});
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: prompt}],
            temperature: 0.7,
        });

        const answer = response.choices[0].message.content;

        if (!answer) {
            return res.status(500).json({error: 'AI로부터 응답을 받을 수 없습니다.'});
        }

        res.status(200).json({answer});

    } catch (error) {
        console.error('API Route Error:', error);
        res.status(500).json({error: 'Failed to fetch response from OpenAI'});
    }
}
