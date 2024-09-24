
interface HeaderProps {
title: string;
}


function Head ({ title } : HeaderProps)  {
  return (
    <div>
      <img/>
      <div >
        <h1>
          {title && title}
        </h1>
      </div>
    </div>
  );
}














export default Head;
