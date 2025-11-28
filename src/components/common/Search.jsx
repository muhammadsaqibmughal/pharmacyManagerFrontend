const Search = ({ searchTerm, setSearchTerm , type , placeholder }) => {
  return (
    <>
        <div className="mb-4 bg-search-50 rounded-full">
          <input
            type = {type ? type : "text"}
            placeholder={placeholder || "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full  rounded-full  outline-none text-sm font-semibold"
          />
        </div>
    </>
  );
};

export default Search;
