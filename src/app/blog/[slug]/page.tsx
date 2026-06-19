'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  X,
  Search
} from 'lucide-react';
import PageHeading from '@/components/layout/PageHeading';
import { blogPosts, Comment } from '@/data/blogData';

// Recursive Comment Component
interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, authorName: string) => void;
}

function CommentItem({ comment, onReply }: CommentItemProps) {
  return (
    <div className="flex flex-col gap-3 border-l-2 border-primary/20 pl-4 md:pl-6 my-4">
      <div className="flex gap-4 items-start">
        {/* Avatar badge with initials */}
        <div className="w-10 h-10 rounded-full bg-primary/25 border border-primary/45 flex items-center justify-center text-primary font-bold text-sm shrink-0 uppercase font-heading">
          {comment.author.slice(0, 2)}
        </div>
        {/* Details and Message */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h5 className="font-semibold text-white text-sm md:text-base leading-none">{comment.author}</h5>
            <span className="text-xs text-white/40">{comment.date}</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed mb-2 break-words">
            {comment.content}
          </p>
          <button 
            onClick={() => onReply(comment.id, comment.author)}
            className="text-xs text-primary hover:text-primary/75 font-semibold flex items-center gap-1 transition-colors"
          >
            Reply
          </button>
        </div>
      </div>
      
      {/* Render nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col gap-3 mt-2 ml-2 md:ml-4 border-l border-white/5 pl-3">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onReply={onReply} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Retrieve post
  const post = useMemo(() => {
    return blogPosts.find(p => p.slug === slug);
  }, [slug]);

  // Comments state initialized from post comments
  const [comments, setComments] = useState<Comment[]>(() => {
    return post ? post.comments : [];
  });

  // Main Form fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string } | null>(null);

  // Search input in sidebar redirects to /blog
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar elements
  const categories = ['Face', 'Equipment', 'Organic'];
  const allTags = ['Cream', 'Face', 'Blonde', 'Make up', 'Organic', 'Gloss', 'Trends', 'Fashion'];
  
  const recentPosts = useMemo(() => {
    return [...blogPosts]
      .filter(p => p.slug !== slug)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [slug]);

  // Related posts matching category, excluding current post
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogPosts
      .filter(p => p.slug !== slug && p.category === post.category)
      .slice(0, 3);
  }, [post, slug]);

  // Count total comments including recursive replies
  const totalCommentsCount = useMemo(() => {
    const countTotal = (items: Comment[]): number => {
      let count = items.length;
      items.forEach(item => {
        if (item.replies && item.replies.length > 0) {
          count += countTotal(item.replies);
        }
      });
      return count;
    };
    return countTotal(comments);
  }, [comments]);

  // Handle Comment Submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: name,
      email: email,
      avatar: '/images/authors/avatar-default.jpg',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      content: message,
      replies: []
    };

    if (replyTarget) {
      // Find comment with replyTarget.id and append reply
      const appendReply = (list: Comment[]): Comment[] => {
        return list.map(item => {
          if (item.id === replyTarget.id) {
            return {
              ...item,
              replies: [...(item.replies || []), newComment]
            };
          } else if (item.replies && item.replies.length > 0) {
            return {
              ...item,
              replies: appendReply(item.replies)
            };
          }
          return item;
        });
      };
      setComments(prev => appendReply(prev));
      setReplyTarget(null);
    } else {
      // Top-level comment
      setComments(prev => [...prev, newComment]);
    }

    // Reset input fields
    setName('');
    setEmail('');
    setWebsite('');
    setMessage('');
  };

  const handleSidebarSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h2 className="font-cormorant text-4xl text-primary font-bold mb-4">Post Not Found</h2>
        <p className="text-white/60 mb-6 max-w-md">
          The blog article you are looking for does not exist or may have been removed.
        </p>
        <Link href="/blog" className="btn btn-primary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full pb-20 text-white font-manrope">
      {/* Page Heading */}
      <PageHeading 
        title="Blog Details" 
        breadcrumbs={[
          { label: 'Blog', href: '/blog' },
          { label: post.title, href: `/blog/${post.slug}` }
        ]} 
      />

      <section className="w-full max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/75 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <article>
              {/* Feature Image */}
              <div className="relative h-[250px] sm:h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden mb-8 border border-primary/10">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-w-7xl) 100vw, 70vw"
                />
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/50 mb-6 border-b border-primary/10 pb-6">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  By <strong className="text-white">{post.author}</strong>
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {post.readTime}
                </span>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Article Content */}
              <div className="prose prose-invert max-w-none text-white/80 text-base md:text-lg leading-relaxed space-y-6">
                {post.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Blockquote Quote */}
              <blockquote className="my-10 p-6 md:p-8 bg-secondary/30 border-l-4 border-primary rounded-r-2xl relative overflow-hidden">
                <span className="absolute -top-6 -right-6 font-cormorant text-9xl text-primary/10 font-bold select-none leading-none">
                  &ldquo;
                </span>
                <p className="font-cormorant text-xl md:text-2xl italic text-primary font-medium mb-3 relative z-10 leading-snug">
                  &ldquo;{post.quote}&rdquo;
                </p>
                <cite className="text-xs md:text-sm text-white/60 not-italic block font-semibold uppercase tracking-wider relative z-10">
                  — {post.author}
                </cite>
              </blockquote>

              {/* Tags Cloud inside post footer */}
              <div className="flex flex-wrap gap-2 border-t border-b border-primary/10 py-6 my-10">
                <span className="text-sm font-semibold text-white/60 mr-2 flex items-center">Tags:</span>
                {post.tags.map((tag) => (
                  <Link
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    key={tag}
                    className="text-xs bg-white/5 hover:bg-primary hover:text-black border border-primary/15 hover:border-primary text-white/70 px-3.5 py-1.5 rounded-xl transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </article>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 border-b border-primary/10 pb-12">
                <h3 className="font-cormorant text-3xl font-bold mb-8">Related Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {relatedPosts.map((related) => (
                    <Link
                      href={`/blog/${related.slug}`}
                      key={related.slug}
                      className="group flex flex-col bg-secondary/15 border border-primary/5 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-w-7xl) 33vw, 25vw"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <span className="text-[10px] text-primary uppercase font-bold tracking-wider mb-2 block">{related.category}</span>
                        <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {related.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments List Section */}
            <div className="mt-16">
              <div className="flex items-center gap-3 border-b border-primary/10 pb-4 mb-6">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h3 className="font-cormorant text-3xl font-bold">
                  Comments ({totalCommentsCount})
                </h3>
              </div>

              {comments.length === 0 ? (
                <p className="text-white/50 text-sm italic py-4">No comments posted yet. Be the first to share your thoughts!</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem 
                      key={comment.id} 
                      comment={comment} 
                      onReply={(id, name) => setReplyTarget({ id, name })} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Comment Form Section */}
            <div className="mt-16 bg-secondary/20 border border-primary/10 rounded-2xl p-6 md:p-8">
              <h3 className="font-cormorant text-2xl font-bold mb-2">Leave A Comment</h3>
              <p className="text-xs text-white/50 mb-6">
                Your email address will not be published. Required fields are marked *
              </p>

              {/* Reply target indicator */}
              {replyTarget && (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/30 text-primary text-xs px-4 py-2.5 rounded-lg mb-6">
                  <span>Replying to <strong>{replyTarget.name}</strong></span>
                  <button 
                    onClick={() => setReplyTarget(null)}
                    className="p-1 text-primary hover:text-white rounded-full hover:bg-primary/20"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 text-sm bg-black border border-primary/20 focus:border-primary focus:outline-none rounded-xl text-white placeholder-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full px-4 py-3 text-sm bg-black border border-primary/20 focus:border-primary focus:outline-none rounded-xl text-white placeholder-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 text-sm bg-black border border-primary/20 focus:border-primary focus:outline-none rounded-xl text-white placeholder-white/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                    Comment *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts here..."
                    className="w-full px-4 py-3 text-sm bg-black border border-primary/20 focus:border-primary focus:outline-none rounded-xl text-white placeholder-white/20 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2 font-bold cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {replyTarget ? 'Submit Reply' : 'Post Comment'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-80 space-y-8 shrink-0">
            {/* Search Widget */}
            <div className="bg-secondary/40 border border-primary/10 rounded-2xl p-6">
              <h4 className="font-cormorant text-xl font-bold mb-4 border-b border-primary/20 pb-2">Search Articles</h4>
              <form onSubmit={handleSidebarSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search here..."
                  className="w-full pl-4 pr-10 py-3 text-sm bg-black border border-primary/20 focus:border-primary focus:outline-none rounded-xl text-white placeholder-white/40"
                />
                <button type="submit" className="absolute right-3.5 p-1 hover:text-primary transition-colors text-primary">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Categories Widget */}
            <div className="bg-secondary/40 border border-primary/10 rounded-2xl p-6">
              <h4 className="font-cormorant text-xl font-bold mb-4 border-b border-primary/20 pb-2">Categories</h4>
              <ul className="space-y-2">
                {categories.map((cat) => {
                  const count = blogPosts.filter(p => p.category === cat).length;
                  return (
                    <li key={cat}>
                      <Link
                        href={`/blog?category=${encodeURIComponent(cat)}`}
                        className="w-full flex items-center justify-between text-sm py-2 px-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span>{cat}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/55">
                          {count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-secondary/40 border border-primary/10 rounded-2xl p-6">
              <h4 className="font-cormorant text-xl font-bold mb-4 border-b border-primary/20 pb-2">Recent Posts</h4>
              <div className="space-y-4">
                {recentPosts.map((rPost) => (
                  <Link 
                    href={`/blog/${rPost.slug}`} 
                    key={rPost.slug} 
                    className="flex gap-4 group items-center animate-fade-in"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={rPost.image}
                        alt={rPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-primary uppercase font-semibold mb-1 tracking-wider">{rPost.category}</p>
                      <h5 className="text-sm font-medium text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {rPost.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags Widget */}
            <div className="bg-secondary/40 border border-primary/10 rounded-2xl p-6">
              <h4 className="font-cormorant text-xl font-bold mb-4 border-b border-primary/20 pb-2">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Link
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    key={tag}
                    className="text-xs px-3.5 py-2 rounded-xl transition-all border bg-black border-primary/20 text-white/70 hover:border-primary hover:text-white"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
