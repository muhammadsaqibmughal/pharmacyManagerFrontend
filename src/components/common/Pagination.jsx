const Pagination = ({ currentPage, totalPages, onPrev, onNext, theme }) => (
  <div className={`flex justify-between max-md:justify-center max-md:items-center  flex-col md:flex-row w-full max-md:gap-2 px-4 rounded-full py-3 border-t ${theme === "dark" ? "bg-white/20 border-white/20" : "bg-white/10 border-white/20"}`}>
    <button
      className="px-4 py-1 bg-bg-50  text-white rounded-full disabled:opacity-40"
      onClick={onPrev}
      disabled={currentPage === 1}
    >
      Previous
    </button>
    <span className={`text-sm  ${theme === "dark" ? "text-light-50" : "text-primary-50"}`}>
      Page {currentPage} of {totalPages}
    </span>
    <button
      className="px-4 py-1 bg-bg-50 text-white rounded-full disabled:opacity-40"
      onClick={onNext}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
);

export default Pagination;
