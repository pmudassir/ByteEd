import { Schema, model, Document } from "mongoose";

interface FaqItems extends Document {
    question: string;
    answer: string;
}

interface Category extends Document {
    title: string;
}

interface BannerImage extends Document {
    public_id: string
    url: string;
}

interface Layout extends Document {
    title: string;
    faqItems: FaqItems[];
    categories: Category[];
    banner: {
        image: BannerImage,
        title: string,
        subtitle: string
    }
}

const faqSchema = new Schema<FaqItems>({
    question: { type: String },
    answer: { type: String }
})

const categorySchema = new Schema<Category>({
    title: { type: String }
})

const bannerImageSchema = new Schema<BannerImage>({
    public_id: { type: String },
    url: { type: String }
})

const layoutSchema = new Schema<Layout>({
    title: { type: String },
    faqItems: [faqSchema],
    categories: [categorySchema],
    banner: {
        image: bannerImageSchema,
        title: { type: String },
        subtitle: { type: String }
    }
})

const LayoutModel = model<Layout>('Layout', layoutSchema);
export default LayoutModel