import { Link } from 'react-router-dom'
import { Reveal, RevealWords } from './Reveal'
import { blogs } from '../data/dummyData'

export default function BlogsPreview() {
  return (
    <section id="blogs" className="py-20 px-5">
      <div className="max-w-[1380px] mx-auto">
        <div className="max-w-2xl mb-12">
          <RevealWords
            as="h2"
            text="News and Articles"
            className="font-display text-2xl md:text-4xl font-semibold tracking-wide2 mb-4"
          />
          <Reveal delay={0.1}>
            <p className="text-mist text-base md:text-lg">
              Insights, stories, and trends from the world of high-end
              automobiles.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {blogs.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.1}>
              <Link
                to={`/blogs/${post.slug}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[16/10] card-border"
              >
                <img
                  src={`https://placehold.co/900x560/141414/2a2a2a?text=${encodeURIComponent(
                    post.badge
                  )}`}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/40 to-transparent" />
                <span className="absolute top-5 right-5 bg-white text-ink text-xs font-medium px-3 py-1.5 rounded">
                  {post.badge}
                </span>
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <h4 className="font-medium text-lg leading-snug mb-2 max-w-md">
                    {post.title}
                  </h4>
                  <p className="text-mist text-sm">{post.date}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
