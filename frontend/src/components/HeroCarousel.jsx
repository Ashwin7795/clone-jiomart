import banner1 from "../assets/banners/banner1.jpg";
import banner2 from "../assets/banners/banner2.jpg";
import banner3 from "../assets/banners/banner3.jpg";
import banner4 from "../assets/banners/banner4.jpg";


const banners = [
  banner1,
  banner2,
  banner3,
  banner4,
];

const [current, setCurrent] = useState(0);

useEffect(() => {

  const interval = setInterval(() => {

    setCurrent((prev) =>
      (prev + 1) % banners.length
    );

  }, 3000);

  return () => clearInterval(interval);

}, []);


<div className="w-full overflow-hidden rounded-2xl">

  <img
    src={banners[current]}
    className="w-full h-auto"
  />

</div>