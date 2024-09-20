import React from "react";
import { Link, NavLink } from "react-router-dom";
import Header from "./Header";
import Bookmark from "./BookMark";


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
            <Bookmark/>
          </div>
        
          <div >
           
          </div>
       
    </>
  );
}

export default NavBar;
