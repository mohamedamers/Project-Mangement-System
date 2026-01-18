import styles from "./PaginationBar.module.css";
import { useMode } from "../../../../../Context/ModeContext";

type PaginationBarProps = {
  totalResults: number;
  pageNumber: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export default function PaginationBar({
  totalResults,
  pageNumber,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const canPrev = pageNumber > 1;
  const canNext = pageNumber < totalPages;

  const handlePrev = () => {
    if (canPrev) onPageChange(pageNumber - 1);
  };

  const handleNext = () => {
    if (canNext) onPageChange(pageNumber + 1);
  };

  const { darkMode } = useMode();

  return (
    <>
      <style>{`
        /* Tablet - Medium screens */
        @media (max-width: 992px) {
          .${styles.bar} {
            padding: 0.875rem 0.5rem !important;
          }

          .${styles.left} span,
          .${styles.bar} > div:last-child span {
            font-size: 0.9rem !important;
          }

          .${styles.iconBtn} {
            padding: 0.5rem 0.75rem !important;
          }
        }

        /* Small Tablet - Small screens */
        @media (max-width: 768px) {
          .${styles.bar} {
            flex-direction: column !important;
            gap: 1rem !important;
            padding: 1rem 0.5rem !important;
          }

          .${styles.left},
          .${styles.bar} > div:last-child {
            width: 100% !important;
            justify-content: center !important;
            text-align: center !important;
          }

          .${styles.left} {
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
          }

          .${styles.left} span,
          .${styles.bar} > div:last-child span {
            font-size: 0.875rem !important;
          }

          .${styles.iconBtn} {
            min-width: 44px !important;
            padding: 0.5rem !important;
          }
        }

        /* Mobile - Extra small screens */
        @media (max-width: 576px) {
          .${styles.bar} {
            padding: 0.75rem 0.25rem !important;
            gap: 0.75rem !important;
          }

          .${styles.left} span,
          .${styles.bar} > div:last-child span {
            font-size: 0.75rem !important;
          }

          .${styles.customSelect} {
            margin: 0 0.25rem !important;
          }

          .${styles.selectField} {
            font-size: 0.75rem !important;
            padding: 0.3rem 1.75rem 0.3rem 0.5rem !important;
            min-width: 55px !important;
          }

          .${styles.iconBtn} {
            padding: 0.4rem !important;
            min-width: 40px !important;
          }

          .${styles.customSelect} i {
            font-size: 0.7rem !important;
            right: 0.5rem !important;
          }
        }

        /* Very Small Mobile */
        @media (max-width: 380px) {
          .${styles.bar} {
            padding: 0.5rem 0.125rem !important;
          }

          .${styles.left} span,
          .${styles.bar} > div:last-child span {
            font-size: 0.7rem !important;
          }

          .${styles.selectField} {
            font-size: 0.7rem !important;
            padding: 0.25rem 1.5rem 0.25rem 0.4rem !important;
            min-width: 50px !important;
          }

          .${styles.iconBtn} {
            padding: 0.35rem !important;
            min-width: 38px !important;
            font-size: 0.8rem !important;
          }
        }
      `}</style>

      <div className={`${styles.bar} ${darkMode ? styles.barDark : ""}`}>
        <div className={styles.left}>
          <span>Showing </span>

          <div className={`${styles.customSelect} ${darkMode ? styles.customSelectDark : ""}`}>
            <select
              className={`${styles.selectField} ${darkMode ? styles.selectFieldDark : ""}`}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <i
              className={`fa-solid fa-chevron-down ${darkMode ? styles.iconWhite : "text-black"}`}
            ></i>
          </div>

          <span>of {totalResults} Results</span>
        </div>

        <div>
          <span>Page {pageNumber} of {totalPages}</span>

          <button
            className={`${styles.iconBtn} ${darkMode ? styles.iconBtnDark : ""}`}
            onClick={handlePrev}
            disabled={!canPrev}
            aria-label="Previous page"
          >
            <i className={`fa-solid fa-chevron-left ${darkMode ? styles.iconWhite : ""}`} />
          </button>

          <button
            className={`${styles.iconBtn} ${darkMode ? styles.iconBtnDark : ""}`}
            onClick={handleNext}
            disabled={!canNext}
            aria-label="Next page"
          >
            <i className={`fa-solid fa-chevron-right ${darkMode ? styles.iconWhite : ""}`} />
          </button>
        </div>
      </div>
    </>
  );
}