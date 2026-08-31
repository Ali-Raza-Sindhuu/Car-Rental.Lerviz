// src/pages/Inventory.jsx
import { Link } from "react-router-dom";
import { Gauge, Cog, Calendar } from "lucide-react";

const CARS = [
  {
    name: "Lamborghini Huracán",
    slug: "lamborghini-huracan",
    image: "https://framerusercontent.com/images/2qaOY29IxvV9sFJrKBsLiQXaSw.jpg",
    alt: "White supercar on concrete",
    speed: "325 km/h",
    transmission: "Automatic",
    year: "2023",
  },
];

function CarCard({ name, slug, image, alt, speed, transmission, year }) {
  return (
    <Link
      to={`/inventory/${slug}`}
      className="relative flex h-80 w-full flex-col overflow-hidden rounded-2xl bg-[#0f0f0f] opacity-100"
    >
      {/* Blurred full-bleed background */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          filter: "blur(4px)",
          opacity: 1,
        }}
      >
        <div
          className="absolute"
          style={{
            inset: "-25% 0%",
            width: "100%",
            height: "150%",
            backgroundImage: `url("${image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            borderRadius: 0,
            willChange: "transform",
            backfaceVisibility: "hidden",
            userSelect: "none",
            pointerEvents: "none",
            transform: "translate3d(0px, -31.1484px, 0px)",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgb(0, 0, 0) 0%, rgba(31, 31, 31, 0.5) 47.2972972972973%, rgb(0, 0, 0) 100%)",
          opacity: 0.4,
        }}
      />

      {/* Bordered image container */}
      <div
        className="absolute inset-0 m-4 overflow-hidden rounded-2xl"
        style={{
          borderWidth: 3,
          borderStyle: "solid",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 16,
          boxShadow: "0px 0px 24px 4px rgba(0, 0, 0, 0)",
          opacity: 1,
        }}
      >
        {/* Image wrapper */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: 16,
          }}
        >
          <img
            decoding="auto"
            loading="lazy"
            width={3899}
            height={4702}
            sizes="726px"
            srcSet={`
              ${image}?scale-down-to=1024&width=3899&height=4702 849w,
              ${image}?scale-down-to=2048&width=3899&height=4702 1698w,
              ${image}?scale-down-to=4096&width=3899&height=4702 3396w,
              ${image}?width=3899&height=4702 3899w
            `}
            src={`${image}?width=3899&height=4702`}
            alt={alt}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              borderRadius: 16,
              objectPosition: "center center",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Content: flex-col, centered */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-6"
          style={{
            opacity: 1,
          }}
        >
          <div
            className="flex flex-col items-center"
            style={{
              opacity: 1,
            }}
          >
            {/* Title */}
            <h2
              className="mb-4 text-center text-2xl font-semibold"
              style={{
                textAlign: "center",
                color: "rgb(255, 255, 255)",
              }}
            >
              {name}
            </h2>

            {/* Specs row */}
            <div
              className="flex items-center justify-center gap-6"
              style={{
                opacity: 1,
              }}
            >
              {/* Speed */}
              <div
                className="flex items-center gap-2"
                style={{
                  opacity: 1,
                }}
              >
                <Gauge
                  className="h-5 w-5"
                  style={{
                    color: "rgb(217, 217, 217)",
                    strokeWidth: 2,
                  }}
                  role="presentation"
                />
                <p
                  className="text-sm"
                  style={{
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  {speed}
                </p>
              </div>

              {/* Transmission */}
              <div
                className="flex items-center gap-2"
                style={{
                  opacity: 1,
                }}
              >
                <Cog
                  className="h-5 w-5"
                  style={{
                    color: "rgb(217, 217, 217)",
                    strokeWidth: 2,
                  }}
                  role="presentation"
                />
                <p
                  className="text-sm"
                  style={{
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  {transmission}
                </p>
              </div>

              {/* Year */}
              <div
                className="flex items-center gap-2"
                style={{
                  opacity: 1,
                }}
              >
                <Calendar
                  className="h-5 w-5"
                  style={{
                    color: "rgb(217, 217, 217)",
                    strokeWidth: 1.5,
                  }}
                  role="presentation"
                />
                <p
                  className="text-sm"
                  style={{
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  {year}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inner dark overlay */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundColor: "rgb(15, 15, 15)",
            opacity: 0.5,
          }}
        />
      </div>
    </Link>
  );
}

function Inventory() {
  const lamborghiniEntries = Array.from({ length: 3 }, (_, i) => ({
    ...CARS[0],
  }));

  return (
    <section className="relative flex w-full flex-col bg-black px-0 py-20 md:py-28">
      <div className="flex w-full flex-col gap-6 md:gap-8">
        {/* One card per row, full screen width */}
        {lamborghiniEntries.map((car, index) => (
          <div key={`${car.slug}-${index}`} className="w-full px-6 md:px-12 lg:px-16">
            <CarCard {...car} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Inventory;