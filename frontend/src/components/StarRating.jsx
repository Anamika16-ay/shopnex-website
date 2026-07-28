export default function StarRating({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= full) stars.push(<i key={i} className="fa-solid fa-star"></i>);
    else if (half && i === full + 1) stars.push(<i key={i} className="fa-solid fa-star-half-stroke"></i>);
    else stars.push(<i key={i} className="fa-regular fa-star"></i>);
  }

  return <>{stars}</>;
}
