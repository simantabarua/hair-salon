import { BlogPost, IBlogPost } from "@/models/BlogPost";

export class BlogPostRepository {
  async findById(id: string, includeDeleted = false): Promise<IBlogPost | null> {
    const query: any = { _id: id };
    if (!includeDeleted) {
      query.isDeleted = { $ne: true };
    }
    return BlogPost.findOne(query);
  }

  async findAll(category?: string, includeDeleted = false): Promise<IBlogPost[]> {
    const query: any = {};
    if (!includeDeleted) {
      query.isDeleted = { $ne: true };
    }
    if (category) {
      query.category = category;
    }
    return BlogPost.find(query).sort({ createdAt: -1 });
  }

  async create(postData: Partial<IBlogPost>): Promise<IBlogPost> {
    const post = new BlogPost(postData);
    return post.save();
  }

  async update(id: string, updateData: Partial<IBlogPost>): Promise<IBlogPost | null> {
    return BlogPost.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: updateData },
      { new: true }
    );
  }

  async deleteSoft(id: string): Promise<IBlogPost | null> {
    return BlogPost.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
  }
}
