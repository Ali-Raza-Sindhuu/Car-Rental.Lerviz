// components/Blogs.jsx
import { motion } from "framer-motion";
import blogImage1 from '../assets/images/blog_image1.webp';
import blogImage2 from '../assets/images/blog_image2.webp';

const posts = [
  {
    title: "Night Driving Safety: The Importance of Modern LED Headlight Tech",
    date: "May 5, 2026",
    badge: "Safety Tips",
    image:
      blogImage1,
    alt: "Close-up of a dark grey sports car front wheel",
    aspect: "4272 / 2403",
  },
  {
    title: "How Your Credit Score Impacts Your Interest Rate",
    date: "May 5, 2026",
    badge: "Financing",
    image:
      blogImage2,
    alt: "Grey car, autumn road",
    aspect: "3648 / 5472",
  },
];

const BLUR_LAYERS = [
  { blur: 0.12, from: 0, to: 37.5 },
  { blur: 0.23, from: 12.5, to: 50 },
  { blur: 0.47, from: 25, to: 62.5 },
  { blur: 0.94, from: 37.5, to: 75 },
  { blur: 1.88, from: 50, to: 87.5 },
  { blur: 3.75, from: 62.5, to: 100 },
  { blur: 7.5, from: 75, to: 112.5 },
  { blur: 15, from: 87.5, to: 125 },
];

function ProgressiveBlur() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {BLUR_LAYERS.map((layer, i) => {
        const mid1 = layer.from + (layer.to - layer.from) * 0.25;
        const mid2 = layer.from + (layer.to - layer.from) * 0.5;
        const mask = `linear-gradient(to bottom, rgba(0,0,0,0) ${layer.from}%, rgba(0,0,0,1) ${mid1}%, rgba(0,0,0,1) ${mid2}%, rgba(0,0,0,0) ${layer.to}%)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              zIndex: i + 1,
              backdropFilter: `blur(${layer.blur}px)`,
              WebkitBackdropFilter: `blur(${layer.blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}

const wordVariants = {
  hidden: { opacity: 0.001, filter: "blur(10px)", y: 10 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function AnimatedHeading({ text }) {
  const words = text.split(" ");
  return (
    <motion.h2
      className="text-3xl font-medium text-white md:text-4xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
}

function BlogCard({ post }) {
  return (
    <a
      href="#"
      className="group relative block w-full overflow-hidden rounded-2xl bg-black"
      style={{
        border: "2px solid rgba(255,255,255,0.1)",
        aspectRatio: post.aspect,
      }}
    >
      <div className="absolute inset-0 scale-110 transition-transform duration-700 ease-out group-hover:scale-[1.16]">
        <img
          src={post.image}
          alt={post.alt}
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <ProgressiveBlur />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgb(15,15,15) 56%)",
        }}
      />

      <div className="absolute left-5 top-5 z-10 rounded-[4px] bg-white px-2.5 py-1">
        <p className="text-xs font-medium text-black">{post.badge}</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 p-6">
        <p className="text-lg font-medium leading-snug text-white">
          {post.title}
        </p>
        <p className="text-sm text-[rgb(217,217,217)]">{post.date}</p>
      </div>
    </a>
  );
}

export default function Blogs() {
  return (
    <section id="blogs" className="bg-[rgb(15,15,15)] px-6 py-24 md:px-12">
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="mb-12 flex flex-col gap-3">
          <AnimatedHeading text="News and Articles" />
          <motion.p
            className="max-w-[520px] text-base text-[rgb(217,217,217)]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            Insights, stories, and trends from the world of high-end
            automobiles.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.title} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}