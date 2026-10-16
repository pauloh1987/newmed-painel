import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import type { PostListItem } from "@/lib/data/site";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift">
      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-brand-50 to-navy-50">
        {post.cover_url ? (
          <Image src={post.cover_url} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Newspaper className="size-12 text-brand-300" strokeWidth={1.25} aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {post.published_at && (
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-500">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </p>
        )}
        <h3 className="text-lg leading-snug font-bold text-navy-900">
          <Link href={`/blog/${post.slug}`} className="line-clamp-2 after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="line-clamp-3 text-sm leading-relaxed text-navy-600">{post.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2">
          Ler artigo <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
