import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const bannersRef = ref(db, "banners");
    const unsubscribe = onValue(bannersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const bannerList = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setBanners(bannerList);
      } else {
        setBanners([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000, 
    speed: 1000, 
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
  };

  if (banners.length === 0) return null;

  return (
    <div className="w-full overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <img
  src={banner.image}
  alt="Banner"
  className="w-full max-h-[300px] md:max-h-[450px] object-cover rounded-lg"
/>

          </div>
        ))}
      </Slider>
    </div>
  );
}
