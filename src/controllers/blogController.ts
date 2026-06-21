import { NextRequest } from "next/server";
import { BlogPostRepository } from "@/repositories/BlogPostRepository";
import { NotFoundError } from "@/lib/exceptions";
import { sanitizeRichText } from "@/lib/sanitize";

const blogPostRepository = new BlogPostRepository();

export class BlogController {
  async getBlogs(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    return blogPostRepository.findAll(category);
  }

  async getBlogById(req: NextRequest, { params }: { params: { id: string } }) {
    const post = await blogPostRepository.findById(params.id);
    if (!post) {
      throw new NotFoundError("Blog post not found.");
    }
    return post;
  }

  async createBlog(req: NextRequest) {
    const body = await req.json();
    if (body.content) {
      body.content = sanitizeRichText(body.content);
    }
    return blogPostRepository.create(body);
  }

  async updateBlog(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();
    if (body.content) {
      body.content = sanitizeRichText(body.content);
    }
    const updated = await blogPostRepository.update(params.id, body);
    if (!updated) {
      throw new NotFoundError("Blog post not found.");
    }
    return updated;
  }

  async deleteBlog(req: NextRequest, { params }: { params: { id: string } }) {
    const deleted = await blogPostRepository.deleteSoft(params.id);
    if (!deleted) {
      throw new NotFoundError("Blog post not found.");
    }
    return { success: true, message: "Blog post deleted successfully." };
  }
}

export const blogController = new BlogController();
