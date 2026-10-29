import { ArrowLeft, ArrowRight } from "lucide-react";

// Returns page numbers with "ellipsis" markers, e.g. [1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 12]
const getPageItems = (page, pageCount) => {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) items.push("ellipsis-start");
  for (let number = start; number <= end; number += 1) items.push(number);
  if (end < pageCount - 1) items.push("ellipsis-end");
  items.push(pageCount);

  return items;
};

const arrowButtonClass =
  "inline-flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] disabled:cursor-not-allowed disabled:opacity-40";

const Pagination = ({ page, pageCount, onPageChange }) => {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`${arrowButtonClass} border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100 disabled:hover:bg-white`}
      >
        <ArrowLeft className="size-4" />
      </button>

      <ul className="flex items-center gap-2">
        {getPageItems(page, pageCount).map((item) =>
          typeof item === "string" ? (
            <li
              key={item}
              aria-hidden="true"
              className="flex size-10 items-center justify-center text-xs text-neutral-500"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={`inline-flex size-10 items-center justify-center rounded-full text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] ${
                  item === page
                    ? "bg-[#f05a1a] text-white"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        className={`${arrowButtonClass} border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 disabled:hover:bg-neutral-900`}
      >
        <ArrowRight className="size-4" />
      </button>
    </nav>
  );
};

export default Pagination;