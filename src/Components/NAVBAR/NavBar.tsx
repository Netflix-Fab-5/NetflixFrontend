import React from "react";
import { Link, NavLink } from "react-router-dom";
import Header from "./Header";
import BookmarkButton from "./BookMarkButton";
import MoviesButton from "./AllMoviesButton";


function NavBar() {
 
  return (
    <>
    
          <div >
            <Header title={"NETFLIX"}/>
            <form >
              <button
                type="submit"
              >
             
              </button>
              <input
                type="text"
                placeholder="Search Movie Name from here"
              />
            </form>
            <BookmarkButton/>
            <MoviesButton/>
          </div>
        
          <div >
           
          </div>
       
    </>
  );
}

export default NavBar;
