import { Request, Response } from 'express';
import { Url } from '../models/url.model';
import { urlSchema } from '../validations/url.validations'
import { generateShortCode } from '../utils/generateShortCode';
import { redis } from '../config/redis';

export const createShortUrl = async (req: Request, res: Response) => {
    try {
        const parsed = urlSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.issues[0].message });
        }

        const { originalUrl } = parsed.data;
        
        const shortCode = generateShortCode();
        const userId = (req as any).user ? (req as any).user.id : null;
        
        const createdUrl = await Url.create({
            originalUrl,
            shortCode,
            clicks: 0,
            userId: userId
        })
        await redis.set(shortCode,originalUrl);

        return res.status(200).json({
            message: "Short URL created successfully",
            shortUrl: `${shortCode}`,
            data: createdUrl
        })
    } catch (error) {
        res.status(500).json({ message: "Url is invalid", error });
    }
}

export const redirect = async (req: Request, res: Response) => {
    try {
        const shortCode = req.params.shortCode as string;
        const cachedUrl = await redis.get(shortCode);

        if(cachedUrl){
            return res.redirect(cachedUrl);
        }
        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ message: "Short url not found" })
        }

        await redis.set(shortCode,url.originalUrl);

        url.clicks += 1;
        await url.save();

        return res.redirect(url.originalUrl);
    } catch (error) {
        res.status(500).json({ message: "Server error", error })
    }
}

export const getAllUrls = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if(!user){
            return res.status(200).json({data:[]});
        }
        const allUrls = await Url.find({ userId: user.id }).sort({ createdAt: -1 });

        return res.status(200).json({
            data: allUrls
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        })
    }
}